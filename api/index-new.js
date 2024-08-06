import 'dotenv/config';
import config from './config/config.js';
import express from "express";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import processDbRequest from './dbconnect/processdbrequest.js';
import { read } from 'fs';
const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.text());

app.use(cors({origin: config.appCors}));

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, config.filesFolder)     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
		console.log(config.filesFolder,file)
        callBack(null, file.originalname)
		// + path.extname(file.originalname)
    }
});
 
// var upload = multer({
//     storage: storage
// });
var upload = multer({storage:storage}).single("file");	// fomr node that has files
 //! Use of Multer End

app.get("/",(req, res) => {
	res.send("You have reached the mirror server").status(200);
});
app.get("/api/Location/GetLocation",(req, res) => {
	
	try{
		processDbRequest.GetLocation()
		.then(ret => {
			//console.log("retserver",ret);
			res.send(JSON.stringify(ret)).status(200)	
		})
	}catch(ex){
		res.send(ex).status(401)
	}
});
//console.log(process.env);
app.listen(config.serverPort,()=>{
    console.log(`ecruit server started on ${config.serverPort}`)
})
