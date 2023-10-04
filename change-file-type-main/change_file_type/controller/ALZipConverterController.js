const decompress = require('decompress');
const path = require('path')
const multer = require('multer')
const {PythonShell} = require('python-shell')


const ALZipConverter =async(req, res)=>{ 

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

    if(path.extname(file.originalname) === ".alz"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only alz format allowed");
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
                let generatedFileName =""+Date.now()
                let outputFilePath =""
                let intermediaryFilePath=""
                console.log(generatedFileName)
                decompress(req.files[0].path, path.join(__dirname,'output',generatedFileName))
                .then(files => {
                    console.log(`Extracted ${files.length} files.`);
                })
                .catch(error => {
                    console.error('Extraction error:', error);
                });
                req.files.forEach(file=>{

                pythonCabinateConvert = new PythonShell(path.join("pythonProject","alzToZip.py"),{
                  mode: "text",
                  pythonPath:'python',
                  scriptPath:__dirname,
                  args:[file.path]
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
            })
         }   
    
    }
    
})

}
module.exports ={
    ALZipConverter 
}
