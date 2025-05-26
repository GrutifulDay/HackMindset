import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB()

const retroSchema = new mongoose.Schema({
    date: String,
    year: String,
    title: {
        cz: String,
        en: String
    },
    nostalgiggle: {
        cz: String,
        en: String
    },
    like: String,
    dislike: String,
})

export default frontendConnection.model("retro", retroSchema)

