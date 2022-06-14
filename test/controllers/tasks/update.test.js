import TestHelpers from "../../testHelpers";
import models from "../../../src/models";
import request from "supertest";

describe("update task", () => {
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
      .patch("/api/tasks/update/" + task.id)
      .send({
        content: "content updated",
        checked: true,
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.message).toEqual("Updated successfully");
  });
  it("should 500 if invalid content", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        content:
          "invalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContent",
        checked: true,
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should 500 if invalid cheked", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        content: "content updated",
        checked: "invalidChecked",
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should 500 if invalid decription", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        content: "content updated",
        checked: true,
        description:
          "invalidDescriptioninvalidDescriptioninvalidDescriptioninvalidDescriptioninvalidDescriptioninvalidDescriptioninvalidDescription",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should succesfully if only update content", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        content: "content updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.message).toEqual("Updated successfully");
  });
  it("should succesfully if only update checked", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        checked: true,
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.message).toEqual("Updated successfully");
  });
  it("should succesfully if only description checked", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.message).toEqual("Updated successfully");
  });
  it("should 500 if invalid id ", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + "invalid id")
      .send({
        content: "content updated",
        checked: true,
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
  });
  it("should 401 if not the owner of this to-do list ", async () => {
    const res = await request(app)
      .patch("/api/tasks/update/" + task.id)
      .send({
        content: "content updated",
        checked: true,
        description: "description updated",
      })
      .set("Authorization", `Bearer ${accessToken1}`)
      .expect(401);
  });
});
