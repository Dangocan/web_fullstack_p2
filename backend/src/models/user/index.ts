import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, nullable: false, unique: true, required: true },
  password: { type: String, nullable: false, required: true },
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
