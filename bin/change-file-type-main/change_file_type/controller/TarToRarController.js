const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const TARToRAR =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let tarFilter = (req, file , cb)=>{
    if(file.mimetype === "application/x-tar"){
console.log("jesus is lord")
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:tarFilter }).array('file',100);
   
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

                    pythonZipToRarConvert = new PythonShell(path.join("pythonProject","tarToXztar.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                     pythonZipToRarConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                  pythonZipToRarConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                     pythonZipToRarConvert.end((err)=>{
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
    TARToRAR
}
