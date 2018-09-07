const pdf = require("html-pdf");

generateLetter = (request, response) => {
  pdf
    .create(request.body.html, {
      phantomPath: "/usr/bin/phantomjs",
      timeout: 100000,
      format: "Letter"
    })
    .toFile("testpdf.pdf", function(err, res) {
      if (err) {
        console.log("Error:", err);
        throw err;
      }
      console.log("This is the filename:", res);
    });
  response.send("");
};

module.exports = generateLetter;
