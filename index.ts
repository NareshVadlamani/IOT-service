import express, { json } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import * as xp from "./src/utils/express-utils";
import config from "./config";
import Mongo from "./src/models/mongo";
import { getUserRouter } from "./src/controller/user";
import { getHobbyRouter } from "./src/controller/hobby";

const swaggerOptions = {
  definition: {
    swagger: "3.0",
    openapi: "3.0.3",
    info: {
      title: "API Documentation for Arrive Server App",
      version: "1.0.0",
      description: "API Documentation for Arrive Server App",
      contact: {
        name: "Naresh",
        email: "nareshvadlamani@gmail.com",
      },

      servers: ["http://localhost:4000"],
    },

    basePath: "",
  },
  apis: ["**/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

async function main() {
  await Mongo.init();
  express()
    .use(express.json())
    .use("/user", getUserRouter())
    .use("/hobby", getHobbyRouter())
    .use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    .use(xp.notFound)
    .listen(config.port, () => {
      console.log(`server listening on http://localhost:${config.port}`);
    });
}

main().catch((err) => console.error("app.init.failed", err));
