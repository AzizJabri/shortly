const user = require("../models/User");
const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtils');
const {isEmail} = require("validator");
const {comparePassword, hashPassword, isValidPassword } = require("../utils/passwordUtils");
const { v4: uuidv4 } = require('uuid');


const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({type:"error", message:"Email and password are required"});
        }
        if(!isEmail(email)){
            return res.status(400).json({type:"error", message:"Invalid email"});
        }
        const userExists = await user.findOne({email});
        if(!userExists){
            return res.status(400).json({type:"error", message:"Invalid email or password"});
        }
        const isMatch = await comparePassword(password, userExists.password);
        if(!isMatch){
            return res.status(400).json({type:"error", message:"Invalid email or password"});
        }
        const access_token = generateAccessToken({id:userExists.id});
        const refresh_token = generateRefreshToken({id:userExists.id});
        userExists.password = undefined;
        return res.status(200).json({type:"success", user:userExists, access_token, refresh_token});
    }catch(error){
        console.log(error);
        return res.status(500).json({type:"error", message:"Internal server error"});
    }
}


const register = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({type:"error", message:"Email and password are required"});
        }
        if(!isEmail(email)){
            return res.status(400).json({type:"error", message:"Invalid email"});
        }
        if(!isValidPassword(password)){
            return res.status(400).json({type:"error", message:"Password must be valid (Minimum eight characters, at least one uppercase letter, one lowercase letter and one number)"});
        }
        const userExists = await user.findOne({email});
        if(userExists){
            return res.status(400).json({type:"error", message:"User already exists"});
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new user({
            email,
            password: hashedPassword,
            id: uuidv4()
        });
        await newUser.save();
        return res.status(201).json({type:"success", message:"User created successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const me = async (req, res) => {
    try {
        const userExists = await user.findById(req.user._id);
        if(!userExists){
            return res.status(400).json({type:"error", message:"User not found"});
        }
        userExists.password = undefined;
        return res.status(200).json({type:"success", user:userExists});
    } catch (error) {
        console.log(error);
        return res.status(500).json({type:"error", message:"Internal server error"});
    } 
}

const refreshToken = async (req, res) => {
    try {
        const {refresh_token} = req.body;
        if(!refresh_token){
            return res.status(400).json({type:"error", message:"Refresh token is required"});
        }
        const {user, type} = verifyToken(refresh_token);
        if(type !== "refresh"){
            return res.status(401).json({type:"error", message:"Invalid token"});
        }
        const userExists = await user.findById(user.id);
        if(!userExists){
            return res.status(404).json({type:"error", message:"User not found"});
        }
        const access_token = generateAccessToken({id:user._id});
        return res.status(200).json({type:"success", access_token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({type:"error", message:"Internal server error"});
    }
}

module.exports = {
    login,
    register,
    me,
    refreshToken
}