import rarfile,sys, zipfile,shutil , tarfile
import patoolib,os,json,time,py7zr
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputBztarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploadedRarFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputBztarFile  )
        shutil.unpack_archive(r''+ uploadedRarFile , r''+ outputBztarFile , 'bztar')
        patoolib.create_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.rar'), [(os.path.abspath(r''+ outputBztarFile))])
        shutil.rmtree( outputBztarFile )
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)



