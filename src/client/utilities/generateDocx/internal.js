const { documentTemplate } = require("./templates/document");
const utils = require("./utils");
const _ = { merge: require("lodash.merge") };

export const generateDocument = async zip => {
  return await zip.generateAsync({ type: "arraybuffer" }).then(buffer => {
    if (global.Blob) {
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      return blob;
    } else if (global.Buffer) {
      return new Buffer(new Uint8Array(buffer));
    } else {
      throw new Error(
        "Neither Blob nor Buffer are accessible in this environment. " +
          "Consider adding Blob.js shim"
      );
    }
  });
};

const renderDocumentFile = documentOptions => {
  if (documentOptions == null) {
    documentOptions = {};
  }
  const templateData = _.merge(
    {
      margins: {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440,
        header: 720,
        footer: 720,
        gutter: 0
      }
    },
    (() => {
      switch (documentOptions.orientation) {
        case "landscape":
          return { height: 12240, width: 15840, orient: "landscape" };
        default:
          return { width: 12240, height: 15840, orient: "portrait" };
      }
    })(),
    { margins: documentOptions.margins }
  );
  const t = documentTemplate(templateData);
  return t;
};

export const addFiles = (zip, htmlSource, documentOptions) => {
  zip.file(
    "[Content_Types].xml",
    new Buffer(
      "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8VHlwZXMgeG1sbnM9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9wYWNrYWdlLzIwMDYvY29udGVudC10eXBlcyI+CiAgPERlZmF1bHQgRXh0ZW5zaW9uPSJyZWxzIiBDb250ZW50VHlwZT0KICAgICJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtcGFja2FnZS5yZWxhdGlvbnNoaXBzK3htbCIgLz4KICA8T3ZlcnJpZGUgUGFydE5hbWU9Ii93b3JkL2RvY3VtZW50LnhtbCIgQ29udGVudFR5cGU9CiAgICAiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQubWFpbit4bWwiLz4KICA8T3ZlcnJpZGUgUGFydE5hbWU9Ii93b3JkL2FmY2h1bmsubWh0IiBDb250ZW50VHlwZT0ibWVzc2FnZS9yZmM4MjIiLz4KPC9UeXBlcz4K",
      "base64"
    )
    // fs.readFileSync(__dirname + "/assets/content_types.xml")
  );
  zip
    .folder("_rels")
    .file(
      ".rels",
      new Buffer(
        "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8UmVsYXRpb25zaGlwcyB4bWxucz0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzIj4KICA8UmVsYXRpb25zaGlwCiAgICAgIFR5cGU9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L3JlbGF0aW9uc2hpcHMvb2ZmaWNlRG9jdW1lbnQiCiAgICAgIFRhcmdldD0iL3dvcmQvZG9jdW1lbnQueG1sIiBJZD0iUjA5YzgzZmFmYzA2NzQ4OGUiIC8+CjwvUmVsYXRpb25zaGlwcz4K",
        "base64"
      )
    );
  // .file(".rels", fs.readFileSync(__dirname + "/assets/rels.xml"));
  zip
    .folder("word")
    .file("document.xml", renderDocumentFile(documentOptions))
    .file("afchunk.mht", utils.getMHTdocument(htmlSource))
    .folder("_rels")
    .file(
      "document.xml.rels",
      new Buffer(
        "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8UmVsYXRpb25zaGlwcyB4bWxucz0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzIj4KICA8UmVsYXRpb25zaGlwIFR5cGU9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L3JlbGF0aW9uc2hpcHMvYUZDaHVuayIKICAgIFRhcmdldD0iL3dvcmQvYWZjaHVuay5taHQiIElkPSJodG1sQ2h1bmsiIC8+CjwvUmVsYXRpb25zaGlwcz4K",
        "base64"
      )
      // fs.readFileSync(__dirname + "/assets/document.xml.rels")
    );
};
