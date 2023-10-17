import sys, shutil 
import os,json
from pathlib import Path

directries = json.loads(sys.argv[1])

try:
    for dir in directries:
        shutil.make_archive(os.path.join(os.getcwd(),'output',r''+dir['originalname'].split('.')[0]+'_'+str(dir['filename'].split('.')[0])),'zip', os.path.join(os.getcwd(),'intermediary',dir['originalname'].split('.')[0]+'_'+str(dir['filename'].split('.')[0])))
        os.remove( os.path.abspath(os.path.join(os.getcwd(),dir['path'].split(os.path.sep)[0],dir['filename'])))
        shutil.rmtree( os.path.abspath(os.path.join(os.getcwd(),'intermediary',r''+dir['originalname'].split('.')[0]+'_'+str(dir['filename'].split('.')[0]))))
    print(200)
except:
    print(400)