const openHH = require("./modules/scrapper");
const input = require("./modules/input");

async function app() {
  console.log(
    `   __ ____ __  _________________ __  ___  ___   ___  ___________ `
  );
  console.log(
    `  / // / // / /_  __/ __/ ___/ // / / _ \u005C/ _ | / _ \u005C/ __/ __/ _ \u005C`
  );
  console.log(
    ` / _  / _  /   / / / _// /__/ _  / / ___/ __ |/ . _/\u005C \u005C/ _// . _/`
  );
  console.log(
    `/_//_/_//_/   /_/ /___/\u005C___/_//_/ /_/  /_/ |_/_/|_/___/___/_/|_| `
  );
  console.log(
    "\nHELLO! It's HHTechParser app from MR.DROG!\nREAD BEFORE START -->"
  );
  console.log(
    "\nThis application uses a famous job website to return an Excel file with most popular IT technologies for today.\nApp will ask you to enter vacancy for search, and then how many vacancies to process.\nHope this application will help you understand what to learn next to be in demand.\nP.S. The application doesn't work with the English version of website.\nGood luck!"
  );
  const searchingVacancy = await input.inputSearch();
  try {
    await openHH(searchingVacancy);
    await input.inputEnd();
  } catch (err) {
    console.log(
      "Crash because of error: ",
      err.message,
      "\nPlease close app and restart it one more time, it will help."
    );
  }
}

app();
