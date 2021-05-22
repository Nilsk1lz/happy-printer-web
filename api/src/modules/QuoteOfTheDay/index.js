var Handlebars = require("handlebars");
var fs = require("fs");
var Axios = require("axios");
var path = require("path");

const source = fs.readFileSync(
  path.join(appRoot, "src", "modules", "QuoteOfTheDay", "QuoteOfTheDay.hbs"),
  {
    encoding: "utf8",
  }
);

const template = Handlebars.compile(source);

module.exports = function generate(filePath) {
  return new Promise((resolve, reject) => {
    Axios.get(`https://quotes.rest/qod`)
      .then(({ data }) => {
        if (data.success) {
          const quoteObj = data.contents.quotes[0];
          const result = template(quoteObj);
          fs.writeFile(path.join(appRoot, filePath), result, (err) => {
            if (err) console.log(err);
            resolve();
          });
        }
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};
