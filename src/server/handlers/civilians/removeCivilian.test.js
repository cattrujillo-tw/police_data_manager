import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import removeCivilian from "./removeCivilian";
import { AUDIT_SUBJECT } from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";

const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

jest.mock("../audits/auditDataAccess");

describe("removeCivilian", function() {
  let existingCase, response, next, request, existingCivilian;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
    response = httpMocks.createResponse();
    next = jest.fn();
    const existingCivilians = await existingCase.getComplainantCivilians();
    existingCivilian = existingCivilians[0];
    request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        civilianId: existingCivilian.id
      },
      body: {
        address: {
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
  });

  describe("auditing", () => {
    test("should audit case details access when civilian removed", async () => {
      await removeCivilian(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
