const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {PythonShell} = require('python-shell')


var generatedFileName = uuid()
 

const PDFToHTML =async(req, res)=>{ 

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
              
                 let intermediaryPath= path.join('intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".docx")
                 let outputPath= path.join('output',req.file.originalname.split('.')[0]+"_"+generatedFileName+".docx")

                 const pdfToHTMLConvert = new PythonShell(path.join("pythonProject","PDFToHTML.py"),{
                    mode: "text",
                    pythonPath:'python',
                    scriptPath:__dirname,
                    args:[req.file.path,intermediaryPath,outputPath]
                 })
                 pdfToHTMLConvert.on('message',(message)=>{
                    console.log(message)
                 })
                 pdfToHTMLConvert.on('error',(message)=>{
                    console.log(message)
                 })
                 pdfToHTMLConvert.end((err)=>{
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
    PDFToHTML
}
