const path = require('path')
const multer = require('multer')
const { exec } = require('child_process');

const CPIOConverter  =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "."+path.sep+"uploads")      
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
           console.log("upload path: ",req.files)

     exec(`javac "${path.join(path.resolve(__dirname,'..','..','..'),'CPIO.java')}"`,  (runError, runStdout, runStderr) => {
                if (runError) {
                    console.error('Error compiling Java program:', runError);
                    return;
                }
               let filesInfo= req.files.map((file) => ({    
                      "originalname": file.originalname,
                      "path": file.path.split(path.sep)[1]
                    
                }
                ));
                filesInfo = JSON.stringify(filesInfo);
        exec(`java "${path.join(path.resolve(__dirname,'..','..','..'),'CPIO.java')}" "${JSON.stringify(filesInfo)}"`,  (runError, runStdout, runStderr) => {
            if (runError) {
                console.error('Error running Java program:', runError);
                return;
            }
            console.log("This is out ",runStdout)
        })
    });
        
         }   
    
    }
    
})

}
module.exports ={
    CPIOConverter 
}
