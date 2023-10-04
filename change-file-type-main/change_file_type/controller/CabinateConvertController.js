const { spawn } = require('child_process');
const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')

const CabinateConverter =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let cabinateFilter = (req, file , cb)=>{
    console.log(path.extname(file.originalname))
    console.log(file)

    if(path.extname(file.originalname) === ".cab"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only cab format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:cabinateFilter}).array('file',100);
   
   upload(req,res,(err)=>{
    
    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
      

        if(req.files==undefined){
            
            res.status(201).json(
                {status: "Error: No file selected" }); 
         }else{
           
                let pythonCabinateConvert =""
                let list = {}
                list[req.files[0].originalname.split('.')[0]] =""
                req.files.forEach(file=>{
                    list[file.originalname.split('.')[0]] = file.path
                })

                pythonCabinateConvert = new PythonShell(path.join("pythonProject","CabinateToZip.py"),{
                  mode: "text",
                  pythonPath:'python',
                  scriptPath:__dirname,
                  args:[JSON.stringify(list)]
               })
               pythonCabinateConvert.on('message',(message)=>{
                  console.log(message)
              }
          )
          pythonCabinateConvert.on('error',(message)=>{
                  console.log("error"+message.toString())
               })
          pythonCabinateConvert .end((err)=>{
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
    CabinateConverter
}
