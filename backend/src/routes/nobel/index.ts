import { Router } from "express";
import { NobelService } from "./nobel.service";
import { checkJwtToken } from "../../config/middlewares/jwtValidation";
import { NobelSchema } from "./nobel.dto";
import { z } from "zod";

const routePrefix = "/nobelPrizes";
const NobelRouter = Router();

NobelRouter.use(checkJwtToken);

NobelRouter.get(`${routePrefix}`, async (req, res) => {
  const { nobelPrizeYear } = req.query;

  try {
    if (nobelPrizeYear) {
      const year = Number(nobelPrizeYear);
      if (isNaN(year) || year < 1901) {
        return res.status(400).json({
          message: "Invalid 'nobelPrizeYear'. Must be a valid year >= 1901.",
        });
      }

      const filtered = await NobelService.findByYear(year);
      return res.status(200).json({ nobelPrizes: filtered });
    }

    const all = await NobelService.getAll();
    return res.status(200).json({ nobelPrizes: all });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

NobelRouter.get(`${routePrefix}/:id`, async (req, res) => {
  try {
    const record = await NobelService.getById(req.params.id);
    res.status(200).json(record);
  } catch {
    res.status(404).json({ message: "Nobel record not found" });
  }
});

NobelRouter.post(`${routePrefix}`, async (req, res) => {
  try {
    const validatedData = NobelSchema.parse(req.body);
    const created = await NobelService.create(validatedData);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", issues: error.errors });
    }
    res.status(500).json({ message: "Failed to create Nobel record" });
  }
});

NobelRouter.put(`${routePrefix}/:id`, async (req, res) => {
  try {
    const validatedData = NobelSchema.parse(req.body);
    const updated = await NobelService.update(req.params.id, validatedData);
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", issues: error.errors });
    }
    res.status(400).json({ message: "Failed to update Nobel record" });
  }
});

NobelRouter.delete(`${routePrefix}/:id`, async (req, res) => {
  try {
    const result = await NobelService.delete(req.params.id);
    res.status(200).json(result);
  } catch {
    res.status(404).json({ message: "Failed to delete Nobel record" });
  }
});

export { NobelRouter };
