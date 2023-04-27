import express from "express";
import { register } from "../controllers/users.js";

const router = express.Router();

// user registration route
router.post("/register", register);

// export router in app by default
export default router;
