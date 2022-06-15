#!/usr/bin/python
import markdown
import re
from collections import namedtuple

specs = namedtuple('Specs', ['price', 'postage', 'dimensions'])

def process(line):
    sp = specs('','','')
    if re.search('^{price}', line):
        sp._replace(price=line.replace("{price}", ""))
        print(line.replace("{price}", ""))
        return ""
    elif re.search('^{postage}', line):
        sp._replace(postage=line.replace("{postage}", ""))
        print(line.replace("{postage}", ""))
        return ""
    elif re.search('^{dimensions}', line):
        sp._replace(dimensions=line.replace("{dimensions}", ""))
        print(line.replace("{dimensions}", ""))
        return ""
    else:
        line = markdown.markdown(line)
        return line

with open('static/lamps/lamp01.md', 'r') as file:
    lines = file.read().split("\n")

lineno = 1
result = ""
for line in lines:
    result = result + "\n" + process(line)
    #print(lineno, " ", line)
    lineno += 1

print(result)