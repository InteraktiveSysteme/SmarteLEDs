import  * as THREE from './three.module.js'
import { Create } from './Create.js'

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
        this.draggable = new THREE.Object3D()
        this.name = "drag"
 
        this.onClick = ( event ) => {

            const raycaster = new THREE.Raycaster()

            if( this.draggable ){
        
                this.draggable = null
                return
            }
        
            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            let intersects = raycaster.intersectObjects( this.creator.scene.children )
        
        
            if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag ) ){

                intersects[ 0 ].object.draggable = true
        
                this.draggable = intersects[ 0 ].object
                console.log( this.draggable.userData.name )
            }
        }

        this.onMouseMove = ( event ) => {

            this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1
            this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
        }

        this.dragObject = ( event ) => {

            const raycaster = new THREE.Raycaster()
        
            console.log( this.draggable )

            if( this.draggable != null ){

                raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
                
                const intersections = raycaster.intersectObjects( this.creator.scene.children )
                
                if( intersections.length > 0 ){
        
                    for( let i = 0; i < intersections.length; i++ ){

                        if( intersections[ i ].object.userData.top ){ // for topLight

                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.z = intersections[ i ].point.z

                            // this.draggable.userData.target.position.x = this.draggable.position.x
                            // this.draggable.userData.target.position.z = this.draggable.position.z
                            // this.draggable.userData.target.position.y = - height
                        }
        
                        if( intersections[ i ].object.userData.bottom ){

                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.z = intersections[ i ].point.z
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
        // window.addEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief removes all EventListeners for DragControls.
     */
    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.dragObject )
        // window.removeEventListener( 'mousemove', this.hoverObject )
    }

    // /**
    //  * @brief selects an object via raycasting and writes it in this.draggable.
    //  * @param {click} event 
    //  * @returns 
    //  */
    // onClick( event ){

    //     const raycaster = new THREE.Raycaster()

    //     if( this.draggable ){
    
    //         this.draggable = null
    //         return
    //     }
    
    //     raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
    //     let intersects = raycaster.intersectObjects( this.creator.scene.children )
    
    
    //     if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag )){
    //         intersects[ 0 ].object.draggable = true
    
    //         this.draggable = intersects[ 0 ].object
    //         console.log( this.draggable.userData.name )
    //     }
    // }
    
    // /**
    //  * @brief the x- and y-coordinates for the mouse are written  into this.mouseX and this.mouseY.
    //  * @param {mousemove} event
    //  */
    // onMouseMove( event ){
    
    //     this.mouseX = ( ( event.clientX - this.creator.canvas.getBoundingClientRect().left ) / this.creator.sizes.width ) * 2 - 1
    //     this.mouseY = - ( ( event.clientY - this.creator.canvas.getBoundingClientRect().top ) / this.creator.sizes.height ) * 2 + 1
    // }

    // only functions when called in an event

    // /**
    //  * @brief uses raycasting place selected object while the mouse moves.
    //  * @param {mousemove} event 
    //  */
    // dragObject( event ){
    
    //     const raycaster = new THREE.Raycaster()
        
    //     if( this.draggable != null ){

    //         raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
            
    //         const intersections = raycaster.intersectObjects( this.creator.scene.children )
            
    //         if( intersections.length > 0 ){
    
    //             for( let i = 0; i < intersections.length; i++ ){

    //                 if( intersections[ i ].object.userData.top ){ // for topLight

    //                     this.draggable.position.x = intersections[ i ].point.x
    //                     this.draggable.position.z = intersections[ i ].point.z

    //                     // this.draggable.userData.target.position.x = this.draggable.position.x
    //                     // this.draggable.userData.target.position.z = this.draggable.position.z
    //                     // this.draggable.userData.target.position.y = - height
    //                 }
    
    //                 if( intersections[ i ].object.userData.bottom ){

    //                     this.draggable.position.x = intersections[ i ].point.x
    //                     this.draggable.position.z = intersections[ i ].point.z
    //                 }
    //             }
    //         }
    //     }
    // }

    // /**
    //  * @brief hovering over an object with the cursor turns the object translucent.
    //  * @param {mousemove} event 
    //  */
    // hoverObject( event ){

    //     let raycaster = new THREE.Raycaster()

    //     raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), this.creator.camera )
    //     // hopefully only returns the surface level children and not the children of the room group
    //     const intersects = raycaster.intersectObjects( this.creator.scene.children )

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

    //         for( let i = 0; i < this.creator.scene.children.length; i++ ){
    
    //             if( this.creator.scene.children[ i ].material ){
        
    //                 //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
    //                 this.creator.scene.children[ i ].material.opacity = 1.0
    //             }
    //         }
    //     }
    // }
}