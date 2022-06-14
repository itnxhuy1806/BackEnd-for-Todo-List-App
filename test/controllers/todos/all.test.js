import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("all todo", () => {
  let app;
  let accessToken;
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
    await await TodoList.create({ name: "todo1", UserId: user.id });
    await await TodoList.create({ name: "todo2", UserId: user.id });
    logged = await request(app)
      .post("/api/users/login")
      .send({ username: "username", password: "password" });
    accessToken = logged.body.data.accessToken;
  });
  it("successfully", async () => {
    let res = await request(app)
      .get("/api/todos/all")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data).toBeDefined();
  });
  it("should return 401 if invalid token", async () => {
    let res = await request(app)
      .get("/api/todos/all")
      .set("Authorization", `Bearer invalid token`)
      .expect(401);
    expect(res.body.success).toEqual(false);
  });
});
