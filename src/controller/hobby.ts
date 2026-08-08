import express, { Request, Response } from "express";
import { jaction } from "../utils/express-utils";
import got from "got";
import _ from "lodash";
// var ObjectId = require('mongoose').Types.ObjectId;

import User from "../models/user";
import { Types } from "mongoose";
import Mongo from "../models/mongo";

export function getHobbyRouter() {
  return express
    .Router({ mergeParams: true })
    .post("/list", jaction(getHobbiesByIds))
    .post("/add-hobby", jaction(addHobbyForUser));
}

export async function getHobbiesByIds(req: Request, res: Response) {
  const { ids } = req.body;
  const isValid = ids.every((id: string) => Types.ObjectId.isValid(id));
  if (isValid) {
    const userList = await Mongo.hobby.getHobbiesListByIds(ids);
    return { res: userList };
  } else {
    return { err: "invalid hobby ids" };
  }
}

export async function addHobbyForUser(req: Request, res: Response) {
  const { userId, hobby } = req.body;
  const { name, date, passionLevel } = hobby;
  const hobbyList = await Mongo.hobby.addHobby(userId, {
    name,
    date,
    passionLevel,
  });
  return hobbyList;
}
