import rarfile,sys, zipfile
import patoolib,os,json,time
from pathlib import Path

try:
    listOfZipPath = json.loads(sys.argv[1])
    print(listOfZipPath)
    for key, value in listOfZipPath.items():
        with zipfile.ZipFile(os.path.abspath(r''+value), 'r') as zip_ref:
            generatedFileName =str(int(time.time() * 1000))
            outputPath = os.path.abspath(os.path.join('change_file_type', 'intermediary',generatedFileName))
            os.makedirs(outputPath)
            zip_ref.extractall(r''+outputPath)
            patoolib.create_archive(os.path.join('..','change_file_type', 'output',r''+key+'_'+generatedFileName+'.rar'), [(os.path.abspath(r''+outputPath))])
    print(200)
except:
    print(400)
    