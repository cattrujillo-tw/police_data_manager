const _ = require("lodash");

const contents = `MIME-Version: 1.0
Content-Type: multipart/related;
    type="text/html";
    boundary="----=mhtDocumentPart"


------=mhtDocumentPart
Content-Type: text/html;
    charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Location: file:///C:/fake/document.html

<%= htmlSource %>

<%= contentParts %>

------=mhtDocumentPart--`;

const mhtDocumentTemplate = _.template(contents);

module.exports = { mhtDocumentTemplate };
