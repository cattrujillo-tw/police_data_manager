import axios from "axios";
import _ from "lodash";
import { INTERNAL_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../models";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import createConfiguredSecretsManagerInstance from "../../../createConfiguredSecretsManagerInstance.js";

//const secretsManager = require("../../../createConfiguredSecretsManagerInstance.js");
const querystring = require("querystring");
const config = require("../../../config/config")[process.env.NODE_ENV];
const asyncMiddleware = require("../../../handlers/asyncMiddleware");
const httpRequest = require("request");
const Boom = require("boom");

const getUsers = asyncMiddleware(async (request, response, next) => {
  let authResponse;
  let userData = [];
  let secret;
  let decodedAuthSecret;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    let secretsManager = createConfiguredSecretsManagerInstance();

    const request = secretsManager.getSecretValue({
      SecretId: "ci/auth0/backend"
    });
    const result = request.promise();
    await result
      .then(function(data) {
        console.log("I'm inside!", data);

        console.log("Made it past the errors!");
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ("SecretString" in data) {
          console.log(
            "I made it! Here's my secret string: ",
            data.SecretString
          );
          secret = JSON.parse(data.SecretString);
        } else {
          let buff = new Buffer(data.SecretBinary, "base64");
          decodedAuthSecret = buff.toString("ascii");
        }

        // Your code goes here.
        console.log("this is aws secret: ", secret);
        if (secret) {
          secret = secret.AUTH0_CLIENT_SECRET;
          console.log("this is the Auth0 client secret: ", secret);
        }
      })
      .catch(function(err) {
        console.error("I failed :(", err);
        if (err.code === "DecryptionFailureException")
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InternalServiceErrorException")
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InvalidParameterException")
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InvalidRequestException")
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "ResourceNotFoundException")
          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
      });
  } else {
    secret = process.env.AUTH0_CLIENT_SECRET;
  }

  await axios
    .post(
      `https://${config.authentication.domain}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: config.authentication.clientID,
        client_secret: secret,
        audience: `https://${config.authentication.domain}/api/v2/`
      },
      {
        headers: { "content-type": "application/json" }
      }
    )
    .then(async response => {
      authResponse = response.data;
    })
    .catch(error => {
      throwTokenFailure(next, error);
    });

  if (authResponse && authResponse.access_token) {
    await axios
      .get(`https://${config.authentication.domain}/api/v2/users`, {
        params: {
          search_engine: "v3"
        },
        headers: {
          authorization: `Bearer ${authResponse.access_token}`
        }
      })
      .then(reponse => {
        userData = reponse.data;
      })
      .catch(error => {
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      });
  }

  const transformedUserData = userData.map(userInfo => {
    return _.pick(userInfo, ["email", "name"]);
  });

  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
        AUDIT_SUBJECT.ALL_USER_DATA,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
    });

  response.send(200, transformedUserData);
});

const throwTokenFailure = (next, error) => {
  throw Boom.badImplementation(
    INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE,
    error
  );
};

export default getUsers;
