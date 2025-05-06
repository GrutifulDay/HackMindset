import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB();

const profileSchema = new mongoose.Schema ({
    date: String,
    science_tech_ai: String, 
    nature_travel_wildlife: String,
    space_learning: String, 
})

export default frontendConnection.model("profile", profileSchema)