const imgToPDF = require('image-to-pdf')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {exec} = require('child_process');
const { stdout, stderr } = require('process');

const imageToPdf =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let filePath = file.fieldname+uuid()+ path.extname(file.originalname)
            return cb(null , filePath)      
           }
    })
   
   let imageFilter = (req, file , cb)=>{
    if(file.mimetype === "image/png" || file.mimetype=== "image/jpg" || file.mimetype ==="image/jpeg"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only .png, .jpg, and .jpg format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:imageFilter }).single('file');
console.log(upload)
upload(req,res,(err)=>{
    if(err){
        console.log(err)
        res.status(201).json(
            {status: err }); 
    }else{
        if(req.file==undefined){
            console.log(err)
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
            try{
                let outputPath = uuid() + "outputFile.pdf";
                console.log(req.file.path)
                exec(`magick convert ${req.file.path} -quality 60  ${outputPath}`,(err, stdout,stderr)=>{      
                    res.download(outputPath,err=>{
                        if(err){
                            res.status(201).json(
                                {status: err }); 
                        }
                    })     
                })
            }
            catch(err){
                res.status(201).json(
                    {status: err }); 
            }
         }   
    
    }
})
}
module.exports ={
    imageToPdf
}
