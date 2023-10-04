import pyttsx3
import pdfplumber,sys,os
from pathlib import Path
from gtts.lang import _fallback_deprecated_lang, tts_langs
from gtts import gTTS

pdf = pdfplumber.open(Path(r''+sys.argv[1]).resolve())
language='en'
textToSpeech =""
pageText = ""
langs = tts_langs()
print(langs)
print( Speed)

for pageNumber in range(len(pdf.pages)):
        page = pdf.pages[pageNumber]
        pageText = pageText + page.extract_text()
textToSpeech = gTTS(text=pageText, lang='fr')

textToSpeech.save(Path(r''+sys.argv[2]).resolve())
pdf.close()
