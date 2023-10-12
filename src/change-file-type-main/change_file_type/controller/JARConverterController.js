const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const  JARConverter =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let jarFilter = (req, file , cb)=>{
    console.log(path.extname(file.originalname))
    console.log(file)

    if(path.extname(file.originalname) === ".jar"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only jar format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:jarFilter}).array('file',100);
   
   upload(req,res,(err)=>{
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
      

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
                let pythonBZTarZConvert =""
                let list = {}
                list[req.files[0].originalname.split('.')[0]] =""
                req.files.forEach(file=>{
                    list[file.originalname.split('.')[0]] = file.path
                })
 
                pythonJarConvert= new PythonShell(path.join("pythonProject","jarToTar.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                     pythonJarConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                pythonJarConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                pythonJarConvert.end((err)=>{
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
    JARConverter
}
