const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const RARToZIP =async(req, res)=>{ 
    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let rarFilter = (req, file , cb)=>{
    console.log(file.mimetype)
    if(file.mimetype === "application/vnd.rar"|| file.mimetype === "application/octet-stream"){
       
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:rarFilter }).array('file',100);
   
   upload(req,res,(err)=>{
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
      

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{

                let pythonRarToZipConvert =""
                let list = {}
                list[req.files[0].originalname.split('.')[0]] =""
                req.files.forEach(file=>{
                    list[file.originalname.split('.')[0]] = file.path
                })

                pythonRarToZipConvert = new PythonShell(path.join("pythonProject","rarToTarGZ.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                     pythonRarToZipConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                pythonRarToZipConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                pythonRarToZipConvert.end((err)=>{
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
    RARToZIP
}
