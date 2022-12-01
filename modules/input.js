const readline = require("readline");

//function for input searching phrase from the console
async function inputSearch() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let answer = await new Promise((resolve, reject) => {
    rl.question(`\n - Enter vacancy you want to search: `, (answer) => {
      resolve(answer);
    });
  });
  rl.close();
  return answer;
}

async function inputAmountOfVac(vacancies) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

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

async function inputEnd() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let answer = await new Promise((resolve, reject) => {
    rl.question(` - Press Enter to close the app...`, (answer) => {
      resolve(answer);
    });
  });
  rl.close();
}

module.exports = { inputSearch, inputEnd, inputAmountOfVac };
