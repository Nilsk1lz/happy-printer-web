var Handlebars = require('handlebars');
var fs = require('fs');
var Axios = require('axios');
var moment = require('moment');
var path = require('path');
const { on } = require('process');
var parseString = require('xml2js').parseString;

const source = fs.readFileSync(path.join(__dirname, 'FontTest.hbs'), {
  encoding: 'utf8',
});

const template = Handlebars.compile(source);

module.exports = function generate(filePath) {
  const config = require('./config.json');
  return new Promise((resolve, reject) => {
    const result = template();
    fs.writeFile(path.join(appRoot, filePath), result, (err) => {
      if (err) console.log(err);
      resolve();
    });
  });
};
