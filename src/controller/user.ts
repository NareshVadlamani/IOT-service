import express, { Request, Response } from "express";
import { jaction } from "../utils/express-utils";
import _ from "lodash";

import User from "../models/user";
import { Types } from "mongoose";
import Mongo from "../models/mongo";

/**
 *
 * @swagger
 * definitions :
 *    AddUser:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 */

export function getUserRouter() {
  return express
    .Router({ mergeParams: true })
    .get("/list", jaction(getUserList))
    .post("/add-user", jaction(addUser));
}

/**
 * @swagger
 * /user/list:
 *  get:
 *   tags:
 *    - Users
 *   summary: API to get user list
 *   description: API to get user list
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 *
 */

async function getUserList() {
  const userList = await Mongo.user.getUserList();
  return userList;
}

/**
 * @swagger
 * /user/add-user:
 *  post:
 *   tags:
 *    - Add user
 *   summary: API to Add user
 *   description: API to Add user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/AddUser'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

async function addUser(req: Request) {
  const { name } = req.body;
  const hobbyList = await Mongo.user.addUser(name);
  return hobbyList;
}
