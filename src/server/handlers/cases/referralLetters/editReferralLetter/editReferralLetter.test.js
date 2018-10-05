import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../models";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import Case from "../../../../../client/testUtilities/case";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import editReferralLetter from "./editReferralLetter";
import httpMocks from "node-mocks-http";
import ReferralLetterOfficer from "../../../../../client/testUtilities/ReferralLetterOfficer";
import ReferralLetterOfficerHistoryNote from "../../../../../client/testUtilities/ReferralLetterOfficerHistoryNote";
import Boom from "boom";

describe("edit referral letter", () => {
  describe("officer histories (letter officers with history notes)", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    let existingCase, referralLetter, caseOfficer, response, next;

    beforeEach(async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });

      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "test" }
      );

      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);

      const officer = await models.officer.create(officerAttributes, {
        auditUser: "test"
      });

      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(officer.id)
        .withFirstName("SpongeBob")
        .withLastName("SquarePants")
        .withCaseId(existingCase.id);

      caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
        auditUser: "test"
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    describe("no existing letter officer yet", () => {
      test("saves the letter officers if they do not exist yet", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);
        const createdLetterOfficers = await models.referral_letter_officer.findAll(
          {
            where: { caseOfficerId: caseOfficer.id },
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          }
        );
        expect(createdLetterOfficers.length).toEqual(1);
        const createdLetterOfficer = createdLetterOfficers[0];
        expect(createdLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(createdLetterOfficer.numHistoricalHighAllegations).toEqual(2);
        expect(createdLetterOfficer.numHistoricalMedAllegations).toEqual(3);
        expect(createdLetterOfficer.numHistoricalLowAllegations).toEqual(4);
        expect(createdLetterOfficer.historicalBehaviorNotes).toEqual(
          "<p>notes here</p>"
        );
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("adds two notes that are new on new letter officer", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                },
                {
                  tempId: "l9jwPODm8",
                  pibCaseNumber: "CC20180222-CS",
                  details: "This case was also very similar"
                }
              ],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);
        const createdLetterOfficer = await models.referral_letter_officer.findOne(
          {
            where: { caseOfficerId: caseOfficer.id },
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          }
        );
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(2);
        expect(createdLetterOfficer.referralLetterOfficerHistoryNotes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              referralLetterOfficerId: createdLetterOfficer.id,
              pibCaseNumber: "CC20180101-CS",
              details: "This case was very similar"
            }),
            expect.objectContaining({
              referralLetterOfficerId: createdLetterOfficer.id,
              pibCaseNumber: "CC20180222-CS",
              details: "This case was also very similar"
            })
          ])
        );
      });

      test("doesn't save new empty notes", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "",
                  details: "   "
                }
              ],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);
        const createdLetterOfficer = await models.referral_letter_officer.findOne(
          {
            where: { caseOfficerId: caseOfficer.id },
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          }
        );
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("throws error for new letter officers with case officers that do not exist", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              caseOfficerId: 9999,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest("Invalid case officer")
        );

        const createdLetterOfficers = await models.referral_letter_officer.findAll();
        expect(createdLetterOfficers.length).toEqual(0);
      });

      test("rolls back first officer if second officer fails", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            },
            {
              caseOfficerId: 99999,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest("Invalid case officer")
        );

        const createdLetterOfficers = await models.referral_letter_officer.findAll();
        expect(createdLetterOfficers.length).toEqual(0);
      });
    });

    describe("existing letter officer", () => {
      let referralLetterOfficer;
      beforeEach(async () => {
        const referralLetterOfficerAttributes = new ReferralLetterOfficer.Builder()
          .defaultReferralLetterOfficer()
          .withId(undefined)
          .withReferralLetterId(referralLetter.id)
          .withCaseOfficerId(caseOfficer.id)
          .withnumHistoricalHighAllegations(2)
          .withnumHistoricalMedAllegations(3)
          .withnumHistoricalLowAllegations(1)
          .withHistoricalBehaviorNotes("some historical behavior notes");

        referralLetterOfficer = await models.referral_letter_officer.create(
          referralLetterOfficerAttributes,
          { auditUser: "test" }
        );
      });

      test("updates the letter officers if they exist", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);

        const updatedLetterOfficer = await referralLetterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(updatedLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(updatedLetterOfficer.numHistoricalHighAllegations).toEqual(9);
        expect(updatedLetterOfficer.numHistoricalMedAllegations).toEqual(8);
        expect(updatedLetterOfficer.numHistoricalLowAllegations).toEqual(0);
        expect(updatedLetterOfficer.historicalBehaviorNotes).toEqual(
          "<p>updated notes</p>"
        );
        expect(
          updatedLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("adds notes that are new on existing letter officer", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                },
                {
                  tempId: "l9jwPODm8",
                  pibCaseNumber: "CC20180222-CS",
                  details: "This case was also very similar"
                }
              ],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);
        await referralLetterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(
          referralLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(2);
        expect(referralLetterOfficer.referralLetterOfficerHistoryNotes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              referralLetterOfficerId: referralLetterOfficer.id,
              pibCaseNumber: "CC20180101-CS",
              details: "This case was very similar"
            }),
            expect.objectContaining({
              referralLetterOfficerId: referralLetterOfficer.id,
              pibCaseNumber: "CC20180222-CS",
              details: "This case was also very similar"
            })
          ])
        );
      });

      test("doesn't save new empty notes", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "",
                  details: "   "
                }
              ],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);

        expect(response.statusCode).toEqual(201);
        await referralLetterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(
          referralLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("throws error for letter officers with id that does not match existing one", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: 555555555,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });

        await editReferralLetter(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest("Invalid letter officer")
        );

        const updatedLetterOfficer = await models.referral_letter_officer.findById(
          555555555
        );
        expect(updatedLetterOfficer).toBeNull();
      });

      test("throws error if try to change case officer id on existing letter officer", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              caseOfficerId: 888888,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: [],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });

        await editReferralLetter(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest("Invalid letter officer case officer combination")
        );

        const updatedLetterOfficer = await referralLetterOfficer.reload();
        expect(updatedLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(updatedLetterOfficer.historicalBehaviorNotes).toEqual(
          "some historical behavior notes"
        );
      });

      test("throws error for notes that do not exist", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>new notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  id: 999999,
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                }
              ],
              referralLetterId: referralLetter.id //REMOVE THIS ****************
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editReferralLetter(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest("Invalid officer history note")
        );

        await referralLetterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(
          referralLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      describe("existing notes", () => {
        let note1, note2;
        beforeEach(async () => {
          const note1Attributes = new ReferralLetterOfficerHistoryNote.Builder()
            .defaultReferralLetterOfficerHistoryNote()
            .withId(undefined)
            .withPibCaseNumber("CC2018NOTE1")
            .withDetails("first note original details")
            .withReferralLetterOfficerId(referralLetterOfficer.id);
          note1 = await models.referral_letter_officer_history_note.create(
            note1Attributes,
            { auditUser: "someone" }
          );
          const note2Attributes = new ReferralLetterOfficerHistoryNote.Builder()
            .defaultReferralLetterOfficerHistoryNote()
            .withId(undefined)
            .withPibCaseNumber("CC2018NOTE2")
            .withDetails("second note original details")
            .withReferralLetterOfficerId(referralLetterOfficer.id);
          note2 = await models.referral_letter_officer_history_note.create(
            note2Attributes,
            { auditUser: "someone" }
          );
        });

        test("edits notes that already exist on existing letter officer", async () => {
          const requestBody = {
            referralLetterOfficers: [
              {
                id: referralLetterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note1.id,
                    pibCaseNumber: "CC2018NOTE1edited",
                    details: "Note 1 edited details"
                  },
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
                ],
                referralLetterId: referralLetter.id //REMOVE THIS ****************
              }
            ]
          };
          const request = httpMocks.createRequest({
            method: "PUT",
            headers: {
              authorization: "Bearer token"
            },
            params: { caseId: existingCase.id },
            body: requestBody,
            nickname: "nickname"
          });
          await editReferralLetter(request, response, next);

          expect(response.statusCode).toEqual(201);
          await referralLetterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(2);
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes
          ).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note1.id,
                referralLetterOfficerId: referralLetterOfficer.id,
                pibCaseNumber: "CC2018NOTE1edited",
                details: "Note 1 edited details"
              }),
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: referralLetterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });

        test("deletes existing notes that aren't submitted in request", async () => {
          const requestBody = {
            referralLetterOfficers: [
              {
                id: referralLetterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
                ],
                referralLetterId: referralLetter.id //REMOVE THIS ****************
              }
            ]
          };
          const request = httpMocks.createRequest({
            method: "PUT",
            headers: {
              authorization: "Bearer token"
            },
            params: { caseId: existingCase.id },
            body: requestBody,
            nickname: "nickname"
          });
          await editReferralLetter(request, response, next);

          expect(response.statusCode).toEqual(201);
          await referralLetterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(1);
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes
          ).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: referralLetterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });

        test("deletes existing notes that come in blank", async () => {
          const requestBody = {
            referralLetterOfficers: [
              {
                id: referralLetterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note1.id,
                    pibCaseNumber: "",
                    details: "    "
                  },
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
                ],
                referralLetterId: referralLetter.id //REMOVE THIS ****************
              }
            ]
          };
          const request = httpMocks.createRequest({
            method: "PUT",
            headers: {
              authorization: "Bearer token"
            },
            params: { caseId: existingCase.id },
            body: requestBody,
            nickname: "nickname"
          });
          await editReferralLetter(request, response, next);

          expect(response.statusCode).toEqual(201);
          await referralLetterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(1);
          expect(
            referralLetterOfficer.referralLetterOfficerHistoryNotes
          ).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: referralLetterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });
      });
    });
  });
});
