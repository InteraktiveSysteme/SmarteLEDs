import  * as THREE from './three.module.js'
import { Create } from './Create.js'
import { GUI } from './lilgui.js'

/**
 * @brief controls for dragging
 */
 export class DragControls{

    /**
     * @brief creates an DragControls object
     * @param {Create} creator
     */
    constructor( creator ){

        this.creator = creator
        this.mouseX = 0
        this.mouseY = 0
        this.selected = null
        this.name = "drag"

        /**
         * @brief deletes a glb if it's selected via the raycaster and the X-key is pressed
         * @param {keydown} event 
         */
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
 
        /**
         * @brief if glb is clicked it will be saved as selected and mouse coordinates will be tracked
         * @param {click} event 
         * @returns 
         */
        this.onClick = ( event ) => {

            const raycaster = new THREE.Raycaster()

            if( this.selected ){
        
                this.selected = null
                this.selected.material.opacity = 1.0
                return
            }
        
            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            let intersects = raycaster.intersectObjects( this.creator.scene.children )
        
        
            if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag ) ){
        
                this.selected = intersects[ 0 ].object
            }
        }

        /**
         * @brief updates mouse-coordinates
         * @param {mousemove} event 
         */
        this.onMouseMove = ( event ) => {

            this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1
            this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
        }

        /**
         * @brief selected glb is placed at mouse position via raycaster
         * @param {mousemove} event 
         */
        this.dragObject = ( event ) => {

            const raycaster = new THREE.Raycaster()

            if( this.selected != null ){

                raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
                
                // returns intersections with the planes of the room
                const intersections = raycaster.intersectObjects( this.creator.scene.children )
                
                if( intersections.length > 0 ){
        
                    for( let i = 0; i < intersections.length; i++ ){

                        // if-case for ceiling light glb
                        if( intersections[ i ].object.userData.top ){

                            // position of the glb root element is update to mouse intersection with plane
                            // only x-z-coordinates: no floating objects
                            // this way glbs can't be positioned outside of the room boundaries
                            this.selected.parent.position.x = intersections[ i ].point.x
                            this.selected.parent.position.z = intersections[ i ].point.z
                        }
        
                        if( intersections[ i ].object.userData.bottom ){

                            // same procedure for furniture and Standing lamp glbs
                            this.selected.parent.position.x = intersections[ i ].point.x
                            this.selected.parent.position.z = intersections[ i ].point.z
                        }
                    }
                }
            }
        }
        
        // it was optimized for non glbs for testing
        /**
         * @brief sets the transparency of the material to transparent if mouse hovers over object
         * @param {mousemove} event 
         */
        this.hoverObject = ( event ) => {

            let raycaster = new THREE.Raycaster()

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )

            // puts all children of the scene in array
            const intersects = raycaster.intersectObjects( this.creator.scene.children )
    
            let hovArray = []
    
            // pushes draggable object into hovArray
            for( let i = 0; i < intersects.length; i++ ){
        
                if( intersects[i].object.userData.drag ){
    
                    hovArray.push( intersects[ i ] )
                }
            }

            // array with hovered objects is being traversed and opacity turned to .5
            if( hovArray.length > 0 ){
    
                for( let i = 0; i < intersects.length; i++ ){
        
                    intersects[ i ].object.material.transparent = true
    
                    intersects[ i ].object.material.opacity = .5
                }
            }
    
            // other objects opacity is turned to normal
            else{
    
                for( let i = 0; i < this.creator.scene.children.length; i++ ){
        
                    if( this.creator.scene.children[ i ].material ){
            
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