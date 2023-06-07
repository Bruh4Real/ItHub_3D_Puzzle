const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var loader = new THREE.TextureLoader();
var textures = [];
for (var i = 1; i <= 16; i++) {
    let paddedNumber = String(i).padStart(3, '0');
    textures.push(loader.load('github/image_part_' + paddedNumber + '.jpg'));
    textures.rotatio
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const materials = [];
for (var i = 0; i < 16; i++) {
  materials[i] = [
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
    new THREE.MeshBasicMaterial({ map: textures[i] }),
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
  ];
}

const cubes = [];
const initialAngles = [];
var h = 0;

var initialPositions = [];
var initialPositions2 = [];

for (var i = 4; i > 0; i--) {
    for (var j = 0; j < 4; j++) {
        var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials[h]);
        cube.position.x = (j-1.5) * 1.2;
        cube.position.y = (i-2.5) * 1.2;
        cubes.push(cube);
        scene.add(cube);
        const initialangle = { y: cube.rotation.y };
        initialAngles.push(initialangle);
        initialPositions.push({x: cube.position.x, y: cube.position.y, z: 0.3});
        initialPositions2.push({x: cube.position.x, y: cube.position.y, z: 0});
        h++;
    }
}

console.log(initialPositions)

const cubess = [];

function povorot() {
  document.getElementById("button").style.display = "none";
  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("img").style.display = "block";

  for (var i = 0; i < 16; i++){
    var posX = Math.floor(Math.random() * 4) - 1;
    var posY = Math.floor(Math.random() * 4) - 1;
    var pos = new THREE.Vector3((posX - 0.5) * 1.2, (posY - 0.5) * 1.2, cubes[i].position.z);
    
    while (cubess.some(c => c.position.equals(pos))) {
      posX = Math.floor(Math.random() * 4) - 1;
      posY = Math.floor(Math.random() * 4) - 1;
      pos = new THREE.Vector3((posX - 0.5) * 1.2, (posY - 0.5) * 1.2, cubes[i].position.z);
    }
    
    cubes[i].position.copy(pos);

    var angleX = Math.floor(Math.random() * 3);
    var angleY = Math.floor(Math.random() * 3);
    var angleZ = Math.floor(Math.random() * 3);

    cubes[i].rotateOnAxis(new THREE.Vector3(1, 0, 0), (Math.PI / 2) * angleX);
    cubes[i].rotateOnAxis(new THREE.Vector3(0, 1, 0), (Math.PI / 2) * angleY);
    cubes[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), (Math.PI / 2) * angleZ);

    cubess.push(cubes[i]);
  }    
}

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

let selectedCube = null;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects(cubes);

  if (intersects.length > 0) {
      let cube = intersects[0].object;
      if (selectedCube === null) {
          selectedCube = cube;
          cube.position.z += 0.3;
          const angle = 0.05
          const angley = selectedCube.rotation.y;
          const anglex = selectedCube.rotation.x;
          const anglez = selectedCube.rotation.z;
          if (angley < angle && angley > -angle && anglex < angle && anglex > -angle && anglez < angle && anglez > -angle) {
            document.getElementById("cube"+cubes.indexOf(selectedCube)).style.backgroundColor = "#00FA9A";
            return
          }
      } else {
          if (selectedCube === cube) {
              selectedCube.position.z = 0;
              selectedCube = null;
          } else {
            let cubeIndex = cubes.indexOf(selectedCube);
            let cubeIndex2 = cubes.indexOf(cube);
              if (selectedCube.position.equals(initialPositions[cubeIndex])) {
                selectedCube.position.z = 0;
                document.getElementById("cube" + cubeIndex).style.backgroundColor = "#ffa500";
                selectedCube = null;
                return;
              }
              else if (cube.position.equals(initialPositions2[cubeIndex2])) {
                selectedCube.position.z = 0;
                document.getElementById("cube" + cubeIndex2).style.backgroundColor = "#ffa500";
                selectedCube = null;
                return;
              }
              selectedCube.position.z = 0;

              let temp = new THREE.Vector3();
              temp.copy(selectedCube.position);

              selectedCube.position.copy(cube.position);
              cube.position.copy(temp);               

              selectedCube = null;
          }
      }
  } else if (selectedCube !== null) {
      selectedCube.position.z = 0;
      selectedCube = null;
  }
}

let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;

let isAnimating = false;

