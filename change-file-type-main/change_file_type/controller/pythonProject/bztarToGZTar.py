import sys,shutil,py7zr
import os,json,time
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputGZTarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploadedBZTarFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+ outputGZTarFile )
        shutil.unpack_archive(r''+uploadedBZTarFile , r''+ outputGZTarFile , 'bztar')
        shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'gztar', os.path.abspath(r''+ outputGZTarFile ))
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)



