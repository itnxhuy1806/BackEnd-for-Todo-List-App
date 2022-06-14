import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("create todo", () => {
  let app;
  let logged;
  let accessToken;

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
  describe("succesfully", () => {
    it("should succesfully", async () => {
      const res = await request(app)
        .post("/api/todos/create")
        .send({ name: "test" })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Added successfully");
    });
  });
  it("should 401 if name already exists", async () => {
    await request(app)
      .post("/api/todos/create")
      .send({ name: "test" })
      .set("Authorization", `Bearer ${accessToken}`);
    const res = await request(app)
      .post("/api/todos/create")
      .send({ name: "test" })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual(
      "TodoList name already exists, please chose another name"
    );
  });
  it("should 500 if undefined name", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual(
      "TodoList name must contain between 2 and 50 characters"
    );
  });
  it("should 500 if  name.len <2 & >50", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .send({ name: "t" })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual(
      "TodoList name must contain between 2 and 50 characters"
    );
  });
});
