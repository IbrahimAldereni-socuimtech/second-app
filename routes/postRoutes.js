/********************* imports  **************************/
import express from "express";

import {
  getPosts,
  getSinglePost,
  deletePost,
  updatePost,
  addPost,
} from "../controllers/postController.js";

/******************** init *****************************/
const postRouter = express.Router();

/******************** routes *****************************/
postRouter.get("/posts", getPosts);

postRouter.get("/posts/:id", getSinglePost);

postRouter.post("/post", addPost);

postRouter.delete("/deletePost/:id", deletePost);

postRouter.put("/updatePost/:id", updatePost);

export default postRouter;
