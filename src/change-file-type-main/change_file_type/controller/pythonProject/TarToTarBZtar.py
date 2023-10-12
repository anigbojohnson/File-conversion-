import sys,shutil , tarfile
import gzip,os,json,time
from pathlib import Path


# folder_contents = os.listdir(os.path.abspath(os.path.join(os.getcwd(), 'output')))
#print(folder_contents)
#    for item in folder_contents:
#       item_path = os.path.abspath(os.path.join(os.getcwd(), 'output', item))
#      shutil.rmtree(item_path)   # Remove subdirectories
#       print("deleted "+item_path)
#   print("finished")
try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        with tarfile.open(os.path.abspath(r''+value), 'r') as tar_ref:
            generatedFileName =str(int(time.time() * 1000))
            outputPath = os.path.abspath(os.path.join('change_file_type', 'intermediary',generatedFileName))
            os.makedirs(outputPath)
            tar_ref.extractall(r''+outputPath)
            shutil.make_archive(os.path.join('..','change_file_type', 'output',r''+key+'_'+generatedFileName),'bztar', os.path.abspath(r''+outputPath))
            shutil.rmtree(outputPath)
        Path(r''+ value).unlink()
    print(200)

except:
    print(400)



