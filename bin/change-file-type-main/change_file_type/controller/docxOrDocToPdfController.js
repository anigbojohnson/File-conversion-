const imgToPDF = require('image-to-pdf')
const fs = require('fs').promises;
const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {exec} = require('child_process');
const { stdout, stderr } = require('process');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const docxOrDocToPdf =async(req, res)=>{ 

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

            let ext = '.pdf';
            let outputPath = uuid() + "outputFile.pdf";
            const docxBuf = await fs.readFile(req.file.path);
        
            let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        

            await fs.writeFile(outputPath, pdfBuf);
        }
        
        main().catch(function (err) {
            console.log(`Error converting file: ${err}`);
        })

    }
})
}
module.exports ={
    docxOrDocToPdf 
}
