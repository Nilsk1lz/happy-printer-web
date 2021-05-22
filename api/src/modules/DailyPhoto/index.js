var Handlebars = require("handlebars");
var fs = require("fs");
var Axios = require("axios");
var path = require("path");

const source = fs.readFileSync(path.join(__dirname, "DailyPhoto.hbs"), {
  encoding: "utf8",
});

const template = Handlebars.compile(source);

module.exports = function generate(filePath, { difficulty = "hard" } = {}) {
  return new Promise((resolve, reject) => {
    Axios.get(
      `https://api.unsplash.com/photos/random?query=black&white&featured=true&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID uj1B--g9uufh0im-Fl5NZX5Xc1PC9JI5cThlJSX4Hq4`,
        },
      }
    )
      .then(({ data }) => {
        const result = template({ source: data.urls.full });

        fs.writeFile(path.join(appRoot, filePath), result, (err) => {
          if (err) console.log(err);
          resolve();
        });
      })
      .catch(console.log);
  });
};
