import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must contain atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email Doesnot exsists" });
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res.status(400).json({ message: "Password is incorrect" });

    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
    });
  } catch (error) {
    console.log("Error in Login", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const myId = req.user._id;
    const user = await User.findByIdAndUpdate(
      myId,
      { bio: bio },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in Bio", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Login", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkauth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/*IMPORTANT*/

export const searchUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in SearchUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addContact = async (req, res) => {
  try {
    const myId = req.user._id;
    const { email } = req.body;

    const user = await User.findById(myId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friendUser = await User.findOne({ email });

    const friend = await User.findOne({ email }).select("-password");
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    console.log(friend);

    // Ensure contacts array is initialized
    user.contacts = user.contacts || [];
    friendUser.contacts = friendUser.contacts || [];

    if (user.email === friend.email) {
      return res
        .status(400)
        .json({ message: "It is Your Email, Please enter Others" });
    }

    // Check if friend is already in contacts
    const alreadyExists = user.contacts.some(
      (contact) => contact.email === friend.email
    );
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "This email is already in your friends list" });
    }

    // Add the new contact to the array with a fallback for `profilePic`
    user.contacts.push({
      _id: friend._id,
      fullName: friend.fullName,
      email: friend.email,
      profilePic: friend.profilePic || "/avatar.png",
    });

    friendUser.contacts.push({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic || "/avatar.png",
    });

    await user.save();
    await friendUser.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error in addContact controller", error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const FriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const user = await User.findById(myId).select("-password");
    const { email } = req.body;
    const friendUser = await User.findOne({ email });
    friendUser.requests = friendUser.requests || [];
    friendUser.requests.push({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
    await friendUser.save();
    res.status(200).json("Request Sent successfully");
  } catch (error) {
    console.error("Error in FriendRequest controller", error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Allrequests = async (req, res) => {
  try {
    const user = await User.find({_id: req.user._id}).select("requests");
    res.status(200).json(user || []);
  } catch (error) {
    console.error("Error in Allrequests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
