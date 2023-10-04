import pandas as pd
import  sys,os
from pathlib import Path
try:
    df = pd.read_csv(Path(r''+sys.argv[1]).resolve())
    writer = pd.ExcelWriter(Path(r''+sys.argv[2]).resolve())
    df.to_excel(writer , index=False)
    writer.close()
    print(200)
except:
    print(400)
