import mockFflipObject from "../../../testHelpers/mockFflipObject";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import uploadAttachment from "./uploadAttachment";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import httpMocks from "node-mocks-http";
import Busboy from "busboy";
import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import { auditFileAction } from "../../audits/auditFileAction";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditUpload from "../referralLetters/sharedLetterUtilities/auditUpload";

jest.mock("../referralLetters/sharedLetterUtilities/auditUpload");
jest.mock("../../getCaseHelpers");
jest.mock("../../audits/auditFileAction");
jest.mock("../../audits/auditDataAccess");
jest.mock("../referralLetters/sharedLetterUtilities/uploadLetterToS3");
jest.mock("../../getCaseHelpers", () => {
  return {
    getCaseWithAllAssociationsAndAuditDetails: jest.fn(
      (caseId, transaction) => {
        return {
          caseDetails: {},
          auditDetails: {}
        };
      }
    )
  };
});

jest.mock("busboy");
Busboy.mockImplementation(() => {
  return {
    on: jest.fn(async (field, func) => {
      if (field === "field") {
        await func("description", "dummy description");
      }
      if (field === "file") {
        await func(jest.fn(), jest.fn(), "test_filename", jest.fn(), jest.fn());
      }
    })
  };
});

jest.mock("../../../createConfiguredS3Instance");
createConfiguredS3Instance.mockImplementation(() => {
  return {
    upload: jest.fn(() => {
      return {
        promise: () => {
          return Promise.resolve("Successful S3 upload");
        }
      };
    })
  };
});

describe("uploadAttachment", () => {
  let request, response, next, existingCase;

  const testUser = "Rabbid Penguin";

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    response = httpMocks.createResponse();
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: testUser
    });

    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("new audit feature toggle is turned on", () => {
    test("should call auditFileAction when uploading an attachment", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: true
      });

      uploadLetterToS3.mockClear();

      await uploadAttachment(request, response, next);

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.UPLOADED,
        "test_filename",
        AUDIT_FILE_TYPE.ATTACHMENT,
        expect.anything()
      );
    });
  });

  describe("new audit feature toggle is turned off", () => {
    test("should call audit upload when uploading an attachment", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });

      uploadLetterToS3.mockClear();

      await uploadAttachment(request, response, next);

      expect(auditUpload).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_SUBJECT.ATTACHMENT,
        expect.objectContaining({
          fileName: ["test_filename"]
        }),
        expect.anything()
      );
    });
  });
});