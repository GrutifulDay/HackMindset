import cors from "cors"
import { CHROME_EXTENSION_ALL_URL } from "../config.js";


const corsOptions = {
    origin: [ "http://127.0.0.1:5501", 
    CHROME_EXTENSION_ALL_URL ], // moje ID 
    methods: ["GET"], //povoleni HTTP metody
    credentials: true, // povoleno prenosu cookies pokud bude potreba 
    allowedHeaders: [ "Content-Type", "x-extension-auth" ], //povolene hlavicky requestu
}

export default cors(corsOptions)





