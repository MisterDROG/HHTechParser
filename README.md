Discription:

This application uses a famous job website to return an Excel file with most popular IT technologies for today per each speciality.
App will ask to enter into console vacancy for search, and then how many vacancies to process.
This application can help to understand what to learn next to be in demand.
Right now application doesn't work with the English version of website.

The application has a built .exe file that can be run on any computer. Thus, the project was tested on real users.

Technologies used:

- Node.js
- Puppeteer - as parsing library
- Exeljs - for export results to Excel
- Pkg - for creating .exe file for using app without IDE
($ pkg main.js -t node14-win-x64 --public -> command to create .exe for win64)

Project development:

- The main module of the scraper application was written in the Hackathon mode in 12 hours, so it requires careful refactoring into submodules.
- Writing the server part and frontend for the further work of the project on the Internet.

Idea and realization by Igor Drogaytsev. Link to the video presentation:
https://disk.yandex.ru/i/xJNT4rdS3yY18w
