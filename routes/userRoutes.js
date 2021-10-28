/********************* imports  **************************/
import express from "express";

import { getUsers } from "../controllers/userController.js";

/******************** init *****************************/
const userRouter = express.Router();

/******************** routes *****************************/
userRouter.get("/users", getUsers);

export default userRouter;
