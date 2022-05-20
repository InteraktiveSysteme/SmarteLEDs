#!/usr/bin/python
import markdown
import re
from collections import namedtuple

def process(textarray):
    props = []
    vals = []
    for i in range(0, len(textarray)):
        #print("Durchlauf ", i)
        match = re.findall("^{.*}", textarray[i])
        match2 = re.split("^{.*}", textarray[i])

        if len(match) > 0:
            props.append(match[0])
            vals.append(match2[1].removeprefix(" "))
            textarray[i] = ""


    textarray = markdown.markdown("\n".join(str(x) for x in textarray))
    return textarray, props, vals

with open('static/lamps/lamp01.md', 'r') as file:
    lines = file.read().split("\n")

props = []
vals = []
textarray, props, vals = process(lines)

print(textarray)
for i in range(0, len(props)):
    print(props[i], ":", vals[i])