import * as THREE from './three_module.js'
import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3
} from './three_module.js';

const _plane = new THREE.Plane();
const _raycaster = new THREE.Raycaster();

const _pointer = new THREE.Vector2();
const _offset = new THREE.Vector3();
const _intersection = new THREE.Vector3();
const _worldPosition = new THREE.Vector3();
const _inverseMatrix = new THREE.Matrix4();

class DragControls extends THREE.EventDispatcher {

	constructor( _objects, _camera, _domElement ) {

		super();
		console.log("Init DragControls")
		_domElement.style.touchAction = 'none'; // disable touch scroll

		let _selected = null, _hovered = null;

		const Mode = { MOVE: 'MOVE', ROTATE: 'ROTATE' };
		let _mode = Mode.MOVE
		let _mouseX = 0
		let _selectedX = 0
		let _selectedZ = 0

		const _intersections = [];

		//

		const scope = this;

		function activate() {

			/* Abonnieren von eigenen Funktionen von DragControls an Events */
			/* pointermove ist wahrscheinlich das Event, das Du suchst */
			_domElement.addEventListener('pointermove', onPointerMove);
			_domElement.addEventListener('pointerdown', onPointerDown);
			_domElement.addEventListener('pointerup', onPointerCancel);
			_domElement.addEventListener('pointerleave', onPointerCancel);
			document.addEventListener('keydown', onKeyPress);
		}

		function deactivate() {

			_domElement.removeEventListener( 'pointermove', onPointerMove );
			_domElement.removeEventListener( 'pointerdown', onPointerDown );
			_domElement.removeEventListener( 'pointerup', onPointerCancel );
			_domElement.removeEventListener( 'pointerleave', onPointerCancel );
			document.removeEventListener('keydown', onKeyPress);

			_domElement.style.cursor = '';

		}

		function dispose() {

			deactivate();

		}

		function getObjects() {

			return _objects;

		}

		function getRaycaster() {

			return _raycaster;

		}

		function onKeyPress(event) {
				if (event.key === "w") {
					console.log("State: Move");
					_mode = Mode.MOVE;
					document.dispatchEvent('derhasespringt')
				} else if (event.key === "e") {
					console.log("State: Rotate")
					_mode = Mode.ROTATE;
				}
		}

		/* Hier findet abhaengig vom modus (Rotation, Verschiebung) die gewaehlte Aktion statt */
		/* die Funktion onKeyPress (oben drueber) bestimmt den Modus abhaengig von Tastatureingabe */
		function onPointerMove( event ) {

			if ( scope.enabled === false ) return;

			updatePointer( event );

			_raycaster.setFromCamera( _pointer, _camera );

			if ( _selected ) {

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					if (_mode == Mode.MOVE) {
						_selected.position.copy(_intersection.sub( _offset ).applyMatrix4( _inverseMatrix ));
					} else {
						//_selected.rotateOnAxis((1, 0, 0), 0.4);
						console.log("DragRot")
						let mouseX_new = (event.screenX - _mouseX)
						
						_selected.position.x = _selectedX * Math.cos( ( 3 * mouseX_new ) / window.innerWidth) - _selectedZ * Math.sin( (3 * mouseX_new) / window.innerWidth );
						_selected.position.z = _selectedX * Math.sin( ( 3 * mouseX_new ) / window.innerWidth)  + _selectedZ * Math.cos( (3 * mouseX_new) / window.innerWidth );
						//_selected.

					}


				}

				scope.dispatchEvent( { type: 'drag', object: _selected } );

				return;

			}

			// hover support

			if ( event.pointerType === 'mouse' || event.pointerType === 'pen' ) {

				_intersections.length = 0;

				_raycaster.setFromCamera( _pointer, _camera );
				_raycaster.intersectObjects( _objects, true, _intersections );

				if ( _intersections.length > 0 ) {

					const object = _intersections[ 0 ].object;

					_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

					if ( _hovered !== object && _hovered !== null ) {

						scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

						_domElement.style.cursor = 'auto';
						_hovered = null;

					}

					if ( _hovered !== object ) {

						scope.dispatchEvent( { type: 'hoveron', object: object } );

						_domElement.style.cursor = 'pointer';
						_hovered = object;

					}

				} else {

					if ( _hovered !== null ) {

						scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

						_domElement.style.cursor = 'auto';
						_hovered = null;

					}

				}

			}

		}

		function onPointerDown( event ) {

			if ( scope.enabled === false ) return;

			updatePointer( event );

			_intersections.length = 0;

			_raycaster.setFromCamera( _pointer, _camera );
			_raycaster.intersectObjects( _objects, true, _intersections );

			if ( _intersections.length > 0 ) {

				_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

				_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
					_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );
					//console.log(_intersection)
					
					_mouseX = event.screenX
					_selectedX = _selected.position.x
					_selectedZ = _selected.position.z
					
				}
				
				

				_domElement.style.cursor = 'move';

				scope.dispatchEvent( { type: 'dragstart', object: _selected } );

			}


		}

		function onPointerCancel() {

			if ( scope.enabled === false ) return;

			if ( _selected ) {

				scope.dispatchEvent( { type: 'dragend', object: _selected } );

				_selected = null;

			}

			_domElement.style.cursor = _hovered ? 'pointer' : 'auto';

		}

		function updatePointer( event ) {

			const rect = _domElement.getBoundingClientRect();

			_pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;
			_pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;

		}

		activate();

		// API

		this.enabled = true;
		this.transformGroup = false;

		this.activate = activate;
		this.deactivate = deactivate;
		this.dispose = dispose;
		this.getObjects = getObjects;
		this.getRaycaster = getRaycaster;

	}

}

export { DragControls };
