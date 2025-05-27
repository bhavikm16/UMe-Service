import express from "express";
import { addBio, addContact, Allrequests, checkauth, FriendRequest, searchUser, signup } from "../controller/auth.controller.js";
import { login } from "../controller/auth.controller.js";
import { logout } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controller/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check" , protectRoute, checkauth);

router.put("/update-profile", protectRoute, updateProfile);

router.post("/search-user", protectRoute,searchUser);

router.post ("/friend/:id",protectRoute, addContact)

router.put("/update-bio", protectRoute, addBio);

router.post("/friendrequest/:id", protectRoute, FriendRequest)

router.get("/requests",protectRoute, Allrequests)

export default router;