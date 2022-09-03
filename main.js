let THREECAMERA = null;


// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
    if (isDetected) {
        console.log('INFO in detect_callback(): DETECTED');
    } else {
        console.log('INFO in detect_callback(): LOST');
    }
}


// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
    const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

    // CREATE A CUBE
    const cubeGeometry = new THREE.BoxGeometry(1,1,1);
    const cubeMaterial = new THREE.MeshNormalMaterial();
    const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled = false;
    //threeStuffs.faceObject.add(threeCube);

    // GLB MODEL
    const loader = new THREE.GLTFLoader();
    loader.load(
        // resource URL
        './glb/source/Allosaurus.glb',
        // called when the resource is loaded
        function ( gltf ) {
            threeStuffs.faceObject.add(gltf);
            console.log("DONE");
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error glb happened' );
        }
    );

    //CREATE THE CAMERA
    THREECAMERA = JeelizThreeHelper.create_camera();
}


// entry point:
function main(){
    JeelizResizer.size_canvas({
        canvasId: 'jeeFaceFilterCanvas',
        callback: function(isError, bestVideoSettings){
            init_faceFilter(bestVideoSettings);
        }
    })
}


function init_faceFilter(videoSettings){
    JEELIZFACEFILTER.init({
        followZRot: true,
        canvasId: 'jeeFaceFilterCanvas',
        NNCPath: './NN_DEFAULT.json', // root of NN_DEFAULT.json file
        maxFacesDetected: 1,
        callbackReady: function(errCode, spec) {
            if (errCode){
                console.log('AN ERROR HAPPENS. ERR =', errCode);
                return;
            }

            console.log('INFO: JEELIZFACEFILTER IS READY');
            init_threeScene(spec);
        },

        // called at each render iteration (drawing loop):
        callbackTrack: function(detectState){
            JeelizThreeHelper.render(detectState, THREECAMERA);
        }
    }); //end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);