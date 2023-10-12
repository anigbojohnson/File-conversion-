const imgToPDF = require('image-to-pdf')
const fs = require('fs').promises;
const fss = require('fs');
const path = require('path')
const multer = require('multer')
const uuid = require('uuid').v4;
const {exec} = require('child_process');
const { stdout, stderr } = require('process');
const zipFile = require('adm-zip')
const libre = require('libreoffice-convert');
let generatedFileName = uuid();
libre.convertAsync = require('util').promisify(libre.convert);

const  docOrDocxToImage =async(req, res)=>{ 

    let storage =  multer.diskStorage({
        destination: (req,file, cb)=>{
         cb(null , "./uploads")      
        },
        filename: (req,file, cb)=>{
            let fileName = generatedFileName+ path.extname(file.originalname)
            return cb(null , fileName)      
           }
    })
   
   let docxOrDocFilter = (req, file , cb)=>{
    
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
            let outputTempPath = "intermediary/"+generatedFileName + ".pdf";
            const docxBuf = await fs.readFile(req.file.path);
        
            let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
            
             fs.writeFile(outputTempPath, pdfBuf);

            fs.mkdir('output/'+generatedFileName, (err) => {
                if (err) {
                console.log("error occurred in creating new directory", err);
                return;
                }})
             let outputPath= path.join('output',generatedFileName,"output-%3d.jpeg")


              exec(`magick convert ${outputTempPath} -transparent  "rgb(160,160,255)" -background "rgb(255,255,255)"  ${outputPath} `,(err,stdout,stderr)=>{
                 
                if(err)
                    console.log(err) 
                else{
                    
                        fss.readdir('./output/'+generatedFileName, (err, folder) => {
                        if (err) throw err;
                        let zip = new zipFile();
                        
                        folder.forEach(file=>{
                                zip.addLocalFile('./output/'+generatedFileName+"/"+file);
                                
                                
                        }) 
                    
                        fs.writeFile(req.file.originalname.split('.')[0]+"_"+generatedFileName+".zip", zip.toBuffer(), (err) => {
                           
                          }); 
                   
                    });
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
    docOrDocxToImage
}
