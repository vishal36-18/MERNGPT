import { Router } from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        const token = jwt.sign(
            {id: newUser._id, username: name},
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
        );

        res.status(201).json({token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post("/signin", async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "user not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id, username: user.name}, process.env.SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const userId = req.user.id; 

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {router as userRouter};  