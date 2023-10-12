import sys,shutil,py7zr
import os,json,time
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        output7ZFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploadedBZTarFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+ output7ZFile )
        shutil.unpack_archive(r''+uploadedBZTarFile , r''+ output7ZFile , 'bztar')
        with py7zr.SevenZipFile(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.7z'), 'w') as archive:
                 archive.writeall(r''+output7ZFile)
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)



