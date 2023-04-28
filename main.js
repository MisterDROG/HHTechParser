const openHH = require("./modules/scrapper");
const {inputSearch, inputEnd} = require("./modules/inputFunctions");
const showConsoleHeader = require("./modules/showConsoleHeader");

//main function which contains all sub modules of the APP
async function app() {
  showConsoleHeader()
  const searchingVacancy = await inputSearch();
  try {
    await openHH(searchingVacancy);
    await inputEnd();
  } catch (err) {
    console.log("Crash because of error: ", err.message, "\nPlease close app and restart it one more time, it can help.");
  }
}

app();
