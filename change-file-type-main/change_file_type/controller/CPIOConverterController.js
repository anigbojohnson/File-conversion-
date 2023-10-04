const path = require('path')
const fs = require('fs');
const multer = require('multer')
const { exec } = require('child_process');

const {PythonShell} = require('python-shell')


const CPIOConverter  =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = Date.now()+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let cpioFilter = (req, file , cb)=>{
    console.log(path.extname(file.originalname))
    console.log(file)

    if(path.extname(file.originalname) === ".cpio"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only cpio format allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter:cpioFilter}).array('file',100);
   
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
// C:\Users\hp user\Downloads\javaProject\src\CPIO.java
        
        // Run the Java program
        console.log("file path ",path.join(path.resolve(__dirname, '..')))
        fs.mkdir(path.join(path.resolve(__dirname, '..'),'intermediary',generatedFileName), (err) => {
            if (err) {
            console.log( err);
            return;
            }

            
        
            // C:\Users\hp user\Downloads\javaProject\src\CPIO.java
     console.log("the file ",path.resolve(__dirname, '..','..','..','..'))
     exec(`javac "${path.join(path.resolve(__dirname, '..','..','..','..'),'javaProject','src','CPIO.java')}"`,  (runError, runStdout, runStderr) => {
                if (runError) {
                    console.error('Error compiling Java program:', runError);
                    return;
                }
        exec(`java "${path.join(path.resolve(__dirname, '..','..','..','..'),'javaProject','src','CPIO.java')}" "${path.join(path.resolve(__dirname, '..'),req.files[0].path)}" "${path.join(path.resolve(__dirname, '..'),'intermediary',generatedFileName,req.files[0].originalname.split('.')[0])}"`,  (runError, runStdout, runStderr) => {
            if (runError) {
                console.error('Error running Java program:', runError);
                return;
            }
            console.log("This is out ",runStdout)
        })
    });
})        


         }   
    
    }
    
})

}
module.exports ={
    CPIOConverter 
}
