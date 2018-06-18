const Busboy = require("busboy");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const isDuplicateFileName = require("./isDuplicateFileName");
const createConfiguredS3Instance = require("./createConfiguredS3Instance");
const config = require("../../../config/config");
const DUPLICATE_FILE_NAME = require("../../../../sharedUtilities/constants")
    .DUPLICATE_FILE_NAME;
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const uploadAttachment = asyncMiddleware((request, response, next) => {
    let managedUpload;
    const caseId = request.params.id;
    const busboy = new Busboy({
        headers: request.headers
    });

    let attachmentDescription;

    busboy.on("field", function (fieldname, value) {
        if (fieldname === "description") {
            attachmentDescription = value;
        }
    });

    busboy.on("file", async function (
        fieldname,
        file,
        fileName,
        encoding,
        mimetype
    ) {
        const s3 = createConfiguredS3Instance();

        if (await isDuplicateFileName(caseId, fileName)) {
            response.status(409).send(DUPLICATE_FILE_NAME);
        } else {
            managedUpload = s3.upload({
                Bucket: config[process.env.NODE_ENV].s3Bucket,
                Key: `${caseId}/${fileName}`,
                Body: file,
                ServerSideEncryption: "AES256"
            });

            //The AWS S3 JS SDK has a non-standard promise implementation.
            //The success function and error functions are passed as arguments to then().
            //This means that we can't use await.
            //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html
            const promise = managedUpload.promise();
            promise.then(async function (data) {
                const updatedCase = await
                    models.sequelize.transaction(async t => {
                        await models.attachment.create(
                            {
                                fileName: fileName,
                                description: attachmentDescription,
                                caseId: caseId
                            },
                            {
                                transaction: t,
                                auditUser: request.nickname
                            }
                        );

                        return await getCaseWithAllAssociations(caseId, t);
                    });
                response.send(updatedCase);
            },
            function (err) {
                next(err)
            });
        }
    });

    request.on("close", () => {
        managedUpload.abort();
    });

    request.pipe(busboy);
});

module.exports = uploadAttachment;
