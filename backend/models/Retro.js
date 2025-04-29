import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB();

const retroSchema = new mongoose.Schema({
    years: String,
    title: String,
    nostalgiggle: String,
    like: String,
    dislike: String,
    date: String 
})

export default frontendConnection.model("retro", retroSchema)

