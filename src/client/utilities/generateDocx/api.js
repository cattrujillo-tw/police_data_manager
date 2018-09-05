const JSZip = require("jszip");
const internal = require("./internal");

export default async (html, options) => {
  const zip = new JSZip();
  internal.addFiles(zip, html, options);
  return await internal.generateDocument(zip);
};
