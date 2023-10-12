import rarfile,sys, shutil 
import os,json,time
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         

         generatedFileName =str(int(time.time() * 1000))
         outputTarBZ2File = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedRarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+outputTarBZ2File)
         with rarfile.RarFile(uploadedRarFile , 'r') as rar_file:
            rar_file.extractall(  outputTarBZ2File )
            shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'bztar', os.path.abspath(r''+outputTarBZ2File ))
            shutil.rmtree(outputTarBZ2File)
         Path(r''+ value).unlink()
   print(200)
except:
   print(400)



