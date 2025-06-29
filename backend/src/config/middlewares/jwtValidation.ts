import jwt from "jsonwebtoken";
import { NextFunction, Request, Response, RequestHandler } from "express";

const checkJwtToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export { checkJwtToken };
