// =====================================
// 3D HIGHWAY BIKE RACER
// Three.js Game Engine
// =====================================
const game = document.getElementById("game");
const speedDisplay = document.getElementById("speed");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-btn");
const message = document.getElementById("message");
// Create 3D scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 35, 150);
// Camera
const camera = new THREE.PerspectiveCamera(
    65,
    game.clientWidth / game.clientHeight,
    0.1,
    500
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, -8);
// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(game.clientWidth, game.clientHeight);
renderer.shadowMap.enabled = true;
game.prepend(renderer.domElement);
// Lighting
const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
sunlight.position.set(-5, 12, 8);
sunlight.castShadow = true;
scene.add(sunlight);
scene.add(new THREE.HemisphereLight(0xffffff, 0x426344, 2));
// Materials
const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x343943,
    roughness: 0.9
});
const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x398747
});
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
});
const bikeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf02345,
    metalness: 0.35,
    roughness: 0.35
});
const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x171b22,
    roughness: 0.65
});
// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 500),
    grassMaterial
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.12;
scene.add(ground);
// Road
const road = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 500),
    roadMaterial
);
road.rotation.x = -Math.PI / 2;
road.position.y = -0.05;
scene.add(road);
// Road lane markers
const laneMarkers = [];
for (let z = -240; z < 20; z += 10) {
    for (const x of [-2, 2]) {
        const marker = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.025, 4),
            whiteMaterial
        );
        marker.position.set(x, 0.01, z);
        scene.add(marker);
        laneMarkers.push(marker);
    }
}
// Roadside trees
const trees = [];
function createTree(x, z) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.22, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x70452a })
    );
    trunk.position.y = 0.75;
    tree.add(trunk);
    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 2.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x187343 })
    );
    leaves.position.y = 2.4;
    tree.add(leaves);
    tree.position.set(x, 0, z);
    scene.add(tree);
    trees.push(tree);
}
for (let z = -220; z < 20; z += 12) {
    createTree(-9 - Math.random() * 4, z);
    createTree(9 + Math.random() * 4, z - 5);
}
// =====================================
// CREATE 3D BIKE
// =====================================
const bike = new THREE.Group();
function addBikePart(geometry, material, x, y, z) {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, z);
    part.castShadow = true;
    bike.add(part);
    return part;
}
// Wheels
function createWheel(z) {
    const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.22, 20),
        blackMaterial
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.48, z);
    bike.add(wheel);
}
createWheel(-1);
createWheel(1);
// Bike body
addBikePart(
    new THREE.BoxGeometry(0.65, 0.55, 1.5),
    bikeMaterial,
    0, 0.9, 0
);
// Fuel tank
addBikePart(
    new THREE.SphereGeometry(0.43, 16, 12),
    bikeMaterial,
    0, 1.2, -0.15
);
// Seat
addBikePart(
    new THREE.BoxGeometry(0.52, 0.18, 0.75),
    blackMaterial,
    0, 1.35, 0.45
);
// Front fork
addBikePart(
    new THREE.BoxGeometry(0.12, 0.85, 0.15),
    whiteMaterial,
    0, 0.95, -0.8
);
// Handlebar
addBikePart(
    new THREE.BoxGeometry(1.05, 0.12, 0.12),
    blackMaterial,
    0, 1.55, -0.75
);
// Headlight
const headlight = addBikePart(
    new THREE.SphereGeometry(0.19, 12, 8),
    new THREE.MeshStandardMaterial({
        color: 0xfff2b0,
        emissive: 0xffcc55,
        emissiveIntensity: 1.2
    }),
    0, 1.15, -0.83
);
// Rider helmet
addBikePart(
    new THREE.SphereGeometry(0.3, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x151c2b }),
    0, 2.0, 0.12
);
bike.position.set(0, 0, 5);
scene.add(bike);
// =====================================
// TRAFFIC VEHICLES
// =====================================
const enemies = [];
function createCar() {
    const car = new THREE.Group();
    const colors = [
        0xffc247,
        0x258cff,
        0xb35cff,
        0xf3f3f3,
        0x20bd82
    ];
    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.75, 2),
        new THREE.MeshStandardMaterial({ color })
    );
    body.position.y = 0.65;
    car.add(body);
    const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.4, 0.85),
        new THREE.MeshStandardMaterial({
            color: 0x9edaf1,
            metalness: 0.2,
            roughness: 0.25
        })
    );
    windowMesh.position.set(0, 1.15, -0.1);
    car.add(windowMesh);
    for (const x of [-0.68, 0.68]) {
        for (const z of [-0.65, 0.65]) {
            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.24, 0.24, 0.15, 12),
                blackMaterial
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, 0.35, z);
            car.add(wheel);
        }
    }
    const lanes = [-3.5, 0, 3.5];
    car.position.set(
        lanes[Math.floor(Math.random() * lanes.length)],
        0,
        -100
    );
    scene.add(car);
    enemies.push(car);
}
// =====================================
// GAME CONTROLS
// =====================================
let running = false;
let speed = 0;
let score = 0;
let nitro = false;
let braking = false;
let leftPressed = false;
let rightPressed = false;
const clock = new THREE.Clock();
function bindHold(id, callback) {
    const button = document.getElementById(id);
    button.addEventListener("pointerdown", event => {
        event.preventDefault();
        callback(true);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
        button.addEventListener(type, () => callback(false));
    });
}
bindHold("left-btn", value => leftPressed = value);
bindHold("right-btn", value => rightPressed = value);
bindHold("brake-btn", value => braking = value);
bindHold("nitro-btn", value => nitro = value);
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        leftPressed = true;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        rightPressed = true;
    }
    if (event.key === "ArrowDown") braking = true;
    if (event.key === "ArrowUp" || event.code === "Space") nitro = true;
});
document.addEventListener("keyup", event => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        leftPressed = false;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        rightPressed = false;
    }
    if (event.key === "ArrowDown") braking = false;
    if (event.key === "ArrowUp" || event.code === "Space") nitro = false;
});
// =====================================
// START AND END GAME
// =====================================
function startGame() {
    enemies.forEach(enemy => scene.remove(enemy));
    enemies.length = 0;
    bike.position.x = 0;
    bike.rotation.z = 0;
    speed = 0;
    score = 0;
    running = true;
    startScreen.classList.add("hidden");
    clock.start();
}
function endGame() {
    if (!running) return;
    running = false;
    message.textContent = "🏁 GAME OVER!";
    startScreen.querySelector("p").textContent =
        "Final score: " + score;
    startButton.textContent = "RACE AGAIN";
    startScreen.classList.remove("hidden");
}
startButton.addEventListener("click", startGame);
// =====================================
// GAME UPDATE
// =====================================
let spawnTimer = 0;
function updateGame(delta) {
    const targetSpeed = braking ? 8 : nitro ? 55 : 28;
    speed += (targetSpeed - speed) * delta * 2;
    // Bike movement
    if (leftPressed) {
        bike.position.x -= 8 * delta;
    }
    if (rightPressed) {
        bike.position.x += 8 * delta;
    }
    bike.position.x = THREE.MathUtils.clamp(
        bike.position.x,
        -4.5,
        4.5
    );
    bike.rotation.z = THREE.MathUtils.lerp(
        bike.rotation.z,
        leftPressed ? 0.18 : rightPressed ? -0.18 : 0,
        delta * 5
    );
    // Road movement
    laneMarkers.forEach(marker => {
        marker.position.z += speed * delta;
        if (marker.position.z > 15) {
            marker.position.z -= 260;
        }
    });
    trees.forEach(tree => {
        tree.position.z += speed * delta;
        if (tree.position.z > 15) {
            tree.position.z -= 240;
        }
    });
    // Traffic generation
    spawnTimer += delta;
    if (spawnTimer > 1.5) {
        createCar();
        spawnTimer = 0;
    }
    // Traffic movement and collision
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.position.z += speed * delta;
        const closeX = Math.abs(
            enemy.position.x - bike.position.x
        ) < 1.1;
        const closeZ = Math.abs(
            enemy.position.z - bike.position.z
        ) < 1.8;
        if (closeX && closeZ) {
            endGame();
            return;
        }
        if (enemy.position.z > 15) {
            scene.remove(enemy);
            enemies.splice(i, 1);
            score += 10;
        }
    }
    score += Math.floor(speed * delta / 3);
    speedDisplay.textContent = Math.round(speed * 5);
    scoreDisplay.textContent = score;
    // Camera follows bike
    camera.position.x +=
        (bike.position.x * 0.35 - camera.position.x) * delta * 3;
    camera.lookAt(
        bike.position.x * 0.25,
        0.8,
        -8
    );
}
// =====================================
// ANIMATION
// =====================================
function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    if (running) {
        updateGame(delta);
    }
    renderer.render(scene, camera);
}
animate();
// Responsive screen
window.addEventListener("resize", () => {
    const width = game.clientWidth;
    const height = game.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});