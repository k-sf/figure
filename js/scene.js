var width = window.innerWidth;
var height = window.innerHeight;

var wrapper = $(".wrapper");

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.autoClear = false;

wrapper.append(renderer.domElement);

var video = document.createElement('video');
video.autoplay = true;
video.loop = true;
video.muted = true;
video.src = '/media/skyscraper_test.mp4';
video.crossOrigin = '';
video.play();

var videoTexture = new THREE.Texture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;


var scene = new THREE.Scene();
var secondScene = new THREE.Scene();


var radius = 1000;
var sphereGeometry = new THREE.SphereGeometry(radius, 60, 60);
var sphereMat = new THREE.MeshBasicMaterial({map: videoTexture});
sphereMat.side = THREE.BackSide;
var sphere = new THREE.Mesh(sphereGeometry, sphereMat);
scene.add(sphere);

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
camera.position.y = 0;
camera.position.z = 1000;

scene.add(camera);

var controls = new THREE.OrbitControls( camera );
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.enableZoom = false;
controls.enablePan = true;

var axisHelper = new THREE.AxisHelper(1000);
scene.add( axisHelper );


function render() {
    if( video.readyState === video.HAVE_ENOUGH_DATA ){
        videoTexture.needsUpdate = true;
    }
    controls.update();

    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render( secondScene, camera );

    requestAnimationFrame(render);
}

render();

//////////////////////////////////////////////////////////////

wrapper.append('<ul class="list"></ul>');

window.addEventListener('keydown',onDown,false);



var temp = 0;
var num = 0 ;
var lableArray = [];
var pr = 0;

var list = $(".list");
var canvas = $('canvas');

list.on('click',listClick);
list.on('mouseenter',listEnter);
canvas.on('mouseenter',listOut);

function listClick(e){
    var target;
    if(e.target.type==="button"){
        if(e.target.id.substring(0,6)==="change"){
            target = e.target.id.substring(6)-1;
            lableArray[target].changeLable(target);
        }else if(e.target.id.substring(0,3)==="del"){
            target = e.target.id.substring(3)-1;
            lableArray[target].deleteLable(target);
        }else if(e.target.id.substring(0,11)==="switchCoord"){
            target = e.target.id.substring(11)-1;
            lableArray[target].switchCoord(target);
        }
    }
}
function listEnter(){
    if(pr === 0){
        pr=1;
        controls.dispose();
    }
}
function listOut(){
    if(pr===1){
        pr = 0;
        controls = new THREE.OrbitControls( camera);
        controls.enableDamping = true;
        controls.dampingFactor = 1;
        controls.enableZoom = false;
        controls.enablePan = true;
    }
}


function onDown(e){
    if(e.keyCode===17){
        if(temp===0) {
            temp = 1;
            controls.dispose();
            renderer.domElement.addEventListener('click', onClickCtrl, false);
            window.addEventListener('keyup', onUp, false);
        }
    }
    else if(e.keyCode==32){
        if(temp===0){
            temp=1;
            controls.dispose();
            renderer.domElement.addEventListener('click', onClickSpace, false);
            window.addEventListener('keyup', onUp, false);
        }
    }
    else if(e.keyCode==18){
        if(temp===0){
            temp=1;
            controls.dispose();
            renderer.domElement.addEventListener('click', onClickAlt, false);
            window.addEventListener('keyup', onUp, false);
        }
    }

}
function onUp(e){
    if(e.keyCode===17|| e.keyCode===32|| e.keyCode===18){
        temp=0;
        controls = new THREE.OrbitControls( camera);
        controls.enableDamping = true;
        controls.dampingFactor = 1;
        controls.enableZoom = false;
        controls.enablePan = true;
        renderer.domElement.removeEventListener('click',onClickCtrl);
        renderer.domElement.removeEventListener('click',onClickSpace);
        renderer.domElement.removeEventListener('click',onClickAlt);
    }
}

