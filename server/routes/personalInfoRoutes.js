import express from "express";
import {
  setPersonalInfo,
  getPersonalInfo,
  deletePersonalInfo,
} from "../controllers/personalInfoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", setPersonalInfo);
router.get("/", getPersonalInfo);
router.delete("/", deletePersonalInfo);

export default router;
