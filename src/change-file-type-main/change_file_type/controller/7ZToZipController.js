const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const SevenZToZIP =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let sevenZFilter = (req, file , cb)=>{
    console.log(path.extname(file.originalname))
    if(file.mimetype === "application/x-7z-compressed" || path.extname(file.originalname)==".7z"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only pdf format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:sevenZFilter}).array('file',100);
   
   upload(req,res,(err)=>{
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
      

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
                let pythonSevenZConvert =""
                let list = {}
                list[req.files[0].originalname.split('.')[0]] =""
                req.files.forEach(file=>{
                    list[file.originalname.split('.')[0]] = file.path
                })

                 pythonSevenZConvert= new PythonShell(path.join("pythonProject","7ZToBZTar.py"),{
                        mode: "text",
                        pythonPath:'python',
                        scriptPath:__dirname,
                        args:[JSON.stringify(list)]
                     })
                     pythonSevenZConvert.on('message',(message)=>{
                        console.log(message)
                    }
                )
                  pythonSevenZConvert.on('error',(message)=>{
                        console.log("error"+message.toString())
                     })
                 pythonSevenZConvert.end((err)=>{
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
    SevenZToZIP
}
