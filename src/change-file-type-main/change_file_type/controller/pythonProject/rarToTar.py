import rarfile,sys, zipfile,shutil , tarfile
import patoolib,os,json,time
from pathlib import Path
try:
    rarfile.UNRAR_TOOL=os.path.abspath(os.path.join(os.getcwd(), r"UnRAR.exe"))
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputTarFile = os.path.relpath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploadedRarFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+ outputTarFile)
        with rarfile.RarFile(uploadedRarFile , 'r') as rar_file:
                rar_file.extractall( outputTarFile )
                shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'tar', os.path.abspath(r''+outputTarFile))
                shutil.rmtree(outputTarFile)
                Path(r''+ value).unlink()
    print(200)
except:
     print(400)



