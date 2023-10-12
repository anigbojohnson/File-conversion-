const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const GZToZIP = async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let gzFilter = (req, file , cb)=>{
    console.log(file.mimetype)
    if(file.mimetype === "application/gzip" || file.mimetype === "application/x-gzip" ){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only tar format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:gzFilter }).array('file',100);
   
   upload(req,res,(err)=>{
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
      

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{

                let generatedFileName = ""
                let pythonZipToRarConvert =""
                let list = {}
                list[req.files[0].originalname.split('.')[0]] =""
                req.files.forEach(file=>{
                    list[file.originalname.split('.')[0]] = file.path
                })

                    pythonGZToZipConvert = new PythonShell(path.join("pythonProject","gzTarToTar.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                     pythonGZToZipConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                pythonGZToZipConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                     pythonGZToZipConvert.end((err)=>{
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
    GZToZIP
}
