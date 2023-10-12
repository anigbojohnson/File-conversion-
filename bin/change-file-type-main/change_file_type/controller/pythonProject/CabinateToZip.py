import sys, shutil 
import os,json,time,zipfile
from pathlib import Path
from cabarchive import CabArchive
try:
    listOfZipPath = json.loads(sys.argv[1])
    for key, value in listOfZipPath.items():
        generatedFileName =str(int(time.time() * 1000))
        outputZipFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
        uploadedCabinetFile = os.path.abspath(os.path.join(os.getcwd(), value))
        os.makedirs(r''+  outputZipFile  )
        folder_structure = {}
        with open(  uploadedCabinetFile ,"rb") as f:
            arc = CabArchive(f.read())  

            print(arc)

            for filename in arc:
                outputZipFile = os.path.abspath(os.path.join(os.getcwd(), 'intermediary',generatedFileName))
                extracted_item = arc[filename]
            
            # is_folder = "\\" in filename
                directory, file = os.path.split( filename)
                full_path = r''+ os.path.abspath(os.path.join(outputZipFile , directory))
                if not os.path.exists(full_path ):
                    os.mkdir(full_path)
                if os.path.exists(full_path ):
                    full_path= r''+os.path.join(full_path , file)
                    print(full_path)
                    with open(str(full_path), 'wb') as zip_ref:
                        zip_ref.write(extracted_item.buf)

        shutil.make_archive(os.path.join(os.getcwd(), 'output',r''+key+'_'+generatedFileName),'zip', os.path.abspath(r''+ outputZipFile ))
        shutil.rmtree( outputZipFile)
        print(generatedFileName)
        Path(r''+ value).unlink()
    print(200)
except:
    print(400)



