import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("detail todo", () => {
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
      .get("/api/todos/detail/1")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data).not.toEqual({});
  });
  it("should return 401 if invalid token", async () => {
    let res = await request(app)
      .get("/api/todos/detail/1")
      .set("Authorization", `Bearer invalid token`)
      .expect(401);
    expect(res.body.success).toEqual(false);
  });
  it("should return 401 if id not exists", async () => {
    let res = await request(app)
      .get("/api/todos/detail/0")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual("Todolist not found");
  });
  it("should return 404 if undefine id", async () => {
    let res = await request(app)
      .get("/api/todos/detail/")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);
  });
});
