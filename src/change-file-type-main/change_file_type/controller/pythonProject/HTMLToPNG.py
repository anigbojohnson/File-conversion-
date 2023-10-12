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
    path_wkhtmltopdf = r"C:\Users\hp user\Downloads\change-file-type-main-20230830T124342Z-001\change-file-type-main\change-file-type-main\change_file_type\controller\pythonProject\wkhtmltopdf\bin\wkhtmltoimage.exe"
    config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)
    pdfkit.from_file(os.path.abspath(r''+sys.argv[1]),os.path.abspath(r''+sys.argv[2]) ,options=options)
    images = convert_from_path(os.path.abspath(r''+sys.argv[2]),500,poppler_path=r'C:\Users\hp user\Downloads\Release-23.08.0-0 (1)\poppler-23.08.0\Library\bin')     
    outputPath = os.path.join('..','change_file_type', 'intermediary',r''+sys.argv[3]+'_'+sys.argv[4])
    os.mkdir(r''+outputPath)
    for image in images:
        index = index + 1
        image.save( os.path.join(outputPath ,"page"+' '+str(index)+'.png'),'PNG')

    
    if index == 1:
        shutil.move(os.path.join('..','change_file_type',  'intermediary',r''+sys.argv[3]+'_'+sys.argv[4],'page'+' '+str(index)+'.png'),  os.path.join('..','change_file_type', 'intermediary',r''+sys.argv[3]+'_'+r''+sys.argv[4]+'.png') )


    if index > 1:
        shutil.make_archive(outputPath,'zip',outputPath)

    Path(r''+sys.argv[1]).unlink()
    Path(r''+sys.argv[2]).unlink()


    shutil.rmtree(outputPath)

    print(200)

except:
    print(400)
