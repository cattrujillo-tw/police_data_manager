import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import nock from "nock";
import getAccessToken from "../../../common/auth/getAccessToken";
import getNotificationsForUser from "./getNotificationsForUser";
import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";
import moment from "moment";

jest.mock("../../../common/auth/getAccessToken");

describe("get notifications for user", () => {
  const user = "test@test.com";
  const thirtyDaysAgo = moment().subtract(30, "days");
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const token = "token";

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("dispatches getNotificationSuccess", async () => {
    const responseBody = [{ notifications: "some notifs" }];
    nock("http://localhost/")
      .get(`/api/notifications/${user}/`)
      .query(true)
      .reply(200, responseBody);

    getAccessToken.mockImplementation(() => token);

    await getNotificationsForUser(user, thirtyDaysAgo)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getNotificationsSuccess(responseBody)
    );
  });
});
