from win32com import client
from pathlib import Path
from pdf2image import convert_from_path
import sys,os,shutil
import pdfkit
import PyPDF2

try:
    index = 0
    options = {
    "enable-local-file-access": None
    }
    pdfkit.from_file(os.path.abspath(r''+sys.argv[1]),os.path.abspath(r''+sys.argv[2]) ,options=options)

    pdfObj = open(Path(r''+sys.argv[2]).resolve(),'rb')
    pdfReader = PyPDF2.PdfReader(pdfObj)
    txtObj = open(Path(r''+sys.argv[5]).resolve(),'w',encoding="utf-8") 
    outputPath = os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4],'image(s)')
    for pageNumber in range(len(pdfReader.pages)):
        page = pdfReader.pages[pageNumber]
        pageText = page.extract_text()
        txtObj.writelines(pageText)

        if len(page.images) > 0:
            if pageNumber == 0: 
                os.makedirs(r''+outputPath)
            for imageNumber in range(len(page.images)):
                with open(os.path.join(outputPath ,page.images[imageNumber].name) ,'wb') as imageFile:
                    imageFile.write(page.images[imageNumber].data)
    txtObj.close()
    pdfObj.close()
    if os.path.isdir(outputPath):
        if len(os.listdir(outputPath)) > 0:
            shutil.move(Path(r''+sys.argv[2]).resolve(),  os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4]) )
            shutil.make_archive(  os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4] ),'zip', os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4]))
            shutil.rmtree(Path(os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4])))

    Path(r''+sys.argv[1]).unlink()
    Path(r''+sys.argv[2]).unlink()

    print(200)
except:
    print(400)