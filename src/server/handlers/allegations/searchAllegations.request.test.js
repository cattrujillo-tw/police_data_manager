import Allegation from "../../../client/testUtilities/Allegation";
import models from "../../models";
import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../requestTestHelpers";

afterEach(async () => {
  await cleanupDatabase();
});

test("should return an allegation", async () => {
  const allegation = new Allegation.Builder()
    .defaultAllegation()
    .withId(undefined)
    .build();

  const createdAllegation = await models.allegation.create(allegation);

  const token = buildTokenWithPermissions("", "TEST_NICKNAME");

  await request(app)
    .get("/api/allegations/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ rule: createdAllegation.rule })
    .expect(200)
    .then(response => {
      expect(response.body.rows.length).toEqual(1);
      expect(response.body.rows[0].rule).toEqual(createdAllegation.rule);
    });
});

test("should include count in result", async () => {
  const allegation = new Allegation.Builder()
    .defaultAllegation()
    .withId(undefined)
    .build();
  const allegationTwo = new Allegation.Builder()
    .defaultAllegation()
    .withRule("my-rule")
    .build();

  await models.allegation.create(allegation);
  await models.allegation.create(allegationTwo);

  const token = buildTokenWithPermissions("", "TEST_NICKNAME");

  await request(app)
    .get("/api/allegations/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ limit: 1, offset: 1 })
    .expect(200)
    .then(response => {
      expect(response.body.count).toEqual(2);
    });
});
