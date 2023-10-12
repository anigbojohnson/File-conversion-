const imgToPDF = require('image-to-pdf')
const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const { stdout, stderr } = require('process');
const {PythonShell} = require('python-shell')
let generatedFileName = Date.now()


const    docxToHTML =async(req, res)=>{ 

    let storage = multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let filePath = file.fieldname+uuid()+ path.extname(file.originalname)
            return cb(null , filePath)      
           }
    })
   
   let docxOrDocFilter = (req, file , cb)=>{
    console.log(file.mimetype)
    if(file.mimetype === "application/msword" || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        cb(null , true);
    }else{
        cb(null , false);
        return cb("Only docx and/or doc format is allowed");
    }
   };
   let upload = multer({storage : storage,fileFilter : docxOrDocFilter }).single('file');

upload(req,res,(err)=>{

    if(err){
        
        res.status(201).json(
            {status: err }); 
    }else{
        
        async function main() {
            let intermediaryOutputPath = path.join('..','change_file_type','intermediary',req.file.originalname.split('.')[0]+"_"+generatedFileName+".HTML")
            const pythonDOCXToHTMLConvert = new PythonShell(path.join("pythonProject","DOCXToHTML.py"),{
                mode: "text",
                pythonPath:'python',
                scriptPath:__dirname,
                args:[path.join('..','change_file_type',req.file.path),intermediaryOutputPath]
             })
             pythonDOCXToHTMLConvert.on('message',(message)=>{
                console.log(message)
            }
        )
            pythonDOCXToHTMLConvert.on('error',(message)=>{
                console.log("error"+message.toString())
             })
             pythonDOCXToHTMLConvert.end((err)=>{
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
    docxToHTML
}
