const fs = require("fs-extra");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const _ = require("lodash");
const convertToJSON = require("./convertToJSON");

mongoose.connect("mongodb://localhost:27017/strongsdata");
const db = mongoose.connection;
db.on("error", err => new Error(`MongoDB broke with ${err}`));

class SetStrongsData {
    async exe(arg) {
        try {
            const {baseURI, languages} = await fs.readJson("setStrongsData/config.json");
            const writeTo = arg === "db" ? "DataBase" : "JSON";

            for(const languageData of languages) {
                const completedLanguageData = {};
                const strongsData = await this.getStrongsData(languageData, baseURI);
                const processedStrongsData = this.setStrongsData(strongsData, completedLanguageData);
                const collectionName = languageData.language;

                writeTo === "DataBase"
                    ? db.collection(collectionName).insert(completedLanguageData)
                    : await fs.outputJson(`JSON/strongsdata/${languageData.language}.json`, processedStrongsData);

                console.log(`Strongs ${languageData.language} data was written to ${writeTo}`);
            }

            db.close();
            console.log("SUCCESS! strongsdata DB is now populated. Connection closing");

        } catch(e) {
            throw new Error(`Couldn't populate the db strongsdata ${e.stack}`);
        }
    }

    setStrongsData(strongsData, completedLanguageData) {
        strongsData.forEach((strongsDataItem, idx) => {
            const strongsNumber = idx + 1;
            completedLanguageData[strongsNumber] = strongsDataItem;
        });

        return completedLanguageData;
    };

    async getStrongsData({totalNumbers, denotedBy, language}, baseURI) {
        try {
            const result = [];

            for(let counter = 1; counter <= totalNumbers; counter++) {
                const url = SetStrongsData.setUrl(baseURI, denotedBy, counter);
                const strongsNumberData = await this.getStrongsNumberData(url);
                result.push(strongsNumberData);
            }

            return await Promise.all(result);
        } catch(e) {
            throw new Error(`could not set strongs ${language} data: ${e.stack}`);
        }
    }

    async getStrongsNumberData(url) {
        try {
            const scrapedDOM = await this.scrapeData(url);
            return convertToJSON.convert(scrapedDOM, url);
        } catch(e) {
            throw new Error(`couldn't get strongs number data for ${url} - ${e.stack}`)
        }

    }

    async scrapeData(url, tries) {
        try {
            const res = await fetch(url);
            return await res.text();
        } catch(e) {
            tries = tries || 1;

            if(tries < 50) {
                console.log(`Couldn't scrape ${url} on attempt number ${tries} - got ${e}... trying again`);
                return await this.scrapeData(url, tries);
            }

            throw new Error(`Something broke while trying to scrape the data from ${url}: ${e.stack}`);
        }
    }

    static setUrl(baseURI, denotedBy, strongsNumber) {
        return baseURI + denotedBy + strongsNumber;
    }
}

module.exports = new SetStrongsData;