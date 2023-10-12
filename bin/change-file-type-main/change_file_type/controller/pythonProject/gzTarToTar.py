import sys, shutil, tarfile
import os,json,time
from pathlib import Path
try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
            generatedFileName =str(int(time.time() * 1000))
            outputZipFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
            uploadedGZFile = os.path.abspath(os.path.join(os.getcwd(), value))
            os.makedirs(r''+ outputZipFile)    
            with tarfile.open(uploadedGZFile) as tarFile:
                tarFile.extractall( outputZipFile)
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'tar', os.path.abspath(r''+outputZipFile ))
                shutil.rmtree( outputZipFile )
            Path(r''+ value).unlink()
    print(200)
except:
    print(400)



