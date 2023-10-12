import rarfile,sys, zipfile,shutil 
import os,json,time
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         generatedFileName =str(int(time.time() * 1000))
         outputGzterFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedJarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+outputGzterFile)
         with zipfile.ZipFile(uploadedJarFile, 'r') as jarFile:
                jarFile.extractall( outputGzterFile)
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'gztar', os.path.abspath(r''+outputGzterFile))
         shutil.rmtree(outputGzterFile)
         Path(r''+ value).unlink()
   print(200)
except:
     print(400)



