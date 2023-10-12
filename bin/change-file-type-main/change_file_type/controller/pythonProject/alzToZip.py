import sys, shutil ,os,json,zipfile,time,py7zr
from pathlib import Path
import subprocess

print("start")
generatedFileName =str(int(time.time() * 1000))

outputPath = os.path.abspath(os.path.join('change_file_type', 'intermediary',generatedFileName))
os.makedirs(r''+outputPath)  


# Replace 'path/to/alzip851.exe' with the actual path to ALZip851 executable
alzip_exe = r'c:\Users\hp user\Downloads\ALZip851.exe'

# Create the command to extract the archive
cmd = [alzip_exe, 'e',os.path.abspath( r''+sys.argv[1]),outputPath ]

# Execute the command
try:
    subprocess.run(cmd, check=True)
    print("Extraction successful.")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")

