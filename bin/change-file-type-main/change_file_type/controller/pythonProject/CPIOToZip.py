import sys, shutil 
import os,json,time
from pathlib import Path
print("i am python script")
try:
    extractedDirectries = sys.argv[1][1:-1].split(',')
    uploadDirectories = sys.argv[2][1:-1].split(',')

    for extractedDirectry,uploadDirectory in zip( extractedDirectries,uploadDirectories):
        shutil.make_archive(os.path.join(os.getcwd(), "change-file-type-main","change_file_type",'output',r''+os.path.basename( os.path.abspath(extractedDirectry))),'zip', os.path.abspath(r''+extractedDirectry))
        shutil.rmtree( os.path.abspath(extractedDirectry))
        os.remove( uploadDirectory)
    print(200)
except: 
    print(400)