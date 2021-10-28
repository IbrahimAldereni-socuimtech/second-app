import sequelize from "../util/database.js";
import commentSchema from "../schemas/commentSchema.js";

const Comment = sequelize.define("comment", commentSchema);

export default Comment;
