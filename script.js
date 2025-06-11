// Basic three.js solar system simulation with clickable objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const info = document.getElementById('info');

// Light
const light = new THREE.PointLight(0xffffff, 1.5);
scene.add(light);

// Object data
const objects = [];

function createPlanet(name, radius, distance, orbitSpeed, color, details, parent) {
  const geom = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.userData = { name, details, orbitSpeed, distance };

  const pivot = new THREE.Object3D();
  pivot.add(mesh);
  mesh.position.x = distance;
  (parent || scene).add(pivot);

  objects.push({ mesh, pivot });
}

// Sun
createPlanet('Sun', 5, 0, 0, 0xffff00, 'The Sun is the star at the center of the Solar System.');

// Mercury
createPlanet('Mercury', 0.5, 8, 0.04, 0xaaaaaa, 'Mercury is the closest planet to the Sun.');

// Venus
createPlanet('Venus', 0.9, 11, 0.015, 0xffa500, 'Venus is known for its thick atmosphere.');

// Earth
createPlanet('Earth', 1, 15, 0.01, 0x0033ff, 'Earth is our home planet.');
// Moon
createPlanet('Moon', 0.27, 2, 0.05, 0x888888, 'The Moon orbits Earth.', objects[3].mesh);

// Mars
createPlanet('Mars', 0.53, 20, 0.008, 0xff4500, 'Mars is the red planet.');
// Moons of Mars
createPlanet('Phobos', 0.12, 1.2, 0.1, 0xaaaaaa, 'Phobos is a moon of Mars.', objects[5].mesh);
createPlanet('Deimos', 0.1, 1.8, 0.07, 0xcccccc, 'Deimos is a moon of Mars.', objects[5].mesh);

// Jupiter
createPlanet('Jupiter', 3, 26, 0.004, 0xd2b48c, 'Jupiter is the largest planet.');
createPlanet('Io', 0.29, 3.5, 0.07, 0xffcc33, 'Io is a volcanic moon of Jupiter.', objects[8].mesh);
createPlanet('Europa', 0.25, 5, 0.05, 0xbbbbbb, 'Europa has a subsurface ocean.', objects[8].mesh);
createPlanet('Ganymede', 0.41, 7, 0.04, 0x999999, 'Ganymede is the largest moon of Jupiter.', objects[8].mesh);
createPlanet('Callisto', 0.38, 9, 0.03, 0x888888, 'Callisto is heavily cratered.', objects[8].mesh);

// Saturn
createPlanet('Saturn', 2.5, 35, 0.003, 0xdeb887, 'Saturn is famous for its rings.');
createPlanet('Titan', 0.4, 4, 0.04, 0xffcc66, 'Titan is Saturn\'s largest moon.', objects[13].mesh);
// Saturn rings
const ringGeom = new THREE.RingGeometry(3, 4.5, 32);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeom, ringMat);
ring.rotation.x = Math.PI / 2;
objects[13].mesh.add(ring);

// Uranus
createPlanet('Uranus', 2, 44, 0.002, 0x66ccff, 'Uranus rotates on its side.');
createPlanet('Titania', 0.3, 3, 0.05, 0xdddddd, 'Titania is a moon of Uranus.', objects[15].mesh);

// Neptune
createPlanet('Neptune', 1.9, 52, 0.001, 0x3366ff, 'Neptune has strong winds.');
createPlanet('Triton', 0.27, 3, 0.04, 0xbbbbbb, 'Triton orbits Neptune.', objects[17].mesh);

// Camera position
camera.position.z = 80;

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects.map(o => o.mesh));
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const { name, details } = obj.userData;
    info.style.display = 'block';
    info.innerHTML = `<strong>${name}</strong><br>${details}`;
  } else {
    info.style.display = 'none';
  }
});

function animate() {
  requestAnimationFrame(animate);
  objects.forEach(o => {
    if (o.pivot) {
      o.pivot.rotation.y += o.mesh.userData.orbitSpeed;
    }
  });
  renderer.render(scene, camera);
}

animate();
