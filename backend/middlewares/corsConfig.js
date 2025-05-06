import cors from "cors"

const corsOptions = {
    origin: ["http://127.0.0.1:5501", 
    "chrome-extension://nnmdmkojeohnoogpmmiopepdgjkopbbj"], // moje ID 
    methods: ["GET"], //povoleni HTTP metody
    credentials: true, // povoleno prenosu cookies pokud bude potreba 
    allowedHeaders: ["Content-Type"], //povolene hlavicky requestu
}

export default cors(corsOptions)





