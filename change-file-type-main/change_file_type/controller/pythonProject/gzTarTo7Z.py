import patoolib,sys, shutil, tarfile,py7zr
import os,json,time
from pathlib import Path
try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        with tarfile.open(os.path.abspath(r''+value), 'r') as tar_ref:
            generatedFileName =str(int(time.time() * 1000))
            outputPath = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
            os.makedirs(r''+outputPath)  
            with py7zr.SevenZipFile(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.7z'), 'w') as archive:
                 archive.writeall(r''+outputPath)
            shutil.rmtree(outputPath)
            Path(r''+value).unlink()
    print(200)
except:
    print(400)



