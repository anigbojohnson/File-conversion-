const fs = require('fs')
const path = require('path')
const multer = require('multer')
const zipFile = require('adm-zip')
const {exec} = require('child_process');
const { stdout, stderr } = require('process');
let fileNameInList =  new Map()
const uuid = require('uuid').v4;


const PNGToJPG =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let pdfFilter = (req, file , cb)=>{
    if(file.mimetype === "image/png" ){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:pdfFilter }).array('file',100);
   
   upload(req,res,(err)=>{
    let  outputPath =""
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
            try{
          
                let size = req.files.length
                console.log(size);
                let generatedFileName = ""+Date.now()

            if(size >1){
                fs.mkdir('output/'+generatedFileName, (err) => {
                    if (err) {
                    console.log("error occurred in creating new directory", err);
                    return;
                    }})    

            }else{
            
                outputPath= path.join('output',req.files[0].originalname.split('.')[0]+"_"+generatedFileName+".jpg")
            }
            let pngFileName = ""
            console.log(generatedFileName) 

            req.files.forEach(file=>{
                 pngFileName = uuid()
                 exec(`magick convert ${file.path} -quality 100 ${path.join('output',generatedFileName,`${ pngFileName +'.JPG'}`)} `,(err,stdout,stderr)=>{
                    fileNameInList.set(""+pngFileName,file.originalname)
                    if(err)
                        console.log(err) 
                    else{
                        fs.readdir(path.join('output',generatedFileName), (err, files) => {

                            if (err) {
                                console.error('Error reading folder:', err);
                                return;
                              } 
                            files.forEach(file=>{
                                
            
                                fileUpdate = file.split('.')[0]
                                fileNameInList.forEach (function(value, key) {
                                
                                   
                                        console.log(fileUpdate)
                                        console.log("key"+key)

                                        if(fileUpdate===key){
                                            console.log(fileNameInList.get(key).split('.')[0]+'.JPG')
                                            fs.rename(path.join('output',generatedFileName,fileUpdate+".JPG"), path.join('output',generatedFileName,fileNameInList.get(key).split('.')[0]+'.JPG'), (err) => {
                                              
                                                if (err) {
                                                  console.error('Error renaming file:', err);
                                                } else {
                                                  console.log('File renamed successfully.');
                                                }
                                              })
                                        }
                                    })

                                      }
                               )
                          });
                    }
                    
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
    PNGToJPG
}
