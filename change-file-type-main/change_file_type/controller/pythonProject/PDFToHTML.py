import mammoth
from pdf2docx import Converter
import sys   

pdf_file = sys.argv[1]
docx_file = sys.argv[2]
cv = Converter(pdf_file)
cv.convert(docx_file)
docx_file = open(r""+docx_file, r"rb")
result = mammoth.convert_to_html(docx_file)
html = result.value # The generated HTML
messages = result.messages # Any messages, such as warnings during conversion
html_file = open(r""+sys.argv[3], "w") 
html_file.write(html)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           


cv.close()


    



