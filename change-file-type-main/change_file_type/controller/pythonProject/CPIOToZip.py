import sys, shutil 
import os,json,time
from pathlib import Path

filePath = sys.stdin.read()
upload,output = filePath.split(";")[1],filePath.split(";")[0]
generatedFileName =str(int(time.time() * 1000))
shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+os.path.dirname( os.path.abspath(output))+'_'+generatedFileName),'zip', os.path.abspath(r''+upload))
shutil.rmtree( os.path.abspath(upload))
Path(r''+ output).unlink()
print(200)
