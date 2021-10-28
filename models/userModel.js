import sequelize from "../util/database.js";
import userSchema from "../schemas/userSchema.js";

const User = sequelize.define("user", userSchema);

export default User;
