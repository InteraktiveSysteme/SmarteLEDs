import bpy
import json
import mathutils
import pprint
import os
import math
import random
import sys
import time

load_external_materials = True


inputJson = "./JsonExample5"

if load_external_materials:
    bpy.ops.wm.open_mainfile(filepath="./empty_materials.blend")
    inputJson = inputJson + "Mat.json"
else:
    inputJson = inputJson + "Mat.json"
    


outputPng = "./renders"

vert_res = 720

fhd_override = False


#jsonInput3 = sys.argv[5]

#print(sys.argv[5])

#print(os.getcwd())

#deselect all objects
def deselect_all():
    for ob in bpy.context.selected_objects:
        ob.select_set(False)

#selects all objects
def select_all():
    for ob in bpy.data.objects:
        ob.select_set(True)
        
#deletes all objects
def delete_all():
    for ob in bpy.data.objects:
        bpy.ops.object.delete()

#select object by name
def select(object):
    bpy.data.objects[object].select_set(True)


#deselect object by name    
def deselect(object):
    bpy.data.objects[object].select_set(False)


#convert json to mathutils Matrix
def jsonToMatrixAlt(data):
    #mat = mathutils.Matrix([1,2,1],[1,2,1],[1,2,3])
    return mathutils.Matrix((data[0],data[1],data[2],data[3]))

#convert json to mathutils Matrix
def jsonToMatrix(data):
    #mat = mathutils.Matrix([[1,2,1],[1,2,1],[1,2,3]])
    #print(mat)
    output = mathutils.Matrix([[data[0],data[1],data[2],data[3]],    [data[4],data[5],data[6],data[7]],    [data[8],data[9],data[10],data[11]],    [data[12],data[13],data[14],data[15]]])
    print("output Matrix")
    print(output)
    print("")
    return output


#set transform matrix of specified object by name
def setTransformMatrix(object, matrix, mesh):
    deselect_all
    obj = bpy.data.objects["object"]
    if mesh:
        mesh = obj.data
    
        for vert in mesh.vertices:
            vert.co = matrix * vert.co
    else:
        loc, rot, scale = matrix.decompose()
        obj.location = loc


#transforms three js coordinate system to blender coordinate system
def transformCoordinates(matrix):
    
    loc,rot,sca = matrix.decompose()
    rotMat = mathutils.Matrix.Rotation(math.radians(90),4,'X')
    rotMat3 = mathutils.Matrix.Rotation(math.radians(-90),3,'X')
    print(loc)
    newLoc = loc @ rotMat3
    print(newLoc)
    matrix = mathutils.Matrix.LocRotScale(newLoc,rot,sca)
    print(matrix)
    return matrix @ rotMat

def rotateMatrix(matrix):
    loc,rot,scale = matrix.decompose()
    rotMat = mathutils.Matrix.Rotation(math.radians(-90),4,'X')
    return matrix @ rotMat

