import rarfile,sys, zipfile,shutil 
import os,json,time,  py7zr
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         generatedFileName =str(int(time.time() * 1000))
         output7ZFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedJarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+output7ZFile)
         with zipfile.ZipFile(uploadedJarFile, 'r') as jarFile:
                jarFile.extractall( output7ZFile)
                with py7zr.SevenZipFile(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.7z'), 'w') as archive:
                 archive.writeall(r''+ output7ZFile)
                shutil.rmtree(output7ZFile)
         Path(r''+ value).unlink()
   print(200)
except:
     print(400)



