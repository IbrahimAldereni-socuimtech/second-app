/********************* imports  **************************/
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import sequelize from "./util/database.js";
import User from "./models/userModel.js";
import Post from "./models/postModel.js";
import Comment from "./models/commentModel.js";

/******************** init *****************************/
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config();

/******************** routes ****************************/

// home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// user routes
app.use(userRouter);

// post routes
app.use(postRouter);

// comment routes
app.use(commentRouter);

// 404 route
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

/********************* database **************************/

// relations
// one to many relation (one user have many posts)
User.hasMany(Post);
Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// one to many relation (one post have many comments)
Post.hasMany(Comment);
Comment.belongsTo(Post, { constraints: true, onDelete: "CASCADE" });

// sync (exporting for testing)
sequelize
  .sync()
  .then((res) => {
    app.listen("3001", () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    return err;
  });

// for testing
export default app;
