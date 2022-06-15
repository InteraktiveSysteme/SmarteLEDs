import json

list = []
for i in range(100):
    list.append(i)
jsonDump = json.dumps(list)
print(type(jsonDump))
loadedList = json.loads(jsonDump)
print(type(loadedList))