const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4
const {PythonShell} = require('python-shell')
let generatedFileName = uuid()


const excelToPdf =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let filePath = file.originalname.split('.')[0] + "_"+generatedFileName + path.extname(file.originalname)
            return cb(null , filePath)      
           }
    })
   
   let excelFilter = (req, file , cb)=>{
    
    if(file.mimetype === "application/vnd.ms-excel" || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only Microsoft Excel format is allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter : excelFilter }).single('file');

upload(req,res,(err)=>{

    if(err){
        console.log(err)
        res.status(201).json(
            {status: err }); 
    }else{
        
            let outputPath = path.join('..','transform_file','change_file_type','output',req.file.originalname.split('.')[0]+"_"+generatedFileName+".pdf")
       
            const pythonExcelToPdfConvert = new PythonShell(path.join("pythonProject","excelToPdf.py"),{
                mode: "text",
                pythonPath:'python',
                scriptPath:__dirname,
                args:[req.file.path,outputPath]
             })
             pythonExcelToPdfConvert.on('message',(message)=>{
                
                let jsonMessage = message.toString()
                console.log(jsonMessage)
             })
             pythonExcelToPdfConvert.on('error',(message)=>{
                console.log("error"+message.toString())
             })
             pythonExcelToPdfConvert.end((err)=>{
                if(err){
                    console.log(err)
                    return
                }
             })
    }
})
}
module.exports ={
    excelToPdf
}
