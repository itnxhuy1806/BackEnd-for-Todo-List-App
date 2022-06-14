import TestHelpers from "../../testHelpers";
import request from "supertest";

describe("register", () => {
  let app;
  let newUserResponse;

  beforeAll(async () => {
    await TestHelpers.startDb();
    app = TestHelpers.getApp();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestHelpers.syncDb();
    newUserResponse = await TestHelpers.registerNewUser({
      username: "username",
      email: "test@example.com",
      password: "password",
    });
  });

  it("should succesfully", async () => {
    const response = await request(app)
      .get("/api/users/logout")
      .set("Authorization", `Bearer ${newUserResponse.body.data.accessToken}`)
      .expect(200);
    expect(response.body.success).toEqual(true);
  });
  it("should 401 if invalid token", async () => {
    const response = await request(app)
      .get("/api/users/logout")
      .set("Authorization", `Bearer invalidToken`)
      .expect(401);
    expect(response.body.success).toEqual(false);
  });
});
