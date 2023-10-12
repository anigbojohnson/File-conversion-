import rarfile,sys, zipfile,shutil 
import os,json,time
from pathlib import Path
try:
   rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
   listOfZipPath = json.loads(sys.argv[1])
   for key, value in listOfZipPath.items():
         

         generatedFileName =str(int(time.time() * 1000))
         outputZipFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
         uploadedRarFile = os.path.abspath(os.path.join(os.getcwd(), value))
         os.makedirs(r''+outputZipFile)
         with rarfile.RarFile(uploadedRarFile , 'r') as rar_file:
            rar_file.extractall(  outputZipFile )
            with zipfile.ZipFile( os.path.abspath(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.zip')), 'w', zipfile.ZIP_DEFLATED) as zipf:
               for foldername, subfolders, filenames in os.walk(r''+outputZipFile):
                     for filename in filenames:
                           filepath = os.path.join(foldername, filename)
                           arcname = os.path.relpath(filepath, r''+outputZipFile)
                           zipf.write(filepath, arcname)
         shutil.rmtree(outputZipFile)
         Path(r''+ value).unlink()
   print(200)
except:
     print(400)



