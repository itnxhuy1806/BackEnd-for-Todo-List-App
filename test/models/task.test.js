import TestHelpers from "../testHelpers";
import models from "../../src/models";

describe("Task", () => {
  let user, todo;
  beforeAll(async () => {
    await TestHelpers.startDb();
  });
  afterAll(async () => {
    await TestHelpers.stopDb();
  });
  beforeEach(async () => {
    const { User, TodoList } = models;
    await TestHelpers.syncDb();
    user = await User.createNewUser({
      username: "username",
      password: "password",
      email: "email@gmail.com",
    });
    todo = await TodoList.create({ name: "name", UserId: user.id });
  });
  it("should successfully", async () => {
    const { Task } = models;
    const beforeCount = await Task.count();
    await Task.create({
      content: "content",
      checked: true,
      description: "description",
      TodoListId: todo.id,
    });
    const afterCount = await Task.count();
    expect(afterCount).toEqual(beforeCount + 1);
  });
  it("should error if undefined content", async () => {
    const { Task } = models;
    let error = false;
    try {
      await Task.create({
        checked: true,
        description: "description",
        TodoListId: todo.id,
      });
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
  it("should error if undefined TodoListId", async () => {
    const { Task } = models;
    let error = false;
    try {
      await Task.create({
        content: "content",
        checked: true,
        description: "description",
      });
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
  it("should error if undefined description", async () => {
    const { Task } = models;
    let error = false;
    try {
      await Task.create({
        content: "content",
        checked: true,
        TodoListId: todo.id,
      });
    } catch {
      error = true;
    }
    expect(error).toEqual(false);
  });
  it("should error if undefined params", async () => {
    const { Task } = models;
    let error = false;
    try {
      await Task.create();
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
});
