/********************* imports  **************************/
import express from "express";

import {
  getComments,
  getSingleComment,
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

/******************** init *****************************/
const commentRouter = express.Router();

/******************** routes *****************************/
commentRouter.get("/comments", getComments);

commentRouter.get("/comments/:id", getSingleComment);

commentRouter.post("/comment", addComment);

commentRouter.delete("/deleteComment/:id", deleteComment);

commentRouter.put("/updateComment/:id", updateComment);

export default commentRouter;
