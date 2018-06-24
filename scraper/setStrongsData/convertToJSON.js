const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");
const qp = require("query-parse");

class ConvertToJSON {
    convert(scrapedDOM, url) {
        try {
            return this.setStrongsObj(scrapedDOM, url);
        } catch(err) {
            throw new Error(`Something broke while trying convert scraped data from ${url} to JSON: ${err.stack}`)
        }
    }
    
    setStrongsObj(scrapedDOM, url) {
        const window = (new JSDOM(scrapedDOM, { runScripts: "outside-only" })).window;
        const document = window.document;
        const lexTitle = document.getElementById("lexTitle");
        const lexTrans = document.getElementById("lexTrans");
        const lexPro = document.getElementById("lexPro");
        const outlineBiblical = document.getElementById("outlineBiblical");
        const strongsInfo = document.getElementById("strongsInfo");

        console.log(`strongs data for ${url} is about to be written to memory`);

        return {
            "strongsNumber": ConvertToJSON.getStrongsNumber(url),
            "originalWord": ConvertToJSON.getOriginalWord(lexTitle),
            "transliteration": ConvertToJSON.getTransliteration(lexTrans),
            "pronunciation": ConvertToJSON.getPronunciation(lexPro),
            "biblicalOutline": this.getOutline(outlineBiblical),
            "strongsInfo": this.getStrongsInfo(strongsInfo)
        }
    }

    static getStrongsNumber(url) {
        const query = url && url.split("?")[1];
        const parsedQuery = qp.toObject(query);
        return parseInt(parsedQuery.Strongs);
    }

    static getOriginalWord(lexTitle) {
        return lexTitle && _.get(lexTitle.querySelector("h6"), "textContent");
    };

    static getTransliteration(lexTrans) {
        return lexTrans && _.get(lexTrans.querySelector("em"), "textContent");
    }

    static getPronunciation(lexPro) {
        const text = lexPro && _.get(lexPro.querySelector(".lexicon-pronunc"), "textContent");
        const textNoWhitespace = text.replace(/\s/g, "");
        return textNoWhitespace.replace("(Key)Listen", "");
    };

    getOutline(outlineBiblical) {
        const outline = {};
        const ol = outlineBiblical.querySelector("ol");
        const childNodesArr = [...ol.children];
        const useLetters = false;

        return this.recursiveTree(outline, childNodesArr, useLetters);
    }

    recursiveTree(outline, childNodesArr, useLetters) {
        if(childNodesArr) {
            const listItems = childNodesArr.filter(node => node.nodeName === "LI");

            listItems.forEach((listItem, idx) => {
                const label = useLetters ? (idx + 10).toString(36) : (idx + 1);
                const itemText = _.get(listItem.querySelector("p"), "textContent");
                const lastNode = _.get(listItem, "lastChild");

                outline[label] = {
                    "text": itemText
                };

                if(lastNode.nodeName === "OL") {
                    outline[label].subList = {};
                    this.recursiveTree(outline[label].subList, [...lastNode.children], !useLetters);
                }
            });
        }

        return outline;
    }

    getStrongsInfo(strongsInfo) {
        const originalWord = _.get(strongsInfo.querySelector(".Hb"), "textContent");
        const englishRendering = _.get(strongsInfo.querySelector(".strgtrans"), "textContent");
        const strongsDefinitionString = this.getStrongsDefinitionString(strongsInfo);
        const strongsDefinitionArr = strongsDefinitionString.split(";");
        const pronuciation = strongsDefinitionArr.shift().trim();
        const definition = strongsDefinitionArr.join().trim();

        return {
            "originalWord": originalWord,
            "englishRendering": englishRendering,
            "pronuciation": pronuciation,
            "definition": definition
        }
    }

    getStrongsDefinitionString(strongsInfo) {
        const strongsInfoClone = strongsInfo.cloneNode(true);
        const strongsInfoCloneP = strongsInfoClone.querySelector("p");
        const stongsInfoSpans = [...strongsInfoClone.getElementsByTagName("span")];

        stongsInfoSpans.forEach((span) => {
            strongsInfoCloneP.removeChild(span);
        });

        return _.get(strongsInfoCloneP, "textContent");
    }
}

module.exports = new ConvertToJSON;