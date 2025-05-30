import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketID, io } from "../lib/socket.js";
import multer from "multer";

export const getUserContacts = async (req,res) =>{
    try {
        const loggedInUser = req.user._id;
        /*Changes*/
        const filtereduser = await User.find({_id: loggedInUser}).select("contacts")
        res.status(200).json(filtereduser)
    } catch (error) {
        console.log("Error in UserContacts" + error.message);
        res.status(500).json({message: "Internal Server Error"});        
    }
}


export const getAllUsers = async (req,res) => {
    try {
      const loggedInUser = req.user._id;
      /*Changes*/
      const filtereduser = await User.find({_id: {$ne : loggedInUser}}).select("-password")
      res.status(200).json(filtereduser)
  } catch (error) {
      console.log("Error in AllUsers" + error.message);
      res.status(500).json({message: "Internal Server Error"});        
  }
}

export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, recieverId: userToChatId },
          { senderId: userToChatId, recieverId: myId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const sendMessages = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { text } = req.body;
      const { id: recieverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: "messages" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      }

      const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image: imageUrl,
      });

      await newMessage.save();

      const receiverSocketId = getRecieverSocketID(recieverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Fail to send the Message", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
];