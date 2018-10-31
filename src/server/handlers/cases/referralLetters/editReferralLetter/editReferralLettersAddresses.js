import models from "../../../../models/index";
import asyncMiddleware from "../../../asyncMiddleware";
import Boom from "boom";

const editReferralLetterAddresses = asyncMiddleware(
  async (request, response, next) => {
    // await checkForValidStatus(request.params.referralLetterId);

    const referralLetter = await models.referral_letter.findOne({
      where: { id: request.params.referralLetterId }
    });

    const r = await referralLetter.update(
      {
        recipient: request.body.recipient,
        sender: request.body.sender,
        transcribedBy: request.body.transcribedBy
      },
      { auditUser: request.nickname }
    );

    return response.status(200).send({});
  }
);

export default editReferralLetterAddresses;
