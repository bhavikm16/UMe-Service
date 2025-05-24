import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio : {
      type: String,
      default: "Hey, I'm New To UMe!",
    },

    /*Changes*/
    contacts: {
      type: [
        {
          fullName: { type: String, required: true },
          email: { type: String, default: "" },
          profilePic: { type: String, default: "" },
        },
      ],
      default: [],
    },
    
    requests: {
      type: [
        {
          fullName: { type: String, required: true },
          email: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
