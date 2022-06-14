import TestHelpers from "../testHelpers";
import models from "../../src/models";

describe("TodoList", () => {
  let user;
  beforeAll(async () => {
    await TestHelpers.startDb();
  });
  afterAll(async () => {
    await TestHelpers.stopDb();
  });
  beforeEach(async () => {
    const { User } = models;
    await TestHelpers.syncDb();
    user = await User.createNewUser({
      username: "username",
      password: "password",
      email: "email@gmail.com",
    });
  });
  it("should successfully", async () => {
    const { TodoList } = models;
    const beforeCount = await TodoList.count();
    await TodoList.create({ name: "name", UserId: user.id });
    const afterCount = await TodoList.count();
    expect(afterCount).toEqual(beforeCount + 1);
  });
  it("should error if undefined name", async () => {
    const { TodoList } = models;
    let error = false;
    try {
      await TodoList.create({ UserId: user.id });
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
  it("should error if undefined UserId", async () => {
    const { TodoList } = models;
    let error = false;
    try {
      await TodoList.create({ name: "name" });
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
  it("should error if undefined params", async () => {
    const { TodoList } = models;
    let error = false;
    try {
      await TodoList.create();
    } catch {
      error = true;
    }
    expect(error).toEqual(true);
  });
});
