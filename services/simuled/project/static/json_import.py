import bpy
import json
import mathutils
import pprint
import os
import math
import random
import sys
import time
import pathlib
import datetime

load_external_materials = True

resourceDir = os.getcwd() + "/project/static/"

if load_external_materials:
    blendpath = pathlib.Path(resourceDir + "empty_materials.blend")
    bpy.ops.wm.open_mainfile(filepath=str(blendpath))

# pop arguments until after python argument border ( "--" sign)
while True:
    arg = sys.argv.pop(0)
    if arg == "--":
        break

inputJson = sys.argv[0]

#print("JS Bond zur Stelle: ")
#print(inputJson)


outputPng = str(pathlib.Path(resourceDir + "renders")) + "/" + sys.argv[1]


vert_res = 720

fhd_override = False

##
# @brief deselect all objects
def deselect_all():
    for ob in bpy.context.selected_objects:
        ob.select_set(False)

##
# @brief selects all objects
def select_all():
    for ob in bpy.data.objects:
        ob.select_set(True)

##        
# @brief deletes all objects
def delete_all():
    for ob in bpy.data.objects:
        bpy.ops.object.delete()

##
# @brief select object by name
def select(object):
    bpy.data.objects[object].select_set(True)

##
# @briefdeselect object by name    
def deselect(object):
    bpy.data.objects[object].select_set(False)

##
# @brief convert json to mathutils Matrix
def jsonToMatrix(data):
    output = mathutils.Matrix([[data[0],data[1],data[2],data[3]],    [data[4],data[5],data[6],data[7]],    [data[8],data[9],data[10],data[11]],    [data[12],data[13],data[14],data[15]]])
    return output

##
# @brief rotates a matrix 90 degrees around the x axis
# @param matrix to rotate
def rotateMatrix(matrix):
    loc,rot,scale = matrix.decompose()
    rotMat = mathutils.Matrix.Rotation(math.radians(-90),4,'X')
    return matrix @ rotMat

##
# @brief generate Scene based on the importedJson
# @param dictionary importedJson: json file that already got imported as a python dictionary.
def generateScene(importedJson):
    keys = importedJson.keys()

    emptyObject = bpy.ops.object.empty_add(type='PLAIN_AXES', align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))

    for key in keys:
        matrix = jsonToMatrix(importedJson[key]["matrix"]).transposed()

        loc,rot,sca = matrix.decompose()
        
        if importedJson[key]["objectType"] == "LAMP":
            
            rotMat = mathutils.Matrix.Rotation(math.radians(-90),4,'X')
            matrix = matrix @ rotMat
            
            rot = matrix.decompose()[1]
            
            light_data = bpy.data.lights.new(name=key + "data", type = importedJson[key]["type"])
            color = importedJson[key]["color"]
            
            light_data.color = (random.random(),random.random(),random.random())
            
            light_data.color = (color["x"],color["y"],color["z"])
            
            energy = importedJson[key]["intensity"]
            light_data.energy = 200 * energy
            
            angle = importedJson[key]["angle"]
            if importedJson[key]["type"] == "SPOT":
                light_data.spot_size = angle
            
            light_object = bpy.data.objects.new(name=key, object_data = light_data)
            
            bpy.context.collection.objects.link(light_object)
            
            light_object.rotation_mode = "QUATERNION"
            light_object.rotation_quaternion = rot
            light_object.location = loc

            print("Lamp added")
        
        if importedJson[key]["objectType"] == "CAMERA":
            deselect_all

            aspect = importedJson[key]["aspect"]
            res_x = aspect * vert_res
            res_y = vert_res
            
            bpy.context.scene.render.resolution_x = int(res_x)
            bpy.context.scene.render.resolution_y = int(res_y)
            
            camera_data = bpy.data.cameras.new(name=key)
            
            camera_data.lens = 13.8
            
            camera_object = bpy.data.objects.new("Camera", camera_data)
            
            bpy.context.scene.collection.objects.link(camera_object)

            camera_object.location = loc

            camera_object.rotation_mode="QUATERNION"

            camera_object.rotation_quaternion = rot
            
            bpy.context.scene.camera = camera_object
            
            print("Camera added")
        
        if importedJson[key]["objectType"] == "WALL":
            deselect_all

            bpy.ops.mesh.primitive_plane_add(size = 1, align="WORLD")
            
            current_name = bpy.context.selected_objects[0].name
            plane = bpy.data.objects[current_name]
            
            plane.parent = bpy.data.objects["Empty"]
            
            mat = bpy.data.materials.new(name = key)
            mat.use_backface_culling = True
            
            if load_external_materials:
                mat = bpy.data.materials["WALL"]

            plane.data.materials.append(mat)
            
            plane.location = loc
            
            plane.scale = sca
            
            plane.matrix_world = matrix
            
            print("Wall added")
            
        if importedJson[key]["objectType"] == "GLB":
            deselect_all
            
            bpy.ops.import_scene.gltf(filepath=str(resourceDir) + "/" + importedJson[key]["path"])
            
            loc,rot,sca = rotateMatrix(matrix).decompose()
            
            current_name = bpy.context.selected_objects[0].name
            
            glb = bpy.data.objects[current_name]
            
            glb.location = loc
            
            glb.rotation_mode = "QUATERNION"
            
            glb.rotation_quaternion = rot

            glb.scale = sca
            
            
            print("glb" + key + " added")
            
##
# @brief renders scene to desired file path
# @param filepath as string
def renderScene(filepath):
    print("Objects to render:")
    print(bpy.context.scene.objects.keys())
    
    
    if fhd_override:
        bpy.context.scene.render.resolution_x = 1920 
        bpy.context.scene.render.resolution_y = 1080
        
    bpy.context.scene.cycles.samples = 20
    bpy.context.scene.cycles.use_denoising = True
    
    bpy.data.scenes[0].render.filepath = str(filepath)
    
    bpy.ops.render.render(write_still=True)

    
# load json from string
# reverse replacement of escaped double quotes ( | to " ) escaping necessary due to call over unix shell
jsonData = json.loads(inputJson.replace("|", '"'))


delete_all()
generateScene(jsonData)

start = time.time()
renderScene(outputPng)
end = time.time()
print(end-start)

# write blenderlog.txt
f = open(resourceDir + "blenderlog.txt", "a")
f.write("startlog " + str(datetime.datetime.now()) + "\n")
f.write(str(outputPng) + "\n")
f.write(str(end-start) + "\n")
f.write("\n")
f.close()
