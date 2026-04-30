import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespace for word document XML
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            texts = []
            for paragraph in tree.findall('.//w:p', ns):
                p_text = ""
                for run in paragraph.findall('.//w:t', ns):
                    if run.text:
                        p_text += run.text
                if p_text:
                    texts.append(p_text)
            
            return "\n".join(texts)
    except Exception as e:
        return str(e)

docx_path = r'c:\Users\Admin\Downloads\AI in Finance_ High-Value Features Report.docx'
content = extract_text(docx_path)
import sys
sys.stdout.reconfigure(encoding='utf-8')
print(content)
