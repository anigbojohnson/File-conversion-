const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {PythonShell} = require('python-shell')


var generatedFileName = uuid()
 

const PDFToMP3 =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = generatedFileName+ path.extname(file.originalname)
            
            return cb(null , fileName)      
           }
    })
   let pdfFilter = (req, file , cb)=>{
    if(file.mimetype === "application/pdf" ){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:pdfFilter }).single('file');
   
   upload(req,res,(err)=>{
    if(err){
        
        res.status(201).json(
            {status: "error " }); 
    }else{

        if(req.file==undefined){
            console.log(err)
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{                
              
                 let outputPath= path.join('output',req.file.originalname.split('.')[0]+"_"+generatedFileName+".mp3")

                 const pdfToMP3Convert = new PythonShell(path.join("pythonProject","PDFToMP3.py"),{
                    mode: "text",
                    pythonPath:'python',
                    scriptPath:__dirname,
                    args:[req.file.path,outputPath]
                 })
                 pdfToMP3Convert.on('message',(message)=>{
                    console.log(message)
                 })
                 pdfToMP3Convert.on('error',(message)=>{
                    console.log(message)
                 })
                 pdfToMP3Convert.end((err)=>{
                    if(err){
                        console.log(err)
                        return
                    }
                 })
            
         }   
    
    }
})
}
module.exports ={
    PDFToMP3
}
