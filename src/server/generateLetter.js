const pdf = require("html-pdf");

generateLetter = (request, response) => {
  console.log("IN HERE");
  //const html = document.getElementsByTagName("main")[0].innerHTML;
  console.log("Request body:", request.body);
  let pdfContent = null;
  pdf
    .create(request.body.html, {
      phantomPath: "/usr/bin/phantomjs",
      timeout: 100000,
      format: "Letter"
    })
    .toBuffer(function(err, buffer) {
      if (err) {
        console.log("Error:", err);
        throw err;
      }
      console.log("This is a buffer:", Buffer.isBuffer(buffer));
      pdfContent = buffer;
    });

  response.send(pdfContent);
  //return pdfContent;

  //   const htmlDoc = document.getElementsByTagName("main")[0];
  //   const converted = await generateDocx(htmlDoc.innerHTML);
  //
  //   console.log("Word doc is :", converted);
  //   return {
  //     mime:
  //       "application/pdf",
  //     filename: "caseLetter.docx",
  //     contents: converted
  //   };
};

module.exports = generateLetter;
