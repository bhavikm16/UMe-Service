import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserContacts, getMessages, sendMessages, getAllUsers } from "../controller/message.controller.js";
const router = express.Router();
router.get("/users", protectRoute,getUserContacts);
router.get("/allusers", protectRoute,getAllUsers);
router.get("/:id", protectRoute,getMessages);
router.post("/send/:id", protectRoute,sendMessages);
export default router;