function onKeyDown(event) {
  event.preventDefault(); 
  if (selectedCube && !isAnimating) {
    const angley = selectedCube.rotation.y;
    const anglex = selectedCube.rotation.x;
    const anglez = selectedCube.rotation.z;

    const angle = 0.05
    if (angley < angle && angley > -angle && anglex < angle && anglex > -angle && anglez < angle && anglez > -angle) {
      document.getElementById("cube"+cubes.indexOf(selectedCube)).style.backgroundColor = "#00FA9A";
      return
    }
  
    if (event.key === 'w'){
      onKeyDown_w()
    }
    else if (event.key === 's'){
      onKeyDown_s()
    }
    else if (event.key === 'q'){
      onKeyDown_q()
    }
    else if (event.key === 'e'){
      onKeyDown_e()
    }
    else if (event.key === 'a'){
      onKeyDown_a()
    }
    else if (event.key === 'd'){
      onKeyDown_d()
    }
  }
}

function onKeyDown_w() {
  let targetRotationX = rotationX - (Math.PI / 2);
  animateRotationX();
  function animateRotationX() {
    isAnimating = true;
    if (rotationX > targetRotationX) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(1, 0, 0)),(-(Math.PI / 40)));
      rotationX -= (Math.PI / 40);
      requestAnimationFrame(animateRotationX);
    } else {
      isAnimating = false;
    }
  }
}

function onKeyDown_s() {
  let targetRotationX = rotationX + (Math.PI / 2);
  animateRotationX();
  function animateRotationX() {
    isAnimating = true;
    if (rotationX < targetRotationX) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(1, 0, 0)),(+(Math.PI / 40)));
      rotationX += (Math.PI / 40);
      requestAnimationFrame(animateRotationX);
    } else {
      isAnimating = false;
    }
  }
}

function onKeyDown_q() {
  let targetRotationZ = rotationZ + (Math.PI / 2);
  animateRotationZ();
  function animateRotationZ() {
    isAnimating = true;
    if (rotationZ < targetRotationZ) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(0, 0, 1)),(+(Math.PI / 40)));
      rotationZ += (Math.PI / 40);
      requestAnimationFrame(animateRotationZ);
    } else {
      isAnimating = false;
    }
  }
}

function onKeyDown_e() {
  let targetRotationZ = rotationZ - (Math.PI / 2);
  animateRotationZ();
  function animateRotationZ() {
    isAnimating = true;
    if (rotationZ > targetRotationZ) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(0, 0, 1)),(-(Math.PI / 40)));
      rotationZ -= (Math.PI / 40);
      requestAnimationFrame(animateRotationZ);
    } else {
      isAnimating = false;
    }
  }
}

function onKeyDown_a() {
  let targetRotationY = rotationY - (Math.PI / 2);
  animateRotationY();
  function animateRotationY() {
    isAnimating = true;
    if (rotationY > targetRotationY) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(0, 1, 0)),(-(Math.PI / 40)));
      rotationY -= (Math.PI / 40);
      requestAnimationFrame(animateRotationY);
    } else {
      isAnimating = false;
    }
  }
}

function onKeyDown_d() {
  let targetRotationY = rotationY + (Math.PI / 2);
  animateRotationY();
  function animateRotationY() {
    isAnimating = true;
    if (rotationY < targetRotationY) {
      selectedCube.rotateOnWorldAxis((new THREE.Vector3(0, 1, 0)),(+(Math.PI / 40)));
      rotationY += (Math.PI / 40);
      requestAnimationFrame(animateRotationY);
    } else {
      isAnimating = false;
    }
  }
}

window.addEventListener('click', onMouseClick);
window.addEventListener('resize', onWindowResize, false );
window.addEventListener('keydown', onKeyDown, pobeda, false);

document.addEventListener('wheel', function(event) {
  camera.position.z += event.deltaY * 0.01;
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

poz = false;

function pobeda() {
  
  for (i = 0; i <= 16; i++) {
    var color = document.getElementById("cube" + i).style.backgroundColor;
    if (color === "##00FA9A" | color === "#ffa500") {
      poz = true;
    } else {
      poz = false;
    }
    if (poz) {
      var modal = document.getElementById("modal");
      var message = document.getElementById("message");
      modal.style.display = "flex";
      message.innerHTML = "Поздравляем! Вы победили!";
    }
  }
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();