/********************* imports  **************************/
import express from "express";

import {
  getUsers,
  addUser,
  getSingleUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

/******************** init *****************************/
const userRouter = express.Router();

/******************** routes *****************************/
userRouter.get("/users", getUsers);

userRouter.get("/users/:id", getSingleUser);

userRouter.post("/user", addUser);

userRouter.delete("/deleteUser/:id", deleteUser);

userRouter.put("/updateUser/:id", updateUser);

export default userRouter;
