const puppeteer = require("puppeteer");
const url = require("url");
const addToExel = require("./addToExel");
const input = require("./input");

const path = require("path");
const os = require("os");
const tmpPath = os.tmpdir();
const chromePath = path.join(tmpPath, ".local-chromium");

// import { join } from "path";
// import { tmpdir } from "os";
// const tmpPath = tmpdir();
// const chromePath = join(tmpPath, ".local-chromium");

const searchingPage =
  "https://hh.ru/search/vacancy?search_field=name&search_field=company_name&search_field=description&text=";
const loadingDelay = 2000;
const regExp = /[A-Z]+[0-9]*[\-\s\.\+\#]?[A-Z0-9]*/gi;

//function for getting list with urls of searched vacancies
async function urlsPush(page) {
  const vacUrls = await page.evaluate(() => {
    const URLs = document.querySelectorAll("a.serp-item__title");
    return Object.values(URLs).map((url) => {
      return url.href;
    });
  });
  return vacUrls;
}

//function for sorting object
function objectSorting(obj) {
  let sortable = [];
  for (let key in obj) {
    sortable.push([key, obj[key]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  return sortable;
}

//function for getting text from vacancy discription
async function getVacDiscription(pagePuppeteer) {
  let vacText = await pagePuppeteer.evaluate(() => {
    const contentBox = document.querySelector(".g-user-content");
    const allSpans = contentBox.querySelectorAll("span");
    let text = "";
    Object.values(allSpans).forEach((span) => {
      text = text + " " + span.innerText;
    });
    return text;
  });
  return vacText;
}

//main scrapping function
async function openHH(vacancy) {
  console.log(
    "If it is your first usage, it will take ~ 60 sec to download chromium engine. Next time it won't happen."
  );
  const browserFetcher = await puppeteer.createBrowserFetcher({
    path: chromePath,
  });
  const revisionInfo = await browserFetcher.download("1056772");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: revisionInfo.executablePath,
  });
  console.log(
    `Downloaded! Afterall you can delete it from: ${revisionInfo.executablePath}`
  );

  console.log("Please wait for initial data loading (~ 15 sec)...");

  const searchingVacancy = vacancy;

  const pagePuppeteer = await browser.newPage();

  // open webpage with vacancies search for scrapping
  pagePuppeteer.goto(searchingPage, {
    waitUntil: "load",
    timeout: 60000,
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));

  //close region selection popup
  try {
    await pagePuppeteer.click(
      "body > div.Bloko-Notification-Manager.notification-manager > div > div > div > div.bloko-notification__body > div.bloko-notification__close > svg > path"
    );
  } catch (err) {
    console.log(
      "Crash because of error: ",
      err.message,
      "\nPlease restart app, it will help."
    );
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, loadingDelay));

  //input searching vacanicy

  await pagePuppeteer.type("#a11y-search-input", searchingVacancy);
  await new Promise((resolve) => setTimeout(resolve, loadingDelay));

  //press search button
  pagePuppeteer.click(
    "#HH-React-Root > div > div.supernova-navi-search-wrapper.supernova-navi-search-wrapper_expanded.supernova-navi-search-wrapper_search-page > div.supernova-navi-search > div > div.supernova-navi-search-columns > div > div > form > div > div.supernova-search-group__submit > button",
    { waitUntil: "load", timeout: 0 }
  );
  await new Promise((resolve) => setTimeout(resolve, loadingDelay));

  //getting number of vacancies from search result
  const numberOfVacaтcies = await pagePuppeteer.$eval(
    "#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div.bloko-column.bloko-column_xs-0.bloko-column_s-8.bloko-column_m-12.bloko-column_l-16 > div > h1",
    (el) => el.innerText
  );
  console.log("\nAmount of vacancies found: ", numberOfVacaтcies);

  //getting amount of pages of searching result to scrap (two variants of display on the web page)
  const amountOfPages = await pagePuppeteer.evaluate(() => {
    try {
      const maxPagesYes = document.querySelector(
        "div.bloko-gap.bloko-gap_top > div.pager > span.pager-item-not-in-short-range > span.pager-item-not-in-short-range > a.bloko-button > span"
      );
      if (maxPagesYes) {
        return Number(maxPagesYes.innerText);
      } else {
        let pagesButtons = document.querySelector(
          "div.bloko-gap.bloko-gap_top > div.pager"
        ).childNodes;
        return Number(
          pagesButtons[pagesButtons.length - 2].querySelector("span").innerText
        );
      }
    } catch (err) {
      return 1;
    }
  });
  console.log("Amount of pages with results: ", amountOfPages);

  const amountOfVacToScrap = await input.inputAmountOfVac(
    numberOfVacaтcies.match(/[0-9]+/)
  );

  let vacUrlsAll = [];
  console.log("\nStart searching vacancy links...");
  if (amountOfPages == 1) {
    vacUrlsAll = [...vacUrlsAll, ...(await urlsPush(pagePuppeteer))];
  } else {
    //move to the second page to get url from second page to make urls for next search pages in future (only on this page we get url with query params of page number)
    pagePuppeteer.click(
      "#HH-React-Root > div > div.HH-MainContent.HH-Supernova-MainContent > div.main-content > div > div:nth-child(3) > div.sticky-sidebar-and-content--NmOyAQ7IxIOkgRiBRSEg > div.bloko-column.bloko-column_xs-4.bloko-column_s-8.bloko-column_m-9.bloko-column_l-13 > div > div.bloko-gap.bloko-gap_top > div > span:nth-child(2) > a"
    );
    await new Promise((resolve) => setTimeout(resolve, loadingDelay));
    const pageUrl = await pagePuppeteer.url();
    let currentUrl = new URL(pageUrl);

    //going through all pages of search with collecting urls of vacansies
    for (let i = 0; i < amountOfPages; i++) {
      currentUrl.searchParams.set("page", `${i}`);

      pagePuppeteer.goto(currentUrl);
      await new Promise((resolve) => setTimeout(resolve, loadingDelay));
      try {
        console.log(
          "Found vacancies links from",
          i + 1,
          "out of",
          amountOfPages,
          "pages with results"
        );
        vacUrlsAll = [...vacUrlsAll, ...(await urlsPush(pagePuppeteer))];
      } catch (err) {
        console.log("Error in parsing", i + 1, "page: ", err.message);
        vacUrlsAll = vacUrlsAll;
      }
    }
  }

  //scrap pages, collect amount of technologies on them
  let totalTechs = {};
  let amountOfErrorsInVac = 0;
  console.log("\nStart searching technologies from vacancies links...");
  for (let i = 0; i < amountOfVacToScrap && i < vacUrlsAll.length; i++) {
    pagePuppeteer.goto(vacUrlsAll[i]);
    await new Promise((resolve) => setTimeout(resolve, loadingDelay));
    let vacText = "";
    try {
      vacText = await getVacDiscription(pagePuppeteer);
    } catch (err) {
      console.log("Page download error: ", err.message);
    }

    const techsFromDiscription = vacText.match(regExp);

    if (techsFromDiscription !== null) {
      let techsFromDiscriptionLow = techsFromDiscription.map((word) => {
        switch (word.charAt(word.length - 1)) {
          case "-":
            word = word.replace("-", "");
          case " ":
            word = word.replace(" ", "");
          case ".":
            word = word.replace(".", "");
        }
        return word.toLowerCase();
      });

      techsFromDiscriptionLow.forEach((name) => {
        if (name in totalTechs) {
          totalTechs[name] = totalTechs[name] + 1;
        } else {
          totalTechs[name] = 1;
        }
      });
    } else {
      console.log("NO DATA IN VACANCY!!!: ", vacUrlsAll[i]);
      amountOfErrorsInVac += 1;
    }

    console.log(
      "Parsed:",
      i + 1,
      "out of:",
      Number(amountOfVacToScrap),
      "vacancies. Link:",
      vacUrlsAll[i]
    );
  }

  console.log(
    "\nFINISHED: Everything OK. Only in",
    amountOfErrorsInVac,
    "vacancies was no data."
  );
  await addToExel(
    objectSorting(totalTechs),
    searchingVacancy,
    amountOfVacToScrap,
    vacancy
  );

  await pagePuppeteer.close();
  await browser.close();
}

module.exports = openHH;
