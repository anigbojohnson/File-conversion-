import sys,shutil 
import os,json,time,py7zr, patoolib
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputRarFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploaded7ZFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputRarFile  )
        with py7zr.SevenZipFile( uploaded7ZFile , 'r') as sevenZFile:
                sevenZFile.extractall(outputRarFile)
                patoolib.create_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.rar'), [(os.path.abspath(r''+outputRarFile))])
                shutil.rmtree( outputRarFile )
        Path(r''+ value).unlink()
        print(200)
except:
    print(400)



