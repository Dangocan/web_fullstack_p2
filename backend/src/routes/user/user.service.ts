import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user";

const UserService = {
  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("Missing required fields");
    }

    const userIfExists = await UserModel.findOne({ email });

    if (userIfExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const jwtToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    return { user, jwtToken };
  },

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Missing required fields");
    }

    const userIfExists = await UserModel.findOne({ email });

    if (!userIfExists) {
      throw new Error("User does not exists");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userIfExists.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const jwtToken = jwt.sign(
      {
        id: userIfExists._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    return { user: userIfExists, jwtToken };
  },

  async getAll() {
    const users = await UserModel.find();

    return users;
  },
};

export { UserService };
