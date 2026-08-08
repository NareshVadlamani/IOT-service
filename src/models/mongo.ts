import { MongoClient } from "mongodb";
import { connect, connection } from "mongoose";
import config from "../../config";
import Hobby from "./hobby";
import User from "./user";

let mclient: any;

export default class Mongo {
  static hobby: Hobby;
  static user: User;
  static async init() {
    if (!mclient) {
      mclient = await connect("mongodb://localhost:27017/userHobby1", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log("connected");

      connection.once("open", function () {
        console.log("MongoDB database connection established successfully");
      });
    }
    Mongo.hobby = new Hobby();
    Mongo.user = new User();
  }
}
