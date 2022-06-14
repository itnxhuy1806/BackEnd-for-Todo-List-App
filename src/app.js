import express from "express";
import cors from "cors";
import environment from "./config/environment";
import logger from "morgan";
import errorsMiddleware from "./middlewares/errors";
import { serverRoutes } from "./controllers";
import bodyParser from "body-parser";
export default class App {
  constructor() {
    this.app = express();
    this.app.use(cors());

    this.app.use(
      logger("dev", { skip: (req, res) => environment.nodeEnv === "test" })
    );
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }))
    // this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use(bodyParser.json())
    this.setRouters();
  }
  setRouters() {
    this.app.use("/api", serverRoutes);
    this.app.use(errorsMiddleware);
  }
  getApp() {
    return this.app;
  }
  listen() {
    const { port } = environment;
    this.app.listen(port, () => {
      console.log(`listening at port ${port}`);
    });
  }
}
