var Handlebars = require("handlebars");
var fs = require("fs");
var Axios = require("axios");
var moment = require("moment");
var path = require("path");
const { on } = require("process");
var parseString = require("xml2js").parseString;

const source = fs.readFileSync(path.join(__dirname, "BBCNews.hbs"), {
  encoding: "utf8",
});

const template = Handlebars.compile(source);

module.exports = function generate(filePath) {
  const config = require("./config.json");
  return new Promise((resolve, reject) => {
    Axios.get(`http://feeds.bbci.co.uk/${config.feed}/rss.xml`)
      .then(({ data }) => {
        parseString(data, (err, json) => {
          const channel = json.rss.channel[0].item;
          const news = {
            headline: channel[0].title,
            story: channel[0].description,
            stories: [channel[1], channel[2], channel[3]],
            time: moment().format("hA"),
            date: moment().format("D MMM YYYY"),
          };
          const result = template(news);
          fs.writeFile(path.join(appRoot, filePath), result, (err) => {
            if (err) console.log(err);
            resolve();
          });
        });
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};
