const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const  ACEConverter=async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let bztarFilter = (req, file , cb)=>{
    console.log(path.extname(file.originalname))
    console.log(file)

    if(file.mimetype !== ""){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:bztarFilter}).array('file',100);
   
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
 
                pythonBZTarZConvert= new PythonShell(path.join("pythonProject","bztarTo7Z.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                pythonBZTarZConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                pythonBZTarZConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                pythonBZTarZConvert.end((err)=>{
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
    ACEConverter
}
