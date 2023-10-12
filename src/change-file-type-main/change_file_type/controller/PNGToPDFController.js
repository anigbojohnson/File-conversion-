const fs = require('fs')
const path = require('path')
const multer = require('multer')
const zipFile = require('adm-zip')
const {exec} = require('child_process');
const { stdout, stderr } = require('process');
let fileNameInList =  new Map()
const uuid = require('uuid').v4;
let fieldName = ""

const PNGToPDF =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let pngFilter = (req, file , cb)=>{
    if(file.mimetype === "image/png" ){
         fieldName = file.fieldname
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:pngFilter }).array('file',100);
   
   upload(req,res,(err)=>{
    let  outputPath =""
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
        console.log(req.files[0].path)

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
            try{       
                let generatedFileName = Date.now()
                outputPath= path.join('output','output'+"_"+generatedFileName+".PDF")
                let list =""

            req.files.forEach(file=>{
                list+=file.path
                list+=" "
                 exec(`magick convert ${list} -quality 100 ${outputPath} `,(err,stdout,stderr)=>{
                    if(err) 
                        console.log(err)  
                    else  
                         console.log('file transform successfully') 
                }) 
        
               }              
             )
             console.log(fileNameInList)
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
    PNGToPDF
}