function onClickCtrl(e){


    temp = 0;
    controls = new THREE.OrbitControls( camera);
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.enableZoom = false;
    controls.enablePan = true;
    renderer.domElement.removeEventListener('click',onClickCtrl);



    var br = this.getBoundingClientRect();
    var mouseX = (e.clientX-br.left)/renderer.domElement.offsetWidth*2-1;
    var mouseY = 1-(e.clientY - br.top)/renderer.domElement.offsetHeight*2;
    num++;
    /////////////////////Если ярлык 3д
    //var lable = new Lable3D(mouseX,mouseY,num);
    //scene.add(lable.lableMesh);

    ///////////////////////////усли ярлык спрайтом
    var lable = new SpriteLable(mouseX,mouseY,num);
    secondScene.add(lable.sprite);

    lableArray.push(lable);


}
function onClickSpace(e){
    var br = this.getBoundingClientRect();
    var mouseX = (e.clientX-br.left)/renderer.domElement.offsetWidth*2-1;
    var mouseY = 1-(e.clientY - br.top)/renderer.domElement.offsetHeight*2;
    var vector = new THREE.Vector3(mouseX,mouseY,0).unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(scene, true);
    var v = new THREE.Vector3(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);
    console.log('point');
    console.log(v);
}
function onClickAlt(){
    console.log("нажата кнопка alt");
}

function addTextBreaks(text, width, fontSize) {
    text = text.trim();
    var words = text.toString().split(' '),
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        idx = 1,
        newString = '';
    context.font = fontSize + 'px Arial';
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(' '),
            w = context.measureText(str).width;
        if (w > width) {
            if (idx == 1) {
                idx = 2;
            }
            newString += words.slice(0, idx - 1).join(' ');
            newString += '\n';
            words = words.splice(idx - 1);
            idx = 1;
        }
        else { idx += 1;}
    }
    if (idx > 0) {
        newString += words.join(' ');
    }
    return newString.split('\n');
}


function SpriteLable(mouseX, mouseY, num){
    this.id = num;
    this.width = 512;
    this.lableFontSize = 50;
    this.lineLength = 100;
    var vector = new THREE.Vector3(mouseX,mouseY,0).unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(scene, true);
    this.v = new THREE.Vector3(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);//Вектор точки соприкосновения со сферой

    this.enterLableText();
    this.editLable();
}
SpriteLable.prototype.enterLableText = function(){
    this.text1 = prompt("Введите описание", "");
    if(this.text1.length===0){
        this.text1 = "Метка"+this.id;
    }
    this.rows1 = addTextBreaks(this.text1,this.width-this.lableFontSize,this.lableFontSize);

    this.textWidth = this.width;
    this.textHeight = this.rows1.length*this.lableFontSize+this.lineLength;

};
SpriteLable.prototype.editLable = function (){
    list.append('<li class="item" id="item'+this.id+'">' +
                    '<lable class="title">'+this.text1+'</lable><br>' +
                    '<lable class="coord">Координаты</lable><br>' +
                    '<lable class="coord">x</lable><input type="text" id="coordX'+this.id+'" value ="'+this.v.x+'" ><br>' +
                    '<lable class="coord">y</lable><input type="text" id="coordY'+this.id+'" value ="'+this.v.y+'" ><br>' +
                    '<lable class="coord">z</lable><input type="text" id="coordZ'+this.id+'" value ="'+this.v.z+'" ><br>' +
                    '<input type="button" id="switchCoord'+this.id+'" value="Переместить по координатам"><br>' +
                    '<input type="button" id="change'+this.id+'" value="Редактировать"><br>' +
                    '<input type="button" id="del'+this.id+'" value="Удалить">' +
                '</li>');

    this.dynamicTexture  = new THREEx.DynamicTexture(this.textWidth*2,this.textHeight*2);

    var material = new THREE.SpriteMaterial({map:this.dynamicTexture.texture});

    this.sprite = new THREE.Sprite( material );
    this.sprite.name = "Lable"+this.id;

    this.sprite.position.x = this.v.x;
    this.sprite.position.y = this.v.y;
    this.sprite.position.z = this.v.z;
    this.drawText();
};
SpriteLable.prototype.drawText = function(){
    this.canWidth = this.dynamicTexture.canvas.width;
    this.canheight = this.dynamicTexture.canvas.height;
    this.sprite.scale.set(this.canWidth/2,this.canheight/2,1);

    /////фон спрайта
    //this.dynamicTexture.context.fillStyle = '#0000ff';
    //this.dynamicTexture.context.fillRect(0,0,this.canWidth,this.canheight) ;

    this.dynamicTexture.context.strokeStyle = '#ffffff';
    this.dynamicTexture.context.lineWidth = 7;
    this.dynamicTexture.context.beginPath();
    this.dynamicTexture.context.moveTo(this.canWidth/2,0);
    this.dynamicTexture.context.lineTo(this.canWidth/2,this.canheight/2);
    this.dynamicTexture.context.stroke();
    for (var q=0;q< this.rows1.length;q++){
        this.dynamicTexture.drawText(this.rows1[q], this.canWidth/2+5, this.lableFontSize*q+this.lableFontSize,"white","Bold "+this.lableFontSize+"px Arial");
    }
};
SpriteLable.prototype.changeLable = function (target){
    this.enterLableText();
    target++;
    var lableText = $("#item"+target+">.title");
    var lableCat = $("#item"+target+">.taskDescription");
    console.log(lableText);
    console.log(lableCat);
    lableText[0].innerHTML = this.text1;
    this.dynamicTexture.canvas.width = this.textWidth*2;
    this.dynamicTexture.canvas.height = this.textHeight*2;
    this.dynamicTexture.clear();
    this.drawText();

};
SpriteLable.prototype.deleteLable = function (target){
    target++;
    var selectedObj = secondScene.getObjectByName("Lable"+target);
    secondScene.remove(selectedObj);
    $("#item"+target).remove();
};
SpriteLable.prototype.switchCoord = function (target){
    target++;
    var x = $("#coordX"+target)[0].value;
    var y = $("#coordY"+target)[0].value;
    var z = $("#coordZ"+target)[0].value;
    this.sprite.position.set(x,y,z);
};



