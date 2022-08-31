// Authors: Lukas Decker, Lucas Haupt, Samuel Häseler, David Mertens, Alisa Rüge

import  * as THREE from './three.module.js'
import { Create } from './Create.js'
import { GUI } from './lilgui.js'

/**
 * RotationControls class
 * @brief object to instantiate controls to rotate a mesh.
 */
export class RotationControls{

    /**
     * @brief creates a RotationControls object
     * @param {Create} creator: used to get information on three.js scene
     */
    constructor( creator ){

        this.creator = creator
        this.mouseX = 0
        this.tmpX = 0
        this.name = "rotate"
        this.selected = null

        /**
         * @brief deletes a glb if it's selected via the raycaster and the X-key is pressed
         * @param {keydown} event: triggered if key is pressed
         */
        this.deleteEvent = ( event ) => {

            if( event.key == 'x' ){

                // checks if an object is selected
                if( this.selected ){

                    // three.js light of light glb will be deleted from gui and array
                    if( this.selected.userData.isLight ){

                        this.selected.userData.guiFolder.destroy()

                        this.creator.lightArray.splice( this.creator.lightArray.indexOf( this.selected.parent.children[ this.selected.parent.children.length - 1 ] ), 1 )
                    }

                    // glb is deleted from array and removed from scene
                    this.creator.glbArray.splice( this.creator.glbArray.indexOf( this.selected.parent ), 1 )
                    this.creator.scene.remove( this.selected.parent )

                    this.selected = null
                }
            }
        }

        /**
         * @brief if glb is clicked it will be saved as selected and mouse coordinates will be tracked
         * @param {click} event: triggered when left mouse is clicked
         * @returns 
         */
        this.onClick = ( event ) => {

            const raycaster = new THREE.Raycaster()

            // normalizes mouse coordinates
            this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
            this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1

            this.tmpX = this.mouseX
    
            if( this.selected ){
        
                // de-selects object if it is selected
                this.selected = null
                return
            }
        
            // sets the raycaster element from mouse coordinates and camera
            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            let intersects = raycaster.intersectObjects( this.creator.scene.children )
        
            // at least one intersection and object can be rotated
            if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.rot ) ){
        
                this.selected = intersects[ 0 ].object
            }
        }

        /**
         * @brief rotates glb along the local y-axis
         * @param {mousemove} event: triggered when mouse moves
         */
        this.rotateObject = ( event ) => {

            if( this.selected != null ){
    
                this.mouseX = ( event.screenX - this.tmpX )
        
                // it rotates only horizontally because furniture and lamps can't be mounted to side walls
                this.selected.parent.rotation.y = 10 * this.mouseX / ( window.innerWidth )
            }
        }

        // it was optimized for non glbs for testing
        /**
         * @brief sets the transparency of the material to transparent if mouse hovers over object
         * @param {mousemove} event: triggered when mouse moves
         */
        this.hoverObject = ( event ) => {

            let raycaster = new THREE.Raycaster()

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )

            // puts all children of the scene in array
            const intersects = raycaster.intersectObjects( this.creator.scene.children )
    
            let hovArray = []
    
            // pushes rotation object in hovArray
            for( let i = 0; i < intersects.length; i++ ){
        
                if( intersects[ i ].object.userData.drag ){
    
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
    
                for( let i = 0; i < scene.children.length; i++ ){
        
                    if( this.creator.scene.children[ i ].material ){
            
                        this.creator.scene.children[ i ].material.opacity = 1.0
                    }
                }
            }
        }
    }

    /**
     * @brief activates all EventListeners for RotationControls.
     */
    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.rotateObject )
        window.addEventListener( 'keydown', this.deleteEvent )
        // window.addEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief removes all EventListeners for RotationControls.
     */
    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.rotateObject )
        window.removeEventListener( 'keydown', this.deleteEvent )
        // window.removeEventListener( 'mousemove', this.hoverObject )
    }
}