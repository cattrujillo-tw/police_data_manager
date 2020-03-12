import Case from "../../../../client/complaintManager/testUtilities/case";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../../../complaintManager/models";
import CaseNote from "../../../../client/complaintManager/testUtilities/caseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { handleNotifications } from "./handleNotifications";
import * as httpMocks from "node-mocks-http";
import moment from "moment/moment";

describe("case note helpers", function() {
  let mentionedUsers = [],
    createdCase,
    createdCaseNote,
    allNotifications,
    request;
  const actionTaken = moment();

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(createdCase.id)
      .withNotes("default notes")
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    allNotifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { actionTakenAt: actionTaken, notes: "wow", mentionedUsers: [] },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should do nothing", async () => {
    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    expect(notifications).toBeEmpty();
  });

  test("should create notification", async () => {
    const newUser = { label: "Syd Botz", value: "some1@some.com" };
    mentionedUsers.push(newUser);

    expect(allNotifications).toBeEmpty();

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    let allNewNotifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    expect(allNewNotifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          caseNoteId: createdCaseNote.id,
          user: newUser.value
        })
      ])
    );
  });

  test("should update notification", async () => {
    const newUser = { label: "Sean Rutledge", value: "some2@some.com" };
    mentionedUsers.push(newUser);

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      }
    });

    const anotherUser = { label: "Another One", value: "another1@1.com" };
    mentionedUsers.push(anotherUser);

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const updatedNotification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      }
    });

    const anotherNotification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: anotherUser.value
      }
    });

    expect(updatedNotification).toEqual(
      expect.objectContaining({
        caseNoteId: notification.caseNoteId,
        user: notification.user
      })
    );

    expect(updatedNotification).not.toEqual(
      expect.objectContaining({ updatedAt: notification.updatedAt })
    );

    expect(anotherNotification).not.toBeNull();
  });

  test("should delete notification", async () => {
    const newUser = { label: "Wanchen Yao", value: "some3@some.com" };
    mentionedUsers.push(newUser);

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      }
    });

    mentionedUsers.pop();
    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const deletedNotification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      },
      paranoid: false
    });

    expect(deletedNotification).toEqual(
      expect.objectContaining({
        caseNoteId: notification.caseNoteId,
        user: notification.user
      })
    );

    expect(deletedNotification).not.toEqual(
      expect.objectContaining({ deletedAt: null })
    );
  });
});