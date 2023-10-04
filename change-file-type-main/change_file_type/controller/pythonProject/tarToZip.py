import rarfile,sys, zipfile,shutil , tarfile
import patoolib,os,json,time
from pathlib import Path

listOfZipPath = json.loads(sys.argv[1])
for key, value in listOfZipPath.items():
    with tarfile.open(os.path.abspath(r''+value), 'r') as tar_ref:
        generatedFileName =str(int(time.time() * 1000))
        outputPath = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        os.makedirs(r''+outputPath)
        tar_ref.extractall(outputPath)
        with zipfile.ZipFile( os.path.abspath(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName+'.zip')), 'w', zipfile.ZIP_DEFLATED) as zipf:
          for foldername, subfolders, filenames in os.walk(r''+outputPath):
                for filename in filenames:
                    filepath = os.path.join(foldername, filename)
                    arcname = os.path.relpath(filepath, r''+outputPath)
                    zipf.write(filepath, arcname)
        shutil.rmtree(outputPath)
    Path(r''+ value).unlink()
    
       
