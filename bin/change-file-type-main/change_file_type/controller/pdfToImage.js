const fs = require('fs')
const path = require('path')
const multer = require('multer')
const zipFile = require('adm-zip')
const uuid = require('uuid').v4;
const {exec} = require('child_process');
const { stdout, stderr } = require('process');

var generatedFileName = uuid()
 

const pdfToImage =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = generatedFileName+ path.extname(file.originalname)
            console.log(file.originalname[0])
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
                fs.mkdir('output/'+generatedFileName, (err) => {
                    if (err) {
                    console.log("error occurred in creating new directory", err);
                    return;
                    }})
                 let outputPath= path.join('output',generatedFileName,"output-%3d.jpg")
                exec(`magick convert ${req.file.path} -quality 100 ${outputPath} `,(err,stdout,stderr)=>{
                    
                    if(err)
                        console.log(err) 
                    else{
                  
                            fs.readdir('./output/'+generatedFileName, (err, folder) => {
                            if (err) throw err;
                            let zip = new zipFile();
                           
                            folder.forEach(file=>{
                                    zip.addLocalFile('./output/'+generatedFileName+"/"+file);
                                
                            }) 
                            fs.writeFile(req.file.originalname.split('.')[0]+"_"+generatedFileName+".zip", zip.toBuffer(), (err) => {
                                if (err) throw err;
                                console.log('The file has been saved!');
                              }); 
                       
                        });
                    }
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
    pdfToImage
}
