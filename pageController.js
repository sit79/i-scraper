const pageScraper = require("./pageScraper");
const path = require("path");
const fs = require("fs");
const ora = require("ora");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedData = await pageScraper.scraper(browser);
    await browser.close();
    let spinner = ora("saving files").start();
    for (let entry of scrapedData) {
      let showTitle = entry["showTitle"].split(" "),
        shortTitle = "";
      for (let i = 3, k = showTitle.length - 3; i < k; i++) {
        shortTitle += showTitle[i] + " ";
      }
      shortTitle = shortTitle.trim();
      let showResult = "";
      for (let i = 0, k = entry["artists"].length; i < k; i++) {
        const artistAndTack = `${i + 1}. ${entry["artists"][i]} – ${
          entry["trackTitles"][i]
        } \n`;
        showResult += artistAndTack;
      }
      // path where I want the file on my computer
      const pathToShow = path.join(
        "../../../Music/Iggy Confidential",
        shortTitle
      );
      // save each show with proper title and the collected result as txt file
      fs.writeFileSync(`${pathToShow}.txt`, showResult, "utf-8", (err) => {
        if (err) return console.log(err);
      });
    }
    spinner.succeed().stop();
  } catch (error) {
    console.log("Could not resolve the browser instance => ", error);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
