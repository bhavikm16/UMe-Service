import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketID, io } from "../lib/socket.js";

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

export const sendMessages = async (req,res) => {
    try {
        const {text,image} = req.body;
        const { id: recieverId} = req.params;
        const myId = req.user._id
        const senderId = myId;

        let imageUrl;
        if(image){
            const uploadresponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadresponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        //socket io logic goes here next
        const receiverSocketId = getRecieverSocketID(recieverId);
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Fail to send the Message" + error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}