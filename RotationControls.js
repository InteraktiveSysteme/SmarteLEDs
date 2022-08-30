import  * as THREE from './three.module.js'
import { Create } from './Create.js'
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm'

/**
 * RotationControls class
 * @brief object to instantiate controls to rotate a mesh.
 */
export class RotationControls{

    /**
     * @brief creates a RotationControls object.
     */
    constructor( creator ){

        this.creator = creator
        this.mouseX = 0
        this.tmpX = 0
        this.name = "rotate"
        this.selected = null

        this.deleteEvent = ( event ) => {

            if( event.key == 'x' ){

                if( this.selected ){

                    if( this.selected.userData.isLight ){

                        this.selected.userData.guiFolder.destroy()

                        this.creator.lightArray.splice( this.creator.lightArray.indexOf( this.selected.parent.children[ this.selected.parent.children.length - 1 ] ), 1 )
                    }

                    this.creator.glbArray.splice( this.creator.glbArray.indexOf( this.selected.parent ), 1 )
                    this.creator.scene.remove( this.selected.parent )
                }
            }
        }

        this.onClick = ( event ) => {

            const raycaster = new THREE.Raycaster()

            // this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1

            this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
            this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1

            this.tmpX = this.mouseX
    
            if( this.selected ){
        
                this.selected = null
                return
            }
        
            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            let intersects = raycaster.intersectObjects( this.creator.scene.children )
        
        
            if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.rot ) ){
    
                intersects[ 0 ].object.rotatable = true
        
                this.selected = intersects[ 0 ].object
                console.log( this.selected.userData.name )
            }
        }

        // this.onMouseMove = ( event ) => {
        
        //     this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1
        //     this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
        // }

        this.rotateObject = ( event ) => {

            if( this.selected != null ){
    
                this.mouseX = ( event.screenX - this.tmpX )
        
                this.selected.parent.rotation.y = 10 * this.mouseX / ( window.innerWidth )
            }
        }

        this.hoverObject = ( event ) => {

            let raycaster = new THREE.Raycaster()

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            // hopefully only returns the surface level children and not the children of the room group
            const intersects = raycaster.intersectObjects( this.creator.scene.children )
    
            let hovArray = []
    
            for( let i = 0; i < intersects.length; i++ ){
        
                if( intersects[ i ].object.userData.drag ){
    
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
    
    // /**
    //  * @brief uses raycasting to select an object for rotation.
    //  * @param {click} event 
    //  * @returns 
    //  */
    // onClick( event ){

    //     const raycaster = new THREE.Raycaster()

    //     this.tmpX = this.mouseX

    //     if( this.selected ){
    
    //         this.selected = null
    //         return
    //     }
    
    //     raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
    //     let intersects = raycaster.intersectObjects( scene.children )
    
    
    //     if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.rot ) ){

    //         intersects[ 0 ].object.rotatable = true
    
    //         this.selected = intersects[ 0 ].object
    //         console.log( this.selected.userData.name )
    //     }
    // }
    
    // /**
    //  * @brief updates the x- and y-coordinates of the mouse.
    //  * @param {mousemove} event 
    //  */
    // onMouseMove( event ){

    //     const sizes = {
    //         width: .95 * window.innerWidth,
    //         height: window.innerHeight
    //     }
    
    //     this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
    //     this.mouseY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1
    // }

    // /**
    //  * @brief if an object is selected, it can be rotated with moving the mouse in a horizontal motion.
    //  * @param {mousemove} event 
    //  */
    // rotateObject( event ){

    //     if( this.selected != null ){
    
    //         this.mouseX = ( event.screenX - tmpX )
    
    //         this.selected.rotation.y = this.mouseX / ( window.innerWidth / 10 )

    //         if( this.selected.userData.child != null ){

    //             this.selected.userData.child.rotation.x = this.mouseX / ( window.innerWidth / 10 )
    //         }
    //     }
    // }

    // /**
    //  * @brief hovering over an object with the cursor turns the object translucent.
    //  * @param {mousemove} event 
    //  */
    // hoverObject( event ){

    //     let raycaster = new THREE.Raycaster()

    //     raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
    //     // hopefully only returns the surface level children and not the children of the room group
    //     const intersects = raycaster.intersectObjects( scene.children )

    //     let hovArray = []

    //     for( let i = 0; i < intersects.length; i++ ){
    
    //         if( intersects[i].object.userData.drag ){

    //             hovArray.push( intersects[ i ] )
    //         }
    //     }
    
    //     if( hovArray.length > 0 ){

    //         for( let i = 0; i < intersects.length; i++ ){
    
    //             intersects[ i ].object.material.transparent = true
    //             intersects[ i ].object.material.opacity = .5
    //         }
    //     }

    //     else{

    //         for( let i = 0; i < scene.children.length; i++ ){
    
    //             if( scene.children[ i ].material ){
        
    //                 //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
    //                 scene.children[ i ].material.opacity = 1.0
    //             }
    //         }
    //     }
    // }
}