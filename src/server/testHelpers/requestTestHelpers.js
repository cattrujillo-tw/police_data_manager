import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import models from "../policeDataManager/models/index";
import winston from "winston";

const config = require("../config/config")[process.env.NODE_ENV];

export const suppressWinstonLogs = test => async () => {
  winston.configure({
    transports: [
      new winston.transports.Console({
        json: config.winston.json,
        colorize: true,
        silent: true
      })
    ],
    level: config.winston.logLevel,
    colorize: true
  });

  try {
    await test();
  } catch (err) {
    throw err;
  } finally {
    winston.configure({
      transports: [
        new winston.transports.Console({
          json: config.winston.json,
          colorize: true
        })
      ],
      level: config.winston.logLevel,
      colorize: true
    });
  }
};

export const buildTokenWithPermissions = (permissions, nickname) => {
  const privateKeyPath = path.join(
    __dirname,
    "../config",
    "test",
    "private.pem"
  );
  const cert = fs.readFileSync(privateKeyPath);

  const payload = {
    foo: "bar",
    scope: `${config.authentication.scope} ${permissions}`
  };
  payload[`${config.authentication.nicknameKey}`] = nickname;

  const options = {
    audience: config.authentication.audience,
    issuer: config.authentication.issuer,
    algorithm: config.authentication.algorithm
  };

  return jwt.sign(payload, cert, options);
};

export const expectResponse = async (
  responsePromise,
  statusCode,
  responseBodyContents = null
) => {
  return await responsePromise.then(
    response => {
      expect(response.statusCode).toEqual(statusCode);
      responseBodyContents &&
        expect(response.body).toEqual(responseBodyContents);
      return response;
    },
    error => {
      expect(error.response.statusCode).toEqual(statusCode);
      responseBodyContents &&
        expect(error.response.body).toEqual(responseBodyContents);
      return error;
    }
  );
};

export const cleanupDatabase = async () => {
  const truncationQuery =
    "DELETE from referral_letter_officer_recommended_actions;" +
    "DELETE from referral_letter_officer_history_notes;" +
    "DELETE from letter_officers;" +
    "DELETE from referral_letters;" +
    "DELETE from recommended_actions;" +
    "DELETE from addresses;" +
    "DELETE from cases_officers;" +
    "DELETE from officers_allegations;" +
    "DELETE from officers;" +
    "DELETE from allegations;" +
    "DELETE from classifications;" +
    "DELETE from civilians;" +
    "DELETE from attachments;" +
    "DELETE from case_notes;" +
    "DELETE from action_audits;" +
    "DELETE from legacy_data_change_audits;" +
    "DELETE from intake_sources;" +
    "DELETE from how_did_you_hear_about_us_sources;" +
    "DELETE from race_ethnicities;" +
    "DELETE from officer_history_options;" +
    "DELETE from cases;" +
    "DELETE from gender_identities;" +
    "DELETE from case_note_actions;" +
    "DELETE from audits;" +
    "DELETE from case_tags;" +
    "DELETE from tags;" +
    "DELETE from civilian_titles;" +
    "DELETE from districts;" +
    "DELETE from case_classifications;" +
    "DELETE from notifications;";

  await models.sequelize.query(truncationQuery, {
    type: models.sequelize.QueryTypes.RAW
  });
};
