const pdf = require("html-pdf");
const fs = require("fs");
const asyncMiddleware = require("../asyncMiddleware");
const util = require("util");

generateLetter = asyncMiddleware(async (request, response) => {
  const promisifyReadFile = util.promisify(fs.readFile);
  const fileContents = await promisifyReadFile(
    "./src/server/handlers/letters/letter.html"
  );
  pdf
    .create(fileContents.toString(), {
      phantomPath: "/usr/bin/phantomjs",
      timeout: 100000,
      width: "8.5in",
      height: "11in",
      border: "0.5in",
      header: { height: "1.3 in" },
      footer: { height: "0.7 in" },
      base: "file:///app/src/server/handlers/letters/images/"
    })
    .toBuffer((error, buffer) => {
      response.send(buffer);
    });
});

module.exports = generateLetter;
