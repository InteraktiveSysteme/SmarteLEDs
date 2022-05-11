import bpy #imports Blender library
from math import radians

bpy.context.scene.render.resolution_x = 1000 #perhaps set resolution in code
bpy.context.scene.render.resolution_y = 1000
bpy.context.scene.cycles.samples = 20

#create cube
bpy.ops.mesh.primitive_cube_add() #adds a cube object
so = bpy.context.active_object


#move object
so.location[0] = 2 #location = {x,y,z}

#rotate object
#so.rotation_euler[0] += radians(45)

#create modifier
mod_subsurf = so.modifiers.new("My Modifier", 'SUBSURF')

mod_subsurf.levels = 3

#smoothing cube
bpy.ops.object.shade_smooth()

#does the same thing as operation above
#mesh = so.data
#for face in mesh.polygons:
#    face.use_smooth = True

#create displacement modifier
mod_displace = so.modifiers.new("My Displacement", 'DISPLACE')

#create the texture
new_tex = bpy.data.textures.new("My Texture", 'DISTORTED_NOISE')

#change the texture settings
new_tex.noise_scale = 0.20

#assign the texture to displacement modifier
mod_displace.texture = new_tex

#create the material (name explicitly tells Python the name of material)
new_mat = bpy.data.materials.new(name="My Material")
so.data.materials.append(new_mat)

new_mat.use_nodes = True
nodes = new_mat.node_tree.nodes

material_output = nodes.get("Material Output")
node_emission = nodes.new(type='ShaderNodeEmission')

node_emission.inputs[0].default_value = ( 0.0, 0.3, 1.0, 1) #color
node_emission.inputs[1].default_value = 50.0 #strength

links = new_mat.node_tree.links
new_link = links.new(node_emission.outputs[0], material_output.inputs[0])

bpy.ops.object.light_add(type='POINT')
light = bpy.context.active_object

light.location[2] = 1

light.data.shadow_soft_size = 1
light.data.energy = 100

bpy.ops.mesh.primitive_plane_add(size=10)

bpy.data.scenes[0].render.filepath = './bpy.png'

bpy.ops.render.render(write_still=True)
