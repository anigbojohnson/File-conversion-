import rarfile,sys, zipfile,shutil , tarfile
import patoolib,os,json,time,py7zr
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputZipFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploaded7ZFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputZipFile  )
        shutil.unpack_archive(r''+uploaded7ZFile , r''+outputZipFile , 'bztar')
        shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'zip', os.path.abspath(r''+ outputZipFile ))
        shutil.rmtree( outputZipFile)
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)



