import rarfile,sys, zipfile,shutil 
import os,json,time
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         generatedFileName =str(int(time.time() * 1000))
         outputZipFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedJarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+outputZipFile)
         with zipfile.ZipFile(uploadedJarFile, 'r') as jarFile:
                jarFile.extractall( outputZipFile)
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'tar', os.path.abspath(r''+outputZipFile))
         shutil.rmtree(outputZipFile)
         Path(r''+ value).unlink()
   print(200)
except:
     print(400)



