import sys,shutil 
import os,json,time,py7zr
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputGZTarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploaded7ZFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputGZTarFile  )
        with py7zr.SevenZipFile( uploaded7ZFile , 'r') as sevenZFile:
                sevenZFile.extractall(outputGZTarFile)
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'gztar', os.path.abspath(r''+outputGZTarFile ))
                shutil.rmtree( outputGZTarFile )
        Path(r''+ value).unlink()
        print(200)
except:
    print(400)



