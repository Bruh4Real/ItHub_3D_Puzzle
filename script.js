const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var loader = new THREE.TextureLoader();
var textures = [];
for (var i = 1; i < 16; i++) {
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
    new THREE.MeshBasicMaterial({ color: getRandomColor() }), // правая сторона
    new THREE.MeshBasicMaterial({ color: getRandomColor() }), // левая сторона
    new THREE.MeshBasicMaterial({ color: getRandomColor() }), // верхняя сторона
    new THREE.MeshBasicMaterial({ color: getRandomColor() }), // нижняя сторона
    new THREE.MeshBasicMaterial({ map: textures[i] }), // передняя сторона
    new THREE.MeshBasicMaterial({ color: getRandomColor() }), // задняя сторона
  ];
}

const cubes = [];
const initialAngles = [];
var h = 0;

for (var i = 4; i > 0; i--) {
    for (var j = 0; j < 4; j++) {
        var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials[h]);
        cube.position.x = (j-1.5) * 1.2; // изменяем позицию по x
        cube.position.y = (i-2.5) * 1.2; // изменяем позицию по y
        cubes.push(cube);
        scene.add(cube);
        const initialangle = { y: cube.rotation.y };
        initialAngles.push(initialangle);
        h++;
    }
}

const cubess = [];

function povorot() {
    document.getElementById("button").style.display = "none";
    document.getElementById("fullscreen").style.display = "none";
    document.getElementById("img").style.display = "block";
    // document.getElementById("map").style.display = "block";
    // for (var i = 0; i < 16; i++) {
    //     var angle = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    //     cubes[i].rotateOnAxis(new THREE.Vector3(0, 1, 0), (Math.PI / 2) * angle);
    //     cubess.push(cubes[i]);
    // }
}
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

let selectedCube = null; // сохраняем ссылку на выбранный куб

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
            // Если куб еще не выбран, то запоминаем его и перемещаем на 0.01 по оси z
            selectedCube = cube;
            cube.position.z += 0.3;
        } else {
            if (selectedCube === cube) {
                // Если выбран тот же куб, то возвращаем его в исходное положение
                selectedCube.position.z = 0;
                selectedCube = null;
            } else {
                // Иначе меняем местами два куба
                selectedCube.position.z = 0;

                let temp = new THREE.Vector3();
                temp.copy(selectedCube.position);

                selectedCube.position.copy(cube.position);
                cube.position.copy(temp);               

                selectedCube = null;
            }
        }
    } else if (selectedCube !== null) {
        // Если кликнули за пределами матрицы, то возвращаем выбранный куб в исходное положение
        selectedCube.position.z = 0;
        selectedCube = null;
    }
}

let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;

// function onKeyDown(event) {
//   event.preventDefault();

//   if (selectedCube) {
//     if (event.keyCode === 87) { // Клавиша 'w'
//       selectedCube.rotateX(-Math.PI / 2);
//       rotationX -= Math.PI / 2;
//     } else if (event.keyCode === 83) { // Клавиша 's'
//       selectedCube.rotateX(Math.PI / 2);
//       rotationX += Math.PI / 2;
//     } else if (event.keyCode === 81) { // Клавиша 'q'
//       selectedCube.rotateZ(Math.PI / 2);
//       rotationZ += Math.PI / 2;
//     } else if (event.keyCode === 69) { // Клавиша 'e'
//       selectedCube.rotateZ(-Math.PI / 2);
//       rotationZ -= Math.PI / 2;
//     } else if (event.keyCode === 68) { // Клавиша 'd'
//       selectedCube.rotateY(Math.PI / 2);
//       rotationY += Math.PI / 2;
//     } else if (event.keyCode === 65) { // Клавиша 'a'
//       selectedCube.rotateY(-Math.PI / 2);
//       rotationY -= Math.PI / 2;
//     }
//   }
// }

function onKeyDown(event) {
  event.preventDefault();

  if (selectedCube) {
    if (event.keyCode === 87) { // Клавиша 'w'
      let targetRotationX = rotationX - (Math.PI / 2);
      animateRotationX();
      function animateRotationX() {
        if (rotationX > targetRotationX) {
          selectedCube.rotateX(-(Math.PI / 40));
          rotationX -= (Math.PI / 40);
          requestAnimationFrame(animateRotationX);
        }
      }
    } else if (event.keyCode === 83) { // Клавиша 's'
      let targetRotationX = rotationX + (Math.PI / 2);
      animateRotationX();
      function animateRotationX() {
        if (rotationX < targetRotationX) {
          selectedCube.rotateX(+(Math.PI / 40));
          rotationX += (Math.PI / 40);
          requestAnimationFrame(animateRotationX);
        }
      }
    } else if (event.keyCode === 81) { // Клавиша 'q'
      let targetRotationZ = rotationZ + (Math.PI / 2);
      animateRotationZ();
      function animateRotationZ() {
        if (rotationZ < targetRotationZ) {
          selectedCube.rotateZ(+(Math.PI / 40));
          rotationZ += (Math.PI / 40);
          requestAnimationFrame(animateRotationZ);
        }
      }
    } else if (event.keyCode === 69) { // Клавиша 'e'
      let targetRotationZ = rotationZ - (Math.PI / 2);
      animateRotationZ();
      function animateRotationZ() {
        if (rotationZ > targetRotationZ) {
          selectedCube.rotateZ(-(Math.PI / 40));
          rotationZ -= (Math.PI / 40);
          requestAnimationFrame(animateRotationZ);
        }
      }
    } else if (event.keyCode === 68) { // Клавиша 'd'
      let targetRotationY = rotationY + (Math.PI / 2);
      animateRotationY();
      function animateRotationY() {
        if (rotationY < targetRotationY) {
          selectedCube.rotateY(+(Math.PI / 40));
          rotationY += (Math.PI / 40);
          requestAnimationFrame(animateRotationY);
        }
      }
    } else if (event.keyCode === 65) { // Клавиша 'a'
      let targetRotationY = rotationY - (Math.PI / 2);
      animateRotationY();
      function animateRotationY() {
        if (rotationY > targetRotationY) {
          selectedCube.rotateY(-(Math.PI / 40));
          rotationY -= (Math.PI / 40);
          requestAnimationFrame(animateRotationY);
        }
      }
    }
  }
}


window.addEventListener('click', onMouseClick);
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener('keydown', onKeyDown, false);


// Добавляем обработчик события колесика мыши
document.addEventListener('wheel', function(event) {
  // Изменяем положение камеры по оси z
  camera.position.z += event.deltaY * 0.01;
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
  


function shift( event ) {
  // получаем координаты курсора внутри окна браузера
  const mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(cubes);

  if (intersects.length > 0) {
    const cube = intersects[0].object;
  }}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();