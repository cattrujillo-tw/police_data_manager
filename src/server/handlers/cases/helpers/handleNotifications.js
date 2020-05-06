import { sendNotification } from "../../../handleNotificationSubscriptions";
import moment from "moment";
import { extractNotifications } from "../getNotifications";

const models = require("../../../complaintManager/models");

export const handleNotifications = async (
  transaction,
  request,
  mentionedUsers,
  caseNoteId
) => {
  const workingListMentionedUsers = [...mentionedUsers];
  const workingListUsersEmails = workingListMentionedUsers.map(user => {
    return user.value;
  });

  const allNotifications = await models.notification.findAll({
    where: {
      caseNoteId: caseNoteId
    }
  });

  for (const notification in allNotifications) {
    const currentUser = allNotifications[notification].user;
    const mentionedUsersEmails = mentionedUsers.map(user => {
      return user.value;
    });
    if (mentionedUsersEmails.includes(currentUser)) {
      await updateNotificationTimestamp(
        transaction,
        request,
        currentUser,
        caseNoteId
      );
      const workingListIndex = workingListUsersEmails.indexOf(currentUser);
      workingListUsersEmails.splice(workingListIndex, 1);
      workingListMentionedUsers.splice(workingListIndex, 1);
    } else {
      await deleteNotification(transaction, request, currentUser, caseNoteId);
    }
  }

  for (const user in workingListMentionedUsers) {
    await createNotification(
      transaction,
      request,
      workingListMentionedUsers[user],
      caseNoteId
    );
  }
};

const createNotification = async (transaction, request, user, caseNoteId) => {
  await models.notification.create(
    {
      caseNoteId: caseNoteId,
      user: user.value
    },
    {
      transaction,
      auditUser: request.nickname
    }
  );
  sendNotification(
    await extractNotifications(moment().subtract(30, "days"), user.value)
  );
};

const deleteNotification = async (transaction, request, user, caseNoteId) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });

  await currentNotification.destroy({
    transaction,
    auditUser: request.nickname
  });
};

const updateNotificationTimestamp = async (
  transaction,
  request,
  user,
  caseNoteId
) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });

  currentNotification.changed("updatedAt", true);

  await currentNotification.save({ transaction, auditUser: request.nickname });
};
