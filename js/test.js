// standard global variables
var container, scene, camera, renderer, controls, stats;
// custom global variables
var groupofMesh = null;
var meshArray = [];

var cylinderCount = 100;
var arcRadius = 50;
var cylinderRadius = 0.2;
var cylinderHeight = 40;
var sphereRadius = 0.5;

var cylinderColor = "rgb(0, 0, 255)";
// var cylinderColor = new THREE.Color();
var canAnim = false;
init();
animate();
document.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', mouseMove);
});
document.addEventListener('mouseup', function () {
    document.removeEventListener('mousemove', mouseMove);
});
window.addEventListener("wheel", function (e) {
    mouseMove();
}, true);
$('#do-zbs').click(function () {
    canAnim = false;
    clear();
    meshArray = [];
    cylinderCount = Number($('#cylinder-count')[0].value);
    arcRadius = Number($('#round-radius')[0].value);
    cylinderRadius = Number($('#cylinder-radius')[0].value);
    cylinderHeight = Number($('#cylinder-height')[0].value);
    sphereRadius = Number($('#cylinder-round-radius')[0].value);
    cylinderColor = $('#cylinder-color')[0].value;

    drawCylinders();
});

function mouseMove() {
    $('#camera-x')[0].value = camera.position.x;
    $('#camera-y')[0].value = camera.position.y;
    $('#camera-z')[0].value = camera.position.z;
}

// FUNCTIONS
function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 100, 300);
    console.log(camera);
    camera.lookAt(scene.position);
    // RENDERER
    if (Detector.webgl)
        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    else
        renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // renderer.setClearColorHex( 0xffffff, 1 );
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});
    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
    // LIGHT
    // var light = new THREE.PointLight(0xffffff);
    // light.position.set(100, 250, 100);
    // scene.add(light);


    // FLOOR
    // var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
    // floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    // floorTexture.repeat.set(10, 10);
    // var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    // var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.position.y = -0.5;
    // floor.rotation.x = Math.PI / 2;
    // scene.add(floor);
    // // SKYBOX/FOG
    // var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    // var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
    // var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    // skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
    // // scene.add(skyBox);
    // scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);


    groupofMesh = new THREE.Group();
    // var group = new THREE.Group;
    scene.add(groupofMesh);
    drawCylinders();
}

function clear() {
    for (var i = groupofMesh.children.length; i >= 0; i--) {
        groupofMesh.remove(groupofMesh.children[i])
    }
}

function drawCylinders() {

    //2d line of cylinder centers
    // this.path = new THREE.Path();
    // var arcRadius = 50;
    // this.path.moveTo(0, 0);
    // this.path.absarc(0, 0, arcRadius, 2 * Math.PI, 0, false);


    this.path = new THREE.Path();
    this.path.moveTo(0, 0);
    this.path.absarc(0, 0, arcRadius, 0, 0, false);
    // this.path.lineTo(0, 0);


    //draw cylinders
    var mas = [];
    var vertices = this.path.getSpacedPoints(cylinderCount);
    // console.log(vertices);
    var color = new THREE.Color(cylinderColor);
    for (var i = 0; i < vertices.length - 1; i++) {
        // for (var i = 0; i < 1; i++) {
        point = vertices[i];
        var y = 10 + 10 * Math.sin(2 * i * Math.PI / cylinderCount + Math.PI);

        mas[i] = new THREE.Vector3(point.x, y, point.y);

        var cylinderCon = new THREE.Group();
        var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
        var cylinderMaterial = new THREE.MeshBasicMaterial({color: color});
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        // cylinder.position.set(point.x, y, point.y);
        // cylinder.rotation.y = -2*Math.PI/cylinderCount*i;
        // cylinder.rotation.z = Math.PI/cylinderCount*i;

        var sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: color});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        var sphere2 = sphere.clone();
        sphere.position.y = cylinderHeight / 2 - sphereRadius;
        sphere2.position.y = -cylinderHeight / 2 + sphereRadius;

        cylinderCon.add(cylinder);
        cylinderCon.add(sphere);
        cylinderCon.add(sphere2);

        cylinderCon.position.set(point.x, y, point.y);
        cylinderCon.rotation.y = -2 * Math.PI / cylinderCount * i;
        cylinderCon.rotation.z = Math.PI / cylinderCount * i;

        meshArray.push(cylinderCon);

        groupofMesh.add(cylinderCon);
        // scene.add(cylinder);
    }
    canAnim = true;
    // var lineGeometry = new THREE.Geometry();
    // lineGeometry.vertices = mas;
    // var lineMaterial = new THREE.LineBasicMaterial({
    //     color: 0x00ff00});
    // var line = new THREE.Line(lineGeometry, lineMaterial)
    // scene.add(line);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    controls.update();
    stats.update();
    if (canAnim) {
        for (var i = 0; i < cylinderCount; i++) {
            meshArray[i].rotation.z += Math.PI / 180;
        }
    }

}

function render() {
    renderer.render(scene, camera);
}
