from win32com import client
from pathlib import Path
from pdf2image import convert_from_path
import sys,os,shutil
import pdfkit
try:
    index = 0
    options = {
    "enable-local-file-access": None
    }
    pdfkit.from_file(os.path.abspath(r''+sys.argv[1]),os.path.abspath(r''+sys.argv[2]) ,options=options)
    Path(r''+sys.argv[1]).unlink()

    print(200)
except:
    print(400)
