const { mhtDocumentTemplate } = require("./templates/mht_document");
const { mhtPartTemplate } = require("./templates/mht_part");

export const getMHTdocument = htmlSource => {
  // take care of images
  let imageContentParts;
  ({ htmlSource, imageContentParts } = _prepareImageParts(htmlSource));
  // for proper MHT parsing all '=' signs in html need to be replaced with '=3D'
  htmlSource = htmlSource.replace(/\=/g, "=3D");
  return mhtDocumentTemplate({
    htmlSource,
    contentParts: imageContentParts.join("\n")
  });
};

const _prepareImageParts = htmlSource => {
  const imageContentParts = [];
  const inlinedSrcPattern = /"data:(\w+\/\w+);(\w+),(\S+)"/g;
  // replacer function for images sources via DATA URI
  const inlinedReplacer = function(
    match,
    contentType,
    contentEncoding,
    encodedContent
  ) {
    const index = imageContentParts.length;
    const extension = contentType.split("/")[1];
    const contentLocation = `file:///C:/fake/image${index}.${extension}`;
    imageContentParts.push(
      mhtPartTemplate({
        contentType,
        contentEncoding,
        contentLocation,
        encodedContent
      })
    );
    return `\"${contentLocation}\"`;
  };

  if (typeof htmlSource === "string") {
    if (!/<img/g.test(htmlSource)) {
      return { htmlSource, imageContentParts };
    }

    htmlSource = htmlSource.replace(inlinedSrcPattern, inlinedReplacer);
    return { htmlSource, imageContentParts };
  } else {
    throw new Error("Not a valid source provided!");
  }
};
