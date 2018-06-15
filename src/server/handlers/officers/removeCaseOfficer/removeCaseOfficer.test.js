import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import httpMocks from "node-mocks-http";
import { WITNESS } from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../requestTestHelpers";
import removeCaseOfficer from "./removeCaseOfficer";

describe("removeCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  let existingCase, existingCaseOfficer, next, response;
  beforeEach(async () => {
    next = jest.fn();
    response = httpMocks.createResponse();

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withSupervisorOfficerNumber(undefined)
      .build();
    const createdOfficer = await models.officer.create(officerAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(createdOfficer.id)
      .withRoleOnCase(WITNESS)
      .build();
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withWitnessOfficers([caseOfficerAttributes])
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      include: {
        model: models.case_officer,
        as: "witnessOfficers",
        auditUser: "someone"
      },
      auditUser: "someone"
    });
    existingCaseOfficer = existingCase.witnessOfficers[0];
  });

  test("should remove existing officer from case", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        caseOfficerId: existingCaseOfficer.id
      },
      nickname: "someone"
    });

    await removeCaseOfficer(request, response, next);
    const removedCaseOfficer = await models.case_officer.findById(
      existingCaseOfficer.id
    );

    expect(removedCaseOfficer).toEqual(null);
  });
});
