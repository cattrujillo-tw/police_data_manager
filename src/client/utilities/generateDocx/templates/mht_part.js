const _ = require("lodash");

const contents = `------=mhtDocumentPart
Content-Type: <%= contentType %>
Content-Transfer-Encoding: <%= contentEncoding %>
Content-Location: <%= contentLocation %>

<%= encodedContent %>`;

const mhtPartTemplate = _.template(contents);

module.exports = { mhtPartTemplate };
