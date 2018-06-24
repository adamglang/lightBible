const program = require("commander");
const setKJData = require("./setKJData");
const setStrongsData = require("./setStrongsData");

program
    .version("0.0.1")
    .parse(process.argv);

const writeTo = program.args[0];
const singleScrape = program.args[1];

class Scraper {
    exe() {
        try {
            const scrapers = {
                "KJData": setKJData,
                "strongsData": setStrongsData
            };

            const chosenScraper = scrapers[singleScrape];
            return ( chosenScraper && chosenScraper.exe(writeTo) || Scraper.scrapeAll() );

        } catch(e) {
            throw new Error(`Couldn't populate the DBs ${e.stack}`);
        }
    }

    static scrapeAll() {
        const KJData = setKJData.exe(writeTo);
        const strongsData = setStrongsData.exe(writeTo);

        return Promise.all(KJData, strongsData);
    }
}

const scraper = new Scraper;
module.exports = scraper.exe();