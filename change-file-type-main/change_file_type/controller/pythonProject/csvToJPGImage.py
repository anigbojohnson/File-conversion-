import pandas as pd
from win32com import client
from pathlib import Path
from pdf2image import convert_from_path
import sys,os,shutil

try:

    index = 0

    df = pd.read_csv(Path(r''+sys.argv[1]).resolve())
    writer = pd.ExcelWriter(Path(r''+sys.argv[2]).resolve())
    df.to_excel(writer , index=False)
    writer.close()
    excel_file =Path(r''+sys.argv[2]).resolve()
    app = client.gencache.EnsureDispatch('Excel.Application', True)
    app.Visible = False

    app.Interactive = False
    wb = app.Workbooks.Open(excel_file) 
    wb.ActiveSheet.ExportAsFixedFormat( 0 , os.path.abspath(r''+sys.argv[5]))
    wb.Close(True)
    app.Quit()
    images = convert_from_path(os.path.abspath(r''+sys.argv[5]),500,poppler_path=r'C:\Users\THOMPSON ANIGBO\Downloads\change-file-type-main\change-file-type-main\change_file_type\controller\pythonProject\poppler-23.08.0\Library\bin')     
    outputPath = os.path.join('..','change_file_type', 'intermediary',r''+sys.argv[3]+'_'+sys.argv[4])
    os.mkdir(r''+outputPath)
    for image in images:
        image.save( os.path.join(outputPath ,sys.argv[3]+'_'+str(index)+'.jpg'),'JPG')
        index = index + 1

    finalOutputPath = os.path.join('..','change_file_type', 'output',r''+sys.argv[3]+'_'+sys.argv[4])
    shutil.make_archive(finalOutputPath,'zip',outputPath)
    print(200)

except:
     print(400)



 