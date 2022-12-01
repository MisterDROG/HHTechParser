const ExcelJS = require("exceljs");

//adding founded list of techs to exel
async function exelExport(objData, filename, amountOfVac, searched) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `${amountOfVac} vacancy of "${searched}"`
  );

  const fileName = `HH-${filename}-${new Date()
    .toISOString()
    .replace(/\:|\./g, "")}.xlsx`;

  for (let i = 0; i < objData.length; i++) {
    const row = sheet.getRow(i);
    row.values = [objData[i][0], objData[i][1]];
  }

  await workbook.xlsx
    .writeFile(fileName)
    .then(() => {
      console.log(
        "File with data was created in the folder of this app on your computer."
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
}

module.exports = exelExport;
