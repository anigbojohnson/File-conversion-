import sys,shutil 
import os,json,time,py7zr
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputTarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploaded7ZFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputTarFile  )
        with py7zr.SevenZipFile( uploaded7ZFile , 'r') as sevenZFile:
                sevenZFile.extractall(outputTarFile)
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'tar', os.path.abspath(r''+ outputTarFile ))
                shutil.rmtree( outputTarFile )
        Path(r''+ value).unlink()
        print(200)
except:
    print(400)



