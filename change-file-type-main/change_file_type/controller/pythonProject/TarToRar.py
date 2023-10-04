import sys, shutil
import patoolib,os,json,time
from pathlib import Path
import tarfile

try:        
    listOfZipPath = json.loads(sys.argv[1])
    print(listOfZipPath)
    for key, value in listOfZipPath.items():
        with tarfile.open(value, 'r') as tar_ref:
            generatedFileName =str(int(time.time() * 1000))
            outputPath = os.path.abspath(os.path.join(os.getcwd(), 'intermediary', generatedFileName ))
            os.makedirs(outputPath)
            tar_ref.extractall(outputPath)
            patoolib.create_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.rar'), [(os.path.abspath(r''+outputPath))])
            shutil.rmtree(outputPath)
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)