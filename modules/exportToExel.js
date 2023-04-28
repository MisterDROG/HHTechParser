const ExcelJS = require("exceljs");

//adding founded list of techs to exel
async function eportToExel(dataToExport, exportFileName, amountOfVac, searchedVacancy) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `${amountOfVac} vacancy of "${searchedVacancy}"`
  );

  //creating filename with data
  const fileName = `HH-${exportFileName}-${new Date()
    .toISOString()
    .replace(/\:|\./g, "")}.xlsx`;

  //adding data to Excel rows
  for (let i = 0; i < dataToExport.length; i++) {
    const row = sheet.getRow(i);
    row.values = [dataToExport[i][0], dataToExport[i][1]];
  }

  //writing Excel file
  await workbook.xlsx
    .writeFile(fileName)
    .then(() => {
      console.log(
        "File with data was created in the folder of this app on your computer."
      );
    })
    .catch((err) => {
      console.log('Error while Excel: ',err.message);
    });
}

module.exports = eportToExel;
