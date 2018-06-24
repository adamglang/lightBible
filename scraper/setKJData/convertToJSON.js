const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");

class ConvertToJSON {
    convert(scrapedDOM, url) {
        try {
            this.verseNumber = 1;
            return this.buildChapterObj(scrapedDOM);
        } catch(err) {
            console.error(`Something broke while trying convert scraped data from ${url} to JSON: ${err.stack}`)
        }
    }

    buildChapterObj(scrapedDOM) {
        const window = (new JSDOM(scrapedDOM, { runScripts: "outside-only" })).window;
        const document = window.document;
        const chapterTitle = _.get(document.getElementById("topheading"), "textContent");
        const processedChapterTitle = chapterTitle && chapterTitle.replace(/\W+/g, " ").trim() || "";
        const chapter = document.querySelector(".chap");
        const passages = this.setPassages(chapter);

        return {
            "title": processedChapterTitle,
            "chapter": parseInt(processedChapterTitle.substring(1).replace( /^\D+/g, '')),
            "passages": passages
        };
    }

    setPassages(chapter) {
        const passages = [];
        const isHeading = p => p.classList.contains("hdg");
        const hasVerses = p => p.classList.contains("reg");
        const scrapedArray = [...chapter.getElementsByTagName("p")];
        const filteredArray = scrapedArray.filter(p => isHeading(p) || hasVerses(p));

        let passage;

        filteredArray.forEach((p) => {
            const passageHasVerses = _.get(passage, "verses.length");

            if(isHeading(p)) {
                if(passage) {
                    passages.push(passage);
                }

                passage = {
                    "title": p.textContent,
                    "verses": []
                };
            }

            else if(passageHasVerses) {
                passage.verses = passage.verses.concat(this.handleVerses(p, passage.verses));
            }

            else {
                passage.verses = this.handleVerses(p, passage.verses);
            }
        });

        passages.push(passage);

        return passages;
    };

    handleVerses(p, verses) {
        let verse;

        const isVerseNumber = node => node.tagName === "SPAN";
        const isText = node => node.tagName === "A";

        const result = [];
        const childrenArray = [...p.children];
        const filteredArray = childrenArray.filter(node => isVerseNumber(node) || isText(node));

        filteredArray.forEach(node => {
            if(isVerseNumber(node)) {
                if(verse) {
                    result.push(verse);
                }

                verse = {
                    "verseNumber": this.verseNumber,
                    "text": []
                };

                this.verseNumber = this.verseNumber + 1;
            }

            else if(verse && isText(node)) {
                const text = ConvertToJSON.setText(node);
                verse.text.push(text);
            }
        });

        result.push(verse);
        return result;
    };

    static setText(node) {
        const title = _.get(node, "title");
        const href = _.get(node, "href");
        const [strongsNumber, briefTranslation] = title.split(".");
        const strongsLanguage = href.includes("greek") ? "Greek" : "Hebrew";

        return {
            "text": node.textContent || "",
            "strongsNumber": parseInt(strongsNumber),
            "strongsLanguage": strongsLanguage
            //"briefTranslation": briefTranslation
        };
    };
}

module.exports = new ConvertToJSON;