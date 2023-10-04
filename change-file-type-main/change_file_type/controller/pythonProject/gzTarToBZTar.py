import sys, shutil, tarfile
import os,json,time
from pathlib import Path
try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
            generatedFileName =str(int(time.time() * 1000))
            outputBztarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
            uploadedGZFile = os.path.abspath(os.path.join(os.getcwd(), value))
            os.makedirs(r''+  outputBztarFile)    
            with tarfile.open(uploadedGZFile) as tarFile:
                tarFile.extractall(  outputBztarFile )
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'bztar', os.path.abspath(r''+ outputBztarFile ))
                shutil.rmtree(  outputBztarFile )
            Path(r''+ value).unlink()
    print(200)
except:
    print(400)