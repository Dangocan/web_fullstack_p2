import { Router } from "express";
import { UserService } from "../user/user.service";

const routePrefix = "/auth";
const AuthRouter = Router();

AuthRouter.post(`${routePrefix}/register`, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserService.register(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

AuthRouter.post(`${routePrefix}/login`, async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, jwtToken } = await UserService.login(email, password);
    res.status(200).json({ user, jwtToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export { AuthRouter };
