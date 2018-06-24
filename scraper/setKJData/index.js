const fs = require("fs-extra");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const convertToJSON = require("./convertToJSON");

class SetKJData {
    async exe(writeTo) {
        try {
            const {books, baseURI} = await fs.readJson("setKJData/config.json");

            return writeTo === "db" ? this.writeToDB(books, baseURI, writeTo) : this.writeBookData(books, baseURI, writeTo);
        } catch(e) {
            throw new Error(`Couldn't populate the DB kjbible ${e.stack}`);
        }
    }

    async writeToDB(books, baseURI, writeTo) {
        mongoose.connect("mongodb://localhost:27017/kjbible");
        const db = mongoose.connection;
        db.on("error", err => new Error(`MongoDB broke with ${err}`));

        await this.writeBookData(books, baseURI, writeTo, db);

        console.log("SUCCESS! kjbible DB is now populated. Connection closing");
        db.close();
    }

    async writeBookData(books, baseURI, writeTo, db) {
        for(const {urlPart, chapterCount, testament, name} of books) {
            const chapter = await this.getChapterData(urlPart, chapterCount, baseURI);
            const collectionName = name;
            const completedBook = {
                "bookName": name,
                "testament": testament,
                "chapterCount": chapterCount,
                "chapters": chapter
            };

            writeTo === "db"
                ? db.collection(collectionName).insert(completedBook)
                : await fs.outputJson(`JSON/kjbible/${name}.json`, completedBook);

            console.log(`${name} was written to ${writeTo || "JSON"}`);
        }
    }

    async getChapterData(bookName, chapterCount, baseURI) {
        try {
            const promises = [];

            for (let chapterIDX = 1; chapterIDX <= chapterCount; chapterIDX++) {
                const url = SetKJData.setUrl(bookName, chapterIDX, baseURI);
                const chapterRequest = this.getChapter(url);
                promises.push(chapterRequest);
            }

            return Promise.all(promises);
        } catch(e) {
            throw new Error(`Couldn't get chapter data ${e.stack}`);
        }
    }

    async getChapter(url) {
        try {
            const scrapedChapter = await this.scrapeData(url);
            return convertToJSON.convert(scrapedChapter, url);
        } catch(e) {
            throw new Error(`Couldn't get chapter at ${url} ${e.stack}`);
        }
    }

    async scrapeData(url) {
        try {
            const res = await fetch(url);
            return res.text();
        } catch(err) {
            throw new Error(`Something broke while trying to scrape the data from ${url}: ${err.stack}`);
        }
    }

    static setUrl(bookName, chapterIDX, baseURI) {
        return `${baseURI}${bookName}/${chapterIDX}.htm`;
    }
}

module.exports = new SetKJData;