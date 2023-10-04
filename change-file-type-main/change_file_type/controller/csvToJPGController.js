const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {PythonShell} = require('python-shell')
var htmlToImage = require('html-to-image');
let generatedFileName = uuid();


const  csvToPNG =async(req, res)=>{ 

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
            
            let intermediaryOutputPathXLSX = path.join('..','change_file_type','intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".xlsx")
            let intermediaryOutputPathPDF = path.join('..','change_file_type','intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".pdf")

            const pythonCsvToPNGConvert = new PythonShell(path.join("pythonProject","csvToJPGImage.py"),{
                mode: "text",
                pythonPath:'python',
                scriptPath:__dirname,
                args:[path.join('..','change_file_type',req.file.path),intermediaryOutputPathXLSX ,req.file.originalname.split('.')[0],generatedFileName,intermediaryOutputPathPDF]
             })
             pythonCsvToPNGConvert.on('message',(message)=>{
                
                let jsonMessage = message.toString()
                console.log(jsonMessage)
             })
             pythonCsvToPNGConvert.on('error',(message)=>{
                console.log("error"+message.toString())
             })
             pythonCsvToPNGConvert.end((err)=>{
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
    csvToPNG 
}
