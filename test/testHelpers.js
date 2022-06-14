import "../src/config";
import Database from "../src/database";
import dbConfig from "../src/config/database";
import request from "supertest";

let db;

export default class TestHelpers {
  static async startDb() {
    db = new Database("test", dbConfig);
    await db.connect();
    return db;
  }

  static async stopDb() {
    await db.disconnect();
  }

  static async syncDb() {
    await db.sync();
  }

  static async createNewUser(options = {}) {
    const models = require("../src/models").default;
    const {
      email = "test@example.com",
      password = "Test123#",
      username = "test",
      refreshToken = "test-refresh-token",
    } = options;
    const { User } = models;
    const data = {
      email,
      password,
      username,
      refreshToken,
    };
    return User.createNewUser(data);
  }

  static getApp() {
    const App = require("../src/app").default;
    return new App().getApp();
  }

  static async registerNewUser(options = {}) {
    const {
      email = "test@example.com",
      username = "test",
      password = "Test123#",
      endpoint = "/api/users/register",
    } = options;
    return request(TestHelpers.getApp())
      .post(endpoint)
      .send({ username, email, password });
  }
  static async registerNewUser(options = {}) {
    const {
      email = "test@example.com",
      username = "test",
      password = "Test123#",
      endpoint = "/api/users/register",
    } = options;
    return request(TestHelpers.getApp())
      .post(endpoint)
      .send({ username, email, password });
  }
}
