import express from "express";
import {
  addTasks,
  login,
  logout,
  register,
  removeTasks,
  updateTasks,
  verify,
} from "../controllers/users.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// user registration route

router.post("/register", register);

// router.route("/register").post(register);
// // is user in auth to verify
router.route("/verify").post(isAuth, verify);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/addTasks").post(isAuth, addTasks);
router
  .route("/task/:taskId")
  .delete(isAuth, removeTasks)
  .get(isAuth, updateTasks);

// export router in app by default
export default router;
