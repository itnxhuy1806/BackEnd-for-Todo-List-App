import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("detail task", () => {
  let app, logged, logged1, accessToken, accessToken1, task, user, user1;
  let todo;

  beforeAll(async () => {
    await TestHelpers.startDb();
    app = TestHelpers.getApp();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestHelpers.syncDb();
    const { User, TodoList, Task } = models;
    const password = "password";
    user = await User.createNewUser({
      username: "username",
      password,
      email: "email@gmail.com",
    });
    user1 = await User.createNewUser({
      username: "username1",
      password,
      email: "email1@gmail.com",
    });
    todo = await TodoList.create({ name: "todo1", UserId: user.id });
    task = await Task.create({
      content: "content",
      checked: false,
      TodoListId: todo.id,
    });
    logged = await request(app)
      .post("/api/users/login")
      .send({ username: user.username, password });
    accessToken = logged.body.data.accessToken;
    logged1 = await request(app)
      .post("/api/users/login")
      .send({ username: user1.username, password });
    accessToken1 = logged1.body.data.accessToken;
  });

  it("should succesfully", async () => {
    const res = await request(app)
      .get("/api/tasks/detail/" + todo.id)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data.id).toEqual(task.id);
    expect(res.body.data.content).toEqual(task.content);
    expect(res.body.data.checked).toEqual(task.checked);
    expect(res.body.data.description).toEqual(task.description);
  });
  it("should 500 if invalid Id", async () => {
    const res = await request(app)
      .get("/api/tasks/detail/" + "invalid Id")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should succesfully if not the owner of this to-do list", async () => {
    const res = await request(app)
      .get("/api/tasks/detail/" + todo.id)
      .set("Authorization", `Bearer ${accessToken1}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data.id).toEqual(task.id);
    expect(res.body.data.content).toEqual(task.content);
    expect(res.body.data.checked).toEqual(task.checked);
    expect(res.body.data.description).toEqual(task.description);
  });
});
