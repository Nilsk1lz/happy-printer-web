var Handlebars = require("handlebars");
var fs = require("fs");
var Axios = require("axios");
var moment = require("moment");
var path = require("path");
const { on } = require("process");
var parseString = require("xml2js").parseString;
var SudokuToolCollection = require("sudokutoolcollection");

const source = fs.readFileSync(path.join(__dirname, "DailySudoku.hbs"), {
  encoding: "utf8",
});

const template = Handlebars.compile(source);

Handlebars.registerHelper("replace", function (find, replace, options) {
  var string = options.fn(this);
  return string.replace(find, replace);
});

module.exports = function generate(filePath, { difficulty = "hard" } = {}) {
  return new Promise((resolve, reject) => {
    const sudoku = SudokuToolCollection();
    const puzzle = sudoku.generator.generate(difficulty);
    const array = puzzle.split("");

    // Split array into 3 sections
    const a = array.slice(0, 27);
    const b = array.slice(27, 54);
    const c = array.slice(54, 81);

    // Split into rows
    const a1 = a.slice(0, 9);
    const a2 = a.slice(9, 18);
    const a3 = a.slice(18, 27);

    const b1 = b.slice(0, 9);
    const b2 = b.slice(9, 18);
    const b3 = b.slice(18, 27);

    const c1 = c.slice(0, 9);
    const c2 = c.slice(9, 18);
    const c3 = c.slice(18, 27);

    const data = {
      third: [
        {
          row: [{ cell: a1 }, { cell: a2 }, { cell: a3 }],
        },
        {
          row: [{ cell: b1 }, { cell: b2 }, { cell: b3 }],
        },
        {
          row: [{ cell: c1 }, { cell: c2 }, { cell: c3 }],
        },
      ],
    };

    const result = template(data);

    fs.writeFile(path.join(appRoot, filePath), result, (err) => {
      if (err) console.log(err);
      resolve();
    });
  });
};
