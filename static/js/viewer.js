import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.getElementById("scene-canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(5, 5, 10);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickableObjects = [];

const loader = new GLTFLoader();
loader.load(
	"/static/models/map3.glb", // use your new GLB
	function (gltf) {
		const model = gltf.scene;
		scene.add(model);

		model.traverse((child) => {
			if (child.isMesh) {
				clickableObjects.push(child);
				console.log("Loaded:", child.name);
			}
		});
	},
	undefined,
	function (error) {
		console.error("Error loading GLB model:", error);
	}
);

// Mouse click handler
// function onClick(event) {
// 	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// 	raycaster.setFromCamera(mouse, camera);
// 	const intersects = raycaster.intersectObjects(clickableObjects, true);

// 	if (intersects.length > 0) {
// 		const clicked = intersects[0].object;
// 		console.log("You clicked:", clicked.name);

// 		// Optional: highlight
// 		if (clicked.material && clicked.material.emissive) {
// 			clicked.material.emissive.set(0xff0000);
// 		}
// 	}
// }

// let previouslySelected = null; // store previous selection

// function onClick(event) {
// 	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// 	raycaster.setFromCamera(mouse, camera);
// 	const intersects = raycaster.intersectObjects(clickableObjects, true);

// 	if (intersects.length > 0) {
// 		const clicked = intersects[0].object;

// 		console.log("You clicked:", clicked.name);

// 		// Reset previous selection if any
// 		if (previouslySelected) {
// 			if (previouslySelected.material && previouslySelected.material.emissive) {
// 				previouslySelected.material.emissive.set(0x000000); // reset color
// 			}
// 		}

// 		// Clone material if it's shared (optional but recommended)
// 		if (clicked.material && clicked.material.isMaterial) {
// 			clicked.material = clicked.material.clone();
// 		}

// 		// Highlight the clicked one
// 		if (clicked.material && clicked.material.emissive) {
// 			clicked.material.emissive.set(0xff0000); // red highlight
// 		}

// 		previouslySelected = clicked;
// 	}
// }

let previouslySelected = null;

function onClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(clickableObjects, true);

	if (intersects.length > 0) {
		const clicked = intersects[0].object;
		console.log("You clicked:", clicked.name);

		// Reset previous highlight
		if (previouslySelected && previouslySelected.material.emissive) {
			previouslySelected.material.emissive.set(0x000000);
		}

		// Clone material to avoid shared highlight
		if (clicked.material && clicked.material.isMaterial) {
			clicked.material = clicked.material.clone();
		}

		// Highlight current
		if (clicked.material && clicked.material.emissive) {
			clicked.material.emissive.set(0xff0000);
		}

		previouslySelected = clicked;

		// Show modal with name
		document.getElementById("buildingName").textContent =
			clicked.name || "Unnamed Building";
		const modal = new bootstrap.Modal(document.getElementById("buildingModal"));
		modal.show();
	}
}

window.addEventListener("click", onClick);

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
