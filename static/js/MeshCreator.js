
/**
 * MeshCreator class
 * @brief object to create a meshbased object and sets its bounding box.
 */
 export class MeshCreator{

    /**
     * @brief creates a MeshCreator object.
     * @param {*} geo 
     * @param {*} material 
     * @param {String} name 
     * @param {Boolean} draggable 
     * @param {Boolean} rotatable 
     */
    constructor( geo, material, name, draggable, rotatable ){

        this.geo = geo
        this.material = material
        this.name = name
        this.draggable = draggable
    
        this.mesh = new THREE.Mesh( geo, material )
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.mesh.userData.name = name
        this.mesh.userData.drag = draggable
        this.mesh.userData.rot = rotatable
        scene.add( this.mesh )

        const box = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() )
        this.geo.computeBoundingBox()
        box.setFromObject( this.mesh )

        // saving width, height and depth into a Vector3
        let vec = new THREE.Vector3()
        box.getSize( vec )
        this.mesh.position.y = - ( height / 2 ) + ( vec.y / 2 )
    }
}
