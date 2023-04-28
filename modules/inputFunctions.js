const readline = require("readline");

//functions for input searching phrase from the console

//function to create interface for input
function createInputInterface() {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  return readlineInterface
}

//create input for name of vacancy
async function inputSearch() {
  const rl = createInputInterface()

  let answer = await new Promise((resolve, reject) => {
    rl.question(`\n - Enter vacancy you want to search: `, (answer) => {
      resolve(answer);
    });
  });
  rl.close();
  return answer;
}

//create input for amount of vacancies you want to parse
async function inputAmountOfVac(vacancies) {
  const rl = createInputInterface()

  let answer = await new Promise((resolve, reject) => {
    rl.question(
      ` - Enter how many vacancies out of ${vacancies} you want to parse (1 vacancy ~ 2 sec): `,
      (answer) => {
        resolve(answer);
      }
    );
  });
  rl.close();
  return answer;
}

//create input to close the app
async function inputEnd() {
  const rl = createInputInterface()

  let answer = await new Promise((resolve, reject) => {
    rl.question(` - Press Enter to close the app...`, (answer) => {
      resolve(answer);
    });
  });
  rl.close();
}

module.exports = { inputSearch, inputEnd, inputAmountOfVac };