#generate Scene based on the imported Json
def generateScene(importedJson):
    keys = importedJson.keys()
    #print(importedJson[keys(1)])
    emptyObject = bpy.ops.object.empty_add(type='PLAIN_AXES', align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))

    for key in keys:
        matrix = jsonToMatrix(importedJson[key]["matrix"]).transposed()
        print(key)
        print("before")
        print(matrix)
        matrixWall = matrix
        #matrix = transformCoordinates(matrix)
        print("after")
        print(matrix)
        loc,rot,sca = matrix.decompose()
        
        if importedJson[key]["objectType"] == "LAMP":
            
            rotMat = mathutils.Matrix.Rotation(math.radians(-90),4,'X')
            matrix = matrix @ rotMat
            
            rot = matrix.decompose()[1]
                        
            print("Lamp matrix")
            print(matrix)
            
            light_data = bpy.data.lights.new(name=key + "data", type = importedJson[key]["type"])
            light_data.energy = 100
            color = importedJson[key]["color"]
            
            light_data.color = (random.random(),random.random(),random.random())
            
            light_data.color = (color["x"],color["y"],color["z"])
            
            h = 2.5
            energy = importedJson[key]["intensity"]
            light_data.energy = 40 * h/2.5
            
            angle = importedJson[key]["angle"]
            if importedJson[key]["type"] == "SPOT":
                light_data.spot_size = angle
            
            light_object = bpy.data.objects.new(name=key, object_data = light_data)
            
            bpy.context.collection.objects.link(light_object)
            
            light_object.rotation_mode = "QUATERNION"
            light_object.rotation_quaternion = rot
            light_object.location = loc
            #light_object.color = [1,0,0]
            print("Lamp added")
        
        if importedJson[key]["objectType"] == "CAMERA":
            deselect_all
            print("Camera Matrix")
            #print(transformCoordinates(matrix) * matrix)

            aspect = importedJson[key]["aspect"]
            res_x = aspect * vert_res
            res_y = vert_res
            
            bpy.context.scene.render.resolution_x = int(res_x)
            bpy.context.scene.render.resolution_y = int(res_y)
            
            camera_data = bpy.data.cameras.new(name=key)
            
            
            #aspect = importedJson[key]["focal_length"]
            camera_data.lens = 13.8
            camera_object = bpy.data.objects.new("Camera", camera_data)
            bpy.context.scene.collection.objects.link(camera_object)

            camera_object.location = loc

            camera_object.rotation_mode="QUATERNION"

            camera_object.rotation_quaternion = rot
            
            bpy.context.scene.camera = camera_object
            
            #camera = bpy.data.cameras[0]
            #print(camera)
            
            #bpy.data.cameras[0].lens_unit = "FOV"
            #bpy.data.cameras[0].angle = math.radians(75)
            
            #print(math.degrees(camera.angle))
            
            #camera.location = loc
            #camera.rotation_mode = "QUATERNION"
            #camera.rotation_quaternion = rot
            
            
            
            
            print("Camera added")
        
        if importedJson[key]["objectType"] == "WALL":
            print("Wall matrix")
            print(matrix)
            deselect_all
            #loc, rot, sca = matrixWall.decompose()
            
            #bpy.ops.mesh.primitive_plane_add(size = 0.5, align="WORLD", location = loc, rotation = rot.to_euler(), scale = sca)
            bpy.ops.mesh.primitive_plane_add(size = 3, align="WORLD")
            
            eulerAngle = rot.to_euler()[0]
            
            #bpy.ops.transform.rotate(value = eulerAngle, center_override = mathutils.Vector((0,0,0)))
            
            #mesh = bpy.context.object.data
            current_name = bpy.context.selected_objects[0].name
            plane = bpy.data.objects[current_name]
            
            plane.parent = bpy.data.objects["Empty"]
            
            mat = bpy.data.materials.new(name = key)
            mat.use_backface_culling = True
            
            if load_external_materials:
                print(bpy.data.materials["WALL"])
                mat = bpy.data.materials["WALL"]

            plane.data.materials.append(mat)
            
            #for vert in mesh.vertices:
            #    vert.co = matrix @ vert.co
            
            #plane.rotation_mode = "QUATERNION"
            #plane.rotation_quaternion = rot
            plane.location = loc;
            
            plane.matrix_world = matrixWall

            #bpy.context.object.location = loc
            
            print("Wall added")
            
        if importedJson[key]["objectType"] == "GLB":
            print("GLB matrix")
            print(matrix)
            deselect_all
            bpy.ops.import_scene.gltf(filepath=importedJson[key]["path"])
            loc,rot,sca = rotateMatrix(matrix).decompose()
            
            current_name = bpy.context.selected_objects[0].name
            
            glb = bpy.data.objects[current_name]
            
            glb.location = loc
            
            glb.rotation_mode = "QUATERNION"
            
            eul = mathutils.Euler(mathutils.Vector((math.radians(90),0,0)),"XYZ")
            
            #quat = eul.to_quaternion()
            
            glb.rotation_quaternion = rot
            
            #glb.rotation_euler = eul
            
            glb.scale = sca
            
            #glb.scale = glb.scale * mathutils.Vector((0.5,0.5,0.5))
            
            #bpy.context.object.location = loc
            print("glb" + key + " added")
            
    #bpy.data.objects["Empty"].rotation_euler = mathutils.Vector((math.radians(90),0,0))

#renders scene to desired file path
def renderScene(filepath):
    print("Objects to render:")
    print(bpy.context.scene.objects.keys())
    
    
    if fhd_override:
        bpy.context.scene.render.resolution_x = 1920 
        bpy.context.scene.render.resolution_y = 1080
        
    bpy.context.scene.cycles.samples = 100
    bpy.context.scene.cycles.use_denoising = True
    
    bpy.data.scenes[0].render.filepath = filepath
    
    bpy.ops.render.render(write_still=True)

    
#with open('json_data.json', 'r') as jsonInput:
#    data = json.loads(json.load(jsonInput))
#    print(data)
#    print(data[0])

#load json from file

with open(inputJson, 'r') as jsonInput2:
    #example=json.load(jsonInput2)
    example = json.loads(json.dumps(json.load(jsonInput2)))
    pprint.pprint(jsonInput2)
    #example = json.loads(jsonInput2)
    pprint.pprint(example)
    #pprint.pprint(example["LAMP"]["matrix"])
    print("Json Loaded")


delete_all()

generateScene(example)

start = time.time()
renderScene(outputPng)
end = time.time()
print(end-start)





#print(type(jsonToMatrix(data)))
#print(jsonToMatrix(data))
#print(type(data))
