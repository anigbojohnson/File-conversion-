const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {PythonShell} = require('python-shell')
let generatedFileName = uuid();


const  csvToPdf =async(req, res)=>{ 

    let storage =  multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = generatedFileName+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let csvFilter = (req, file , cb)=>{
    
    if(file.mimetype === "text/csv"){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only csv format is allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter : csvFilter }).single('file');

upload(req,res,(err)=>{

    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{

        async function main() {
            let intermediaryPath = path.join('..','change_file_type','intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".html")
            let outputPath = path.join('..','change_file_type','output',req.file.originalname.split('.')[0]+"_"+generatedFileName+".pdf")
       
            const pythonCsvToPdfConvert = new PythonShell(path.join("pythonProject","csvToPdf.py"),{
                mode: "text",
                pythonPath:'python',
                scriptPath:__dirname,
                args:[req.file.path,intermediaryPath,outputPath]
             })
             pythonCsvToPdfConvert.on('message',(message)=>{
                
                let jsonMessage = message.toString()
                console.log(jsonMessage)
             })
             pythonCsvToPdfConvert.on('error',(message)=>{
                console.log("error"+message.toString())
             })
             pythonCsvToPdfConvert.end((err)=>{
                if(err){
                    console.log(err)
                    return
                }
             })
        }

        main().catch(function (err) {
            console.log(`Error converting file: ${err}`);
        })


    }
})
}
module.exports ={
    csvToPdf
}
