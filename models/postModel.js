import sequelize from "../util/database.js";
import postSchema from "../schemas/postSchema.js";

const Post = sequelize.define("post", postSchema);

export default Post;
