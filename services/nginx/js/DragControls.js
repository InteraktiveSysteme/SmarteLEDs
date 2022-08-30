import  * as THREE from './three.module.js'
import { Create } from './Create.js'
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm'

/**
 * DragControls class
 * @brief object to instantiate controls for dragging.
 */
 export class DragControls{

    /**
     * @brief creates an DragControls object.
     */
    constructor( creator ){

        this.creator = creator
        this.mouseX = 0
        this.mouseY = 0
        this.selected = null
        this.name = "drag"

        this.deleteEvent = ( event ) => {

            if( event.key == 'x' ){

                if( this.selected ){

                    console.log( this.selected.parent )

                    if( this.selected.userData.isLight ){

                        this.selected.userData.guiFolder.destroy()

                        this.creator.lightArray.splice( this.creator.lightArray.indexOf( this.selected.parent.children[ this.selected.parent.children.length - 1 ] ), 1 )
                    }

                    this.creator.glbArray.splice( this.creator.glbArray.indexOf( this.selected.parent ), 1 )
                    this.creator.scene.remove( this.selected.parent )

                    this.selected = null
                }
            }
        }
 
        this.onClick = ( event ) => {

            const raycaster = new THREE.Raycaster()

            if( this.selected ){
        
                this.selected = null
                return
            }
        
            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            let intersects = raycaster.intersectObjects( this.creator.scene.children )
        
        
            if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag ) ){

                // intersects[ 0 ].object.draggable = true
        
                this.selected = intersects[ 0 ].object
            }
        }

        this.onMouseMove = ( event ) => {

            this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1
            this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
        }

        this.dragObject = ( event ) => {

            const raycaster = new THREE.Raycaster()

            if( this.selected != null ){

                raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
                
                const intersections = raycaster.intersectObjects( this.creator.scene.children )
                
                if( intersections.length > 0 ){
        
                    for( let i = 0; i < intersections.length; i++ ){

                        if( intersections[ i ].object.userData.top ){ // for topLight

                            this.selected.parent.position.x = intersections[ i ].point.x
                            this.selected.parent.position.z = intersections[ i ].point.z

                            // this.selected.userData.target.position.x = this.selected.position.x
                            // this.selected.userData.target.position.z = this.selected.position.z
                            // this.selected.userData.target.position.y = - height
                        }
        
                        if( intersections[ i ].object.userData.bottom ){

                            this.selected.parent.position.x = intersections[ i ].point.x
                            this.selected.parent.position.z = intersections[ i ].point.z
                        }
                    }
                }
            }
        }

        this.hoverObject = ( event ) => {

            let raycaster = new THREE.Raycaster()

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            // hopefully only returns the surface level children and not the children of the room group
            const intersects = raycaster.intersectObjects( this.creator.scene.children )
    
            let hovArray = []
    
            for( let i = 0; i < intersects.length; i++ ){
        
                if( intersects[i].object.userData.drag ){
    
                    hovArray.push( intersects[ i ] )
                }
            }
        
            if( hovArray.length > 0 ){
    
                for( let i = 0; i < intersects.length; i++ ){
        
                    intersects[ i ].object.material.transparent = true
    
                    intersects[ i ].object.material.opacity = .5
                }
            }
    
            else{
    
                for( let i = 0; i < this.creator.scene.children.length; i++ ){
        
                    if( this.creator.scene.children[ i ].material ){
            
                        //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
                        this.creator.scene.children[ i ].material.opacity = 1.0
                    }
                }
            }
        }
    }

    /**
     * @brief activates all EventListeners for DragControls.
     */
    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.dragObject )
        window.addEventListener( 'keydown', this.deleteEvent )
        // window.addEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief removes all EventListeners for DragControls.
     */
    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.dragObject )
        window.removeEventListener( 'keydown', this.deleteEvent )
        // window.removeEventListener( 'mousemove', this.hoverObject )
    }
}