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
  });

  it("should succesfully", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "username",
        email: "test@example.com",
        password: "password",
      })
      .expect(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("User successfully register");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it("should return message 'user already exists' if user already exists", async () => {
    await request(app).post("/api/users/register").send({
      username: "username",
      email: "email@mail.com",
      password: "password",
    });
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "username",
        email: "email@mail.com",
        password: "password",
      })
      .expect(401);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("User already exists");
  });
  it("should return message 'Username must contain between 2 and 50 characters' if invalid username", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "u",
        email: "email@mail.com",
        password: "password",
      })
      .expect(500);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual(
      "Username must contain between 2 and 50 characters"
    );
  });
  it("should return message 'User.username cannot be null' if don't send username", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "email@mail.com",
        password: "password",
      })
      .expect(500);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("User.username cannot be null");
  });
  it("should return message 'Not a valid email address' if invalid email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "e",
        username: "username",
        password: "password",
      })
      .expect(500);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Not a valid email address");
  });
  it("should return message 'Email is required' if don't send email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "username",
        password: "password",
      })
      .expect(500);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Email is required");
  });
});
