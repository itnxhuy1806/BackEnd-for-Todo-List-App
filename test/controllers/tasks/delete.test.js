import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("create task", () => {
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
      .delete("/api/tasks/delete/" + task.id)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual("Deleted successfully");
  });
  it("should 500 if invalid Id", async () => {
    const res = await request(app)
      .delete("/api/tasks/delete/" + "invalidId")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should 404 if undefined Id", async () => {
    const res = await request(app)
      .delete("/api/tasks/delete")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);
  });
  it("should 401 if not the owner of this to-do list", async () => {
    const res = await request(app)
      .delete("/api/tasks/delete/" + task.id)
      .set("Authorization", `Bearer ${accessToken1}`)
      .expect(401);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual(
      "You do not have authorized to interactive this to-do list"
    );
  });
});
