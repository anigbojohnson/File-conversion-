import pandas as pd
import pdfkit, sys,os
from pathlib import Path

try:
    df = pd.read_csv(Path(r''+sys.argv[1]).resolve())

    df.to_html(os.path.abspath(r''+sys.argv[2]))  
    
    pdfkit.from_file(os.path.abspath(r''+sys.argv[2]), r''+sys.argv[3])
    print(200)
except:
    print(400)











