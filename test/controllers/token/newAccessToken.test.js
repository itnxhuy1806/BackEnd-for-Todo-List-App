import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("new access token", () => {
  let app;
  let refreshToken, accessToken;
  let logged;

  beforeAll(async () => {
    await TestHelpers.startDb();
    app = TestHelpers.getApp();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });
  beforeEach(async () => {
    await TestHelpers.syncDb();
    const { User, TodoList } = models;
    let user = await User.createNewUser({
      username: "username",
      password: "password",
      email: "email@gmail.com",
    });
    logged = await request(app)
      .post("/api/users/login")
      .send({ username: "username", password: "password" });
    accessToken = logged.body.data.accessToken;
    refreshToken = logged.body.data.refreshToken;
  });
  it("successfully", async () => {
    let res = await request(app)
      .get("/api/token/newAccessToken")
      .set("Authorization", `Bearer ${refreshToken}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data.accessToken).toBeDefined();
  });
  it("should err if not logged in", async () => {
    await request(app)
      .get("/api/users/logout")
      .set("Authorization", `Bearer ${accessToken}`);
    let res = await request(app)
      .get("/api/token/newAccessToken")
      .set("Authorization", `Bearer ${refreshToken}`)
      .expect(401);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual("You must login in first");
  });
});
