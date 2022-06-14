import TestHelpers from "../testHelpers";
import models from "../../src/models";

describe("RefreshToken", () => {
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
    const { RefreshToken } = models;
    const beforeCount = await RefreshToken.count();
    await RefreshToken.create({ token: "RefreshToken", UserId: user.id });
    const afterCount = await RefreshToken.count();
    expect(afterCount).toEqual(beforeCount + 1);
  });
  it("should error if undefined UserId", async () => {
    const { RefreshToken } = models;
    let error = false;
    try {
      await RefreshToken.create({ token: "RefreshToken" });
    } catch (err) {
      error = true;
    }
    expect(error).toEqual(true);
  });
  it("should error if undefined token", async () => {
    const { RefreshToken } = models;
    let error = false;
    try {
      await RefreshToken.create({ UserId: user.id });
    } catch (err) {
      error = true;
    }
    expect(error).toEqual(false);
  });
  it("should error if undefined params", async () => {
    const { RefreshToken } = models;
    let error = false;
    try {
      await RefreshToken.create();
    } catch (err) {
      error = true;
    }
    expect(error).toBeDefined();
  });
});