///////////////////////////////////////////////////////////////////////
function Lable3D(mouseX, mouseY, num){
    this.id = num;
    this.lableMesh = new THREE.Object3D();
    this.lableMesh.name = "LableMash"+this.id;
    this.width = 256;
    this.lableFontSize = 25;
    this.catFontSize = 18;
    var vector = new THREE.Vector3(mouseX,mouseY,0).unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(scene, true);
    var v = new THREE.Vector3(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);//Вектор точки соприкосновения со сферой
    var v1 = v.clone();//Вектор точки в которую будет стрелка указывать
    var i, j, k;
    i = Math.abs(v1.x)/radius;
    j = Math.abs(v1.y)/radius;
    k = Math.abs(v1.z)/radius;
    var dest = 100;//Расстояние на которое отдалить точку от края сферы
    if(v1.y>-400){
        if(v1.x>0){
            v1.x -= dest*i;
        }else{
            v1.x += dest*i;
        }
        if(v1.z>0){
            v1.z -= dest*k;
        }else{
            v1.z += dest*k;
        }
    }

    var ArrowLength = 200;// Длинна стрелки
    var v2 = v1.clone();//Вектор точки откуда идет стрелка
    v2.y +=ArrowLength;

    var direction2 = v1.clone().sub(v2);
    var arrowHelper2 = new THREE.ArrowHelper(direction2.normalize(), v2, ArrowLength, 0xffffff );
    this.lableMesh.add( arrowHelper2 );


    ///////////////////////////////////////////////
    this.textV = v2.clone();//Вектор текста

    this.enterLableText();
    this.editLable();
    this.addLableWrapper();

    ////////////////Вращение Y
    var oldCamXZ, newCamXZ, angY;
    if(v.x>0){
       oldCamXZ = new THREE.Vector3(v1.x,0,v1.z);
       newCamXZ = new THREE.Vector3(300,0,0);
       angY = newCamXZ.angleTo(oldCamXZ);
        if(v.z>0){
            this.meshWrap.rotateY(-Math.PI/2-angY);
        }else{
            this.meshWrap.rotateY(-Math.PI/2+angY);
        }
    } else{
        oldCamXZ = new THREE.Vector3(v1.x,0,v1.z);
        newCamXZ = new THREE.Vector3(-300,0,0);
        angY = newCamXZ.angleTo(oldCamXZ);

        if(v.z>0){
            this.meshWrap.rotateY(Math.PI/2+angY);
        }else {
            this.meshWrap.rotateY(Math.PI/2-angY);
        }
    }
    /////////Вращение по оси Х

    var oldCamY = new THREE.Vector3(0,200,0);
    var newCamY = new THREE.Vector3(v2.x,v2.y,v2.z);
    var angX = newCamY.angleTo(oldCamY);
    console.log(angX);
    if(v1.y<-700){
        this.meshWrap.rotateX(-angX+Math.PI/2);
        }
    /////////////////////////////
}
Lable3D.prototype.enterLableText = function(){
    this.text1 = prompt("Введите описание", "");
    if(this.text1.length===0){
        this.text1 = "Метка"+this.id;
    }
    this.text2 = prompt("Введите категорию", "");
    if(this.text2.length===0){

        this.text2 = "выставка";
    }
    this.rows1 = addTextBreaks(this.text1,this.width-this.lableFontSize,this.lableFontSize);
    this.rows2 = addTextBreaks(this.text2,this.width-this.lableFontSize,this.catFontSize);

    this.textWidth = this.width;
    this.textHeight = this.rows1.length*this.lableFontSize+this.lableFontSize+this.rows2.length*this.catFontSize;

};
Lable3D.prototype.editLable = function (){
    list.append('<li class="item" id="item'+this.id+'"><lable class="title">'+this.text1+'</lable><br><label class="taskDescription">'+this.text2+'</label><br><input type="button" id="change'+this.id+'" value="Редактировать"><br><input type="button" id="del'+this.id+'" value="Удалить"></li>');
    this.dynamicTexture  = new THREEx.DynamicTexture(this.textWidth*2,this.textHeight*2);
    this.dynamicTexture.texture.needsUpdate  = true;
    this.material    = new THREE.MeshBasicMaterial({map : this.dynamicTexture.texture, transparent : true});
    var textGeometry = new THREE.PlaneGeometry(this.textWidth,this.textHeight);
    this.mesh    = new THREE.Mesh( textGeometry, this.material );
    this.drawText();
};
Lable3D.prototype.addLableWrapper = function(){
    var textWrapperCanvas = document.createElement('canvas');
    textWrapperCanvas.width = this.textWidth*2;
    textWrapperCanvas.height = this.textHeight;
    //
    var wrapperTexture = new THREE.Texture(textWrapperCanvas);
    var wrapperMaterial = new THREE.MeshBasicMaterial({map: wrapperTexture, transparent: true});
    var wrapperGeometry = new THREE.PlaneGeometry(textWrapperCanvas.width, textWrapperCanvas.height);
    console.log(wrapperGeometry);

    this.meshWrap = new THREE.Mesh(wrapperGeometry, wrapperMaterial);

    this.meshWrap.add(this.mesh);
    this.meshWrap.position.set(this.textV.x, this.textV.y-this.textHeight/2, this.textV.z );

    this.mesh.translateX(10);
    this.mesh.translateZ(10);

    this.mesh.position.x += this.textWidth/2;
    this.lableMesh.add(this.meshWrap);
};
Lable3D.prototype.drawText = function(){
    var lableFontSize = this.lableFontSize*2;
    var catFontSize = this.catFontSize*2;
    for (var q=0;q< this.rows1.length;q++){
        this.dynamicTexture.drawText(this.rows1[q], 0, lableFontSize*q+lableFontSize,"white","Bold "+lableFontSize+"px Arial");
    }
    for (var p=0;p< this.rows2.length;p++){
        this.dynamicTexture.drawText(this.rows2[p], 0, lableFontSize*q+lableFontSize+p*catFontSize,"white",catFontSize+"px Arial");
    }
};
Lable3D.prototype.changeLable = function (target){
    this.enterLableText();
    target++;
    var lableText = $("#item"+target+">.title");
    var lableCat = $("#item"+target+">.taskDescription");
    console.log(lableText);
    console.log(lableCat);

    lableText[0].innerHTML = this.text1;
    lableCat[0].innerHTML = this.text2;
    this.mesh.geometry = new THREE.PlaneGeometry(this.textWidth,this.textHeight);
    this.dynamicTexture.canvas.width = this.textWidth*2;
    this.dynamicTexture.canvas.height = this.textHeight*2;
    this.dynamicTexture.clear();
    this.drawText();

    this.meshWrap.position.set(this.textV.x, this.textV.y-this.textHeight/2, this.textV.z );
};
Lable3D.prototype.deleteLable = function (target){
    target++;
    var selectedObj = scene.getObjectByName("LableMash"+target);
    scene.remove(selectedObj);
    $("#item"+target).remove();
};