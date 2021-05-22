var Handlebars = require('handlebars');
var fs = require('fs');
var Axios = require('axios');
var moment = require('moment');
var path = require('path');
const { on } = require('process');
var parseString = require('xml2js').parseString;
var SudokuToolCollection = require('sudokutoolcollection');

const source = fs.readFileSync(path.join(__dirname, 'DailySudoku.hbs'), {
  encoding: 'utf8',
});

const apiKey = '1vwgtky6bd8ufxt54bzpd8kqgzbf1ej4p0gaketat4cmrmfr9';

const template = Handlebars.compile(source);

module.exports = function generate(filePath) {
  return new Promise((resolve, reject) => {
    Axios.get(`https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`).then(({ data }) => {
      console.log(data);
      const result = template({
        word: data.word,
        definition: data.definitions[0],
      });

      fs.writeFile(path.join(appRoot, filePath), result, (err) => {
        if (err) console.log(err);
        resolve();
      });
    });
  });
};
