import rarfile,sys, shutil 
import os,json,time
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         generatedFileName =str(int(time.time() * 1000))
         outputTarGZFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedRarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+outputTarGZFile)
         with rarfile.RarFile(uploadedRarFile , 'r') as rar_file:
            rar_file.extractall(  outputTarGZFile )
            shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'gztar', os.path.abspath(r''+outputTarGZFile ))
            shutil.rmtree(outputTarGZFile)
         Path(r''+ value).unlink()
   print(200)
except:
   print(400)



