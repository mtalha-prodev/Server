import express from "express";
import { login, register, verify } from "../controllers/users.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// user registration route
router.post("/register", register);
// is user in auth to verify
router.post("/verify", isAuth, verify);
router.post("/login", login);

// export router in app by default
export default router;
