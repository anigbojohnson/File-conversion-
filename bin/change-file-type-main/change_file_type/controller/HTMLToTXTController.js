const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')
const { stdout, stderr } = require('process');
let generatedFileName = Date.now()
 

const  HTMLToTXT = async(req, res)=>{ 

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

    let excelFilter = (req, file , cb)=>{
    
        if(file.mimetype === "text/html"){
            cb(null , true);
        }else{
            cb(null , false);
            return cb("Only html format is allowed");
        }
       };
   let upload = multer({storage : storage,fileFilter:excelFilter }).single('file');
   
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
            
                let intermediaryOutputPath = path.join('..','change_file_type','intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".PDF")
                let outputPath = path.join('..','change_file_type','output',req.file.originalname.split('.')[0]+"_"+generatedFileName+".TXT")

                const pythonHTMLToTXTConvert = new PythonShell(path.join("pythonProject","HTMLToTXTx.py"),{
                    mode: "text",
                    pythonPath:'python',
                    scriptPath:__dirname,
                    args:[path.join('..','change_file_type',req.file.path),intermediaryOutputPath,req.file.originalname.split('.')[0],generatedFileName,outputPath]
                 })
                 pythonHTMLToTXTConvert.on('message',(message)=>{
                    console.log(message)
                }
            )
               pythonHTMLToTXTConvert.on('error',(message)=>{
                    console.log("error"+message.toString())
                 })
                 pythonHTMLToTXTConvert.end((err)=>{
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
    HTMLToTXT
}
