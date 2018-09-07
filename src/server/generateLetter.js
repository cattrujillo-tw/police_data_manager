const pdf = require("html-pdf");

generateLetter = (request, response) => {
  const content = "<div>contents</div>";
  pdf
    .create(content, {
      phantomPath: "/usr/bin/phantomjs",
      timeout: 100000,
      format: "Letter"
    })
    .toBuffer((error, buffer) => {
      response.send(buffer);
    });
};

module.exports = generateLetter;
