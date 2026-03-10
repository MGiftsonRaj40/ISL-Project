import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/TransformControls.js";

/* =========================
   CONTAINER & SCENE
========================= */
const container = document.getElementById("viewer");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

/* =========================
   CAMERA
========================= */
const camera = new THREE.PerspectiveCamera(
   30,
   container.clientWidth / container.clientHeight,
   0.1,
   10000
);

/* =========================
   RENDERER
========================= */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

/* =========================
   CONTROLS
========================= */
const controls = new OrbitControls(camera, renderer.domElement);

// Smooth movement
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// Zoom smoothing
controls.zoomSpeed = 0.8;
controls.minDistance = 100;
controls.maxDistance = 800;

// Rotation smoothing
controls.rotateSpeed = 0.5;

// Panning
controls.panSpeed = 0.5;
controls.screenSpacePanning = false;

// Angle limits
controls.maxPolarAngle = Math.PI / 2.2;

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);
transformControls.setMode("rotate");

transformControls.addEventListener("dragging-changed", function (event) {

   controls.enabled = !event.value;

});

/* =========================
   LIGHTING
========================= */
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 6);
dirLight.position.set(100, 300, 200);
dirLight.castShadow = true;
dirLight.shadow.camera.left = -500;
dirLight.shadow.camera.right = 500;
dirLight.shadow.camera.top = 500;
dirLight.shadow.camera.bottom = -500;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

/* =========================
   GLOBAL VARIABLES
========================= */
let model = null;
let islData = {};
let autoResetEnabled = true;
let idleClock = new THREE.Clock();
let islSentence = "";
let idleEnabled = true;
const defaultPose = {};
let playingAnimation = false;
/* =========================
   SET DEFAULT POSE
========================= */
function setDefaultPose(duration = 100) {
   if (!model) return;

   const bones = [

      { name: "mixamorig9Neck", rot: { x: 0.09, y: 0, z: 0 } },
      { name: "mixamorig9Head", rot: { x: -0.1, y: 0, z: 0 } },

      // ======================
      // ARMS
      // ======================
      { name: "mixamorig9RightArm", rot: { x: 1.2, y: 0, z: 0 } },
      { name: "mixamorig9RightForeArm", rot: { x: 0.2, y: 0, z: 0 } },
      { name: "mixamorig9RightHand", rot: { x: 0, y: 0, z: 0 } },

      { name: "mixamorig9LeftArm", rot: { x: 1.2, y: 0, z: 0 } },
      { name: "mixamorig9LeftForeArm", rot: { x: 0.2, y: 0, z: 0 } },
      { name: "mixamorig9LeftHand", rot: { x: 0, y: 0, z: 0 } },

      // ======================
      // RIGHT HAND FINGERS
      // ======================

      // Thumb
      { name: "mixamorig9RightHandThumb1", rot: { x: 0, y: 0, z: -0.5 } },
      { name: "mixamorig9RightHandThumb2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandThumb3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandThumb4", rot: { x: 0, y: 0, z: 0 } },

      // Index
      { name: "mixamorig9RightHandIndex1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandIndex2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandIndex3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandIndex4", rot: { x: 0, y: 0, z: 0 } },

      // Middle
      { name: "mixamorig9RightHandMiddle1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandMiddle2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandMiddle3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandMiddle4", rot: { x: 0, y: 0, z: 0 } },

      // Ring
      { name: "mixamorig9RightHandRing1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandRing2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandRing3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandRing4", rot: { x: 0, y: 0, z: 0 } },

      // Pinky
      { name: "mixamorig9RightHandPinky1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandPinky2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandPinky3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9RightHandPinky4", rot: { x: 0, y: 0, z: 0 } },

      // ======================
      // LEFT HAND FINGERS
      // ======================

      // Thumb
      { name: "mixamorig9LeftHandThumb1", rot: { x: 0, y: 0, z: 0.5 } },
      { name: "mixamorig9LeftHandThumb2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandThumb3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandThumb4", rot: { x: 0, y: 0, z: 0 } },

      // Index
      { name: "mixamorig9LeftHandIndex1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandIndex2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandIndex3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandIndex4", rot: { x: 0, y: 0, z: 0 } },

      // Middle
      { name: "mixamorig9LeftHandMiddle1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandMiddle2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandMiddle3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandMiddle4", rot: { x: 0, y: 0, z: 0 } },

      // Ring
      { name: "mixamorig9LeftHandRing1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandRing2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandRing3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandRing4", rot: { x: 0, y: 0, z: 0 } },

      // Pinky
      { name: "mixamorig9LeftHandPinky1", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandPinky2", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandPinky3", rot: { x: 0, y: 0, z: 0 } },
      { name: "mixamorig9LeftHandPinky4", rot: { x: 0, y: 0, z: 0 } }
   ];

   bones.forEach(({ name, rot }) => {
      const bone = model.getObjectByName(name);
      if (!bone) return;

      const startRot = { x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z };
      const endRot = rot;
      const startTime = performance.now();

      function tween() {
         const now = performance.now();
         const t = Math.min((now - startTime) / duration, 1);
         bone.rotation.x = startRot.x + (endRot.x - startRot.x) * t;
         bone.rotation.y = startRot.y + (endRot.y - startRot.y) * t;
         bone.rotation.z = startRot.z + (endRot.z - startRot.z) * t;
         if (t < 1) requestAnimationFrame(tween);
      }
      tween();
   });

   // Slight finger curl
   ["Thumb1", "Index1", "Middle1", "Ring1", "Pinky1"].forEach(f => {
      ["Right", "Left"].forEach(side => {
         const bone = model.getObjectByName(`mixamorig9${side}Hand${f}`);
         if (bone) bone.rotation.set(-0.1, 0, 0);
      });
   });
}

/* =========================
   LOAD FBX
========================= */
const loader = new FBXLoader();
loader.load(
   "/static/models/character.fbx",
   (object) => {
      model = object;
      scene.add(model);

      // populate bone dropdown
      populateBoneDropdown();

      model.animations = [];
      model.traverse(child => {
         if (child.animations) child.animations = [];
         if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
         }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const desiredSize = 400;
      const scale = desiredSize / maxDim;
      model.scale.setScalar(scale);

      camera.position.set(0, 210, 400);
      camera.lookAt(0, 205, 0);
      controls.target.set(0, 205, 0);
      controls.update();

      console.log("FBX loaded successfully!");
      setDefaultPose(600);
   },
   undefined,
   (error) => console.error("Error loading FBX:", error)
);

/* =========================
   LOAD ISL JSON
========================= */
fetch("/static/isl_data.json")
   .then(res => res.json())
   .then(data => {
      islData = data;
      console.log("ISL JSON loaded:", islData);
   })
   .catch(err => console.error("Error loading ISL JSON:", err));

/* =========================
   ANIMATE ISL
========================= */
function animateISL(word, defaultDuration = 400) {

   if (!model || !islData[word]) {
      console.warn("Gesture not found:", word);
      return 0;
   }

   const frames = islData[word];
   let timeline = 0;

   frames.forEach((frame) => {

      const frameDelay = frame.delay || 0;
      const frameDuration = frame.duration || defaultDuration;

      const boneKeys = Object.keys(frame).filter(
         key => key !== "delay" && key !== "duration"
      );

      timeline += frameDelay;

      setTimeout(() => {

         boneKeys.forEach(rawBoneName => {

            const boneName = rawBoneName.replace(":", "");
            const bone = model.getObjectByName(boneName);

            if (!bone) return;

            const targetRot = frame[rawBoneName].rotation;
            if (!targetRot) return;

            const startRot = {
               x: bone.rotation.x,
               y: bone.rotation.y,
               z: bone.rotation.z
            };

            const startTime = performance.now();

            function tween() {

               const now = performance.now();
               const t = Math.min((now - startTime) / frameDuration, 1);

               bone.rotation.x = startRot.x + (targetRot.x - startRot.x) * t;
               bone.rotation.y = startRot.y + (targetRot.y - startRot.y) * t;
               bone.rotation.z = startRot.z + (targetRot.z - startRot.z) * t;

               if (t < 1) requestAnimationFrame(tween);

            }

            tween();

         });

      }, timeline);

      timeline += frameDuration;

   });

   return timeline; // IMPORTANT
}

/* =========================
   FORM → BACKEND → ISL
========================= */

document.getElementById("islForm").addEventListener("submit", async function (e) {

   e.preventDefault();

   const text = document.getElementById("textInput").value;

   const response = await fetch("/convert", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
   });

   const data = await response.json();

   const islSentence = data.isl;

   console.log("ISL sentence:", islSentence);

   const words = islSentence
      .toUpperCase()
      .split(" ")
      .filter(w => w.trim().length > 0);

   console.log("Words:", words);

   playISLSequence(words);

});

/* =========================
   PLAY ISL SEQUENCE
========================= */

function playISLSequence(words) {

   let index = 0;

   function playNext() {

      if (index >= words.length) {

         console.log("Sentence finished");

         if (autoResetEnabled && model) {

            console.log("Reset should run now");

            setTimeout(() => {

               console.log("Resetting pose...");
               setDefaultPose(1000);

            }, 500);

         }

         return;
      }

      const word = words[index];

      if (!islData[word]) {
         console.warn("Gesture missing:", word);
         index++;
         playNext();
         return;
      }

      const duration = animateISL(word);

      const spans = document.querySelectorAll("#outputDiv span");

      spans.forEach(s => s.classList.remove("active"));

      if (spans[index]) spans[index].classList.add("active");

      index++;

      setTimeout(playNext, duration + 300);

   }

   playNext();
}

/* =========================
   BUTTON HANDLERS
========================= */
document.getElementById("btnGO").onclick = () => playISLSequence(["GO"]);
document.getElementById("btnME").onclick = () => playISLSequence(["ME"]);
document.getElementById("btnSCHOOL").onclick = () => playISLSequence(["SCHOOL"]);
document.getElementById("btnHello").onclick = () => playISLSequence(["HELLO"]);
document.getElementById("btnSIGN").onclick = () => playISLSequence(["SIGN"]);
document.getElementById("btnLANGUAGE").onclick = () => playISLSequence(["LANGUAGE"]);
document.getElementById("btnYES").onclick = () => playISLSequence(["YES"]);
document.getElementById("btnNO").onclick = () => playISLSequence(["NO"]);


document.getElementById("resetPose")?.addEventListener("click", resetPoseInstant);

document.getElementById("autoResetOn")?.addEventListener("change", () => {
   autoResetEnabled = true;
});
document.getElementById("autoResetOff")?.addEventListener("change", () => {
   autoResetEnabled = false;
});

function applyIdleMovement() {
   if (!model || !idleEnabled) return;

   const time = idleClock.getElapsedTime();

   const spine = model.getObjectByName("mixamorig9Spine");
   const hips = model.getObjectByName("mixamorig9Hips");

   if (!spine || !hips) return;

   spine.rotation.x = Math.sin(time * 2) * 0.02;
   hips.rotation.y = Math.sin(time * 0.8) * 0.01;
}

/* =========================
   ANIMATION LOOP
========================= */
function animate() {
   requestAnimationFrame(animate);
   applyIdleMovement();
   controls.update();
   renderer.render(scene, camera);
}
animate();

/* =========================
   RESIZE HANDLER
========================= */
window.addEventListener("resize", () => {
   camera.aspect = container.clientWidth / container.clientHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(container.clientWidth, container.clientHeight);
});

const toggleBtn = document.getElementById("toggleBonePanel");
const bonePanel = document.getElementById("boneControlPanel");

toggleBtn?.addEventListener("click", () => {

   if (bonePanel.style.display === "none") {
      bonePanel.style.display = "block";
      toggleBtn.textContent = "Hide Panel";
   } else {
      bonePanel.style.display = "none";
      toggleBtn.textContent = "Show Panel";
   }

});

/* =========================
   BONE CONTROLLER VARIABLES
========================= */

const boneSelect = document.getElementById("boneSelect");

const xSlider = document.getElementById("xSlider");
const ySlider = document.getElementById("ySlider");
const zSlider = document.getElementById("zSlider");

const xVal = document.getElementById("xVal");
const yVal = document.getElementById("yVal");
const zVal = document.getElementById("zVal");

const copyBoneBtn = document.getElementById("copyBoneJson");
const mirrorBtn = document.getElementById("mirrorRightToLeft");

let selectedBone = null;


/* =========================
   POPULATE BONE DROPDOWN
========================= */

function populateBoneDropdown() {

   if (!model) return;

   boneSelect.innerHTML = "";

   model.traverse((child) => {

      if (
         child.isBone &&
         (
            child.name.includes("RightHand") ||
            child.name.includes("RightArm") ||
            child.name.includes("RightForeArm") ||
            child.name.includes("RightThumb") ||
            child.name.includes("RightIndex") ||
            child.name.includes("RightMiddle") ||
            child.name.includes("RightRing") ||
            child.name.includes("RightPinky") ||
            child.name.includes("LeftHand") ||
            child.name.includes("LeftArm") ||
            child.name.includes("LeftForeArm") ||
            child.name.includes("LeftThumb") ||
            child.name.includes("LeftIndex") ||
            child.name.includes("LeftMiddle") ||
            child.name.includes("LeftRing") ||
            child.name.includes("LeftPinky") ||
            child.name.includes("Hips") ||
            child.name.includes("Chest") ||
            child.name.includes("Head") ||
            child.name.includes("Neck")
         )
      ) {
         const option = document.createElement("option");
         option.value = child.name;
         option.textContent = child.name;

         boneSelect.appendChild(option);

      }

   });

}


/* =========================
   SELECT BONE
========================= */

boneSelect?.addEventListener("change", () => {

   if (!model) return;

   const name = boneSelect.value;

   selectedBone = model.getObjectByName(name);

   if (!selectedBone) return;

   transformControls.attach(selectedBone);

   xSlider.value = selectedBone.rotation.x;
   ySlider.value = selectedBone.rotation.y;
   zSlider.value = selectedBone.rotation.z;

   updateLabels();

});

window.addEventListener("keydown", (e) => {

   if (e.key === "Escape") {
      transformControls.detach();
      selectedBone = null;
   }

});


/* =========================
   UPDATE LABELS
========================= */

function updateLabels() {

   xVal.textContent = parseFloat(xSlider.value).toFixed(2);
   yVal.textContent = parseFloat(ySlider.value).toFixed(2);
   zVal.textContent = parseFloat(zSlider.value).toFixed(2);

}


/* =========================
   APPLY ROTATION
========================= */

function applyRotation() {

   if (!selectedBone) return;

   selectedBone.rotation.x = parseFloat(xSlider.value);
   selectedBone.rotation.y = parseFloat(ySlider.value);
   selectedBone.rotation.z = parseFloat(zSlider.value);

   updateLabels();

}

xSlider.addEventListener("input", applyRotation);
ySlider.addEventListener("input", applyRotation);
zSlider.addEventListener("input", applyRotation);


/* =========================
   COPY SINGLE BONE JSON
========================= */

copyBoneBtn?.addEventListener("click", () => {

   if (!selectedBone) {
      alert("Select a bone first");
      return;
   }

   const name = selectedBone.name.replace("mixamorig9", "mixamorig9:");

   const json = `"${name}": {
  "rotation": {
    "x": ${selectedBone.rotation.x.toFixed(2)},
    "y": ${selectedBone.rotation.y.toFixed(2)},
    "z": ${selectedBone.rotation.z.toFixed(2)}
  }
}`;

   navigator.clipboard?.writeText(json);

   console.log("Copied bone JSON:", json);

});


copyHandsPoseBtn?.addEventListener("click", () => {

   if (!model) return;

   const handBones = [
      "mixamorig9RightArm", "mixamorig9RightForeArm", "mixamorig9RightHand",
      "mixamorig9RightHandThumb1", "mixamorig9RightHandThumb2", "mixamorig9RightHandThumb3",
      "mixamorig9RightHandIndex1", "mixamorig9RightHandIndex2", "mixamorig9RightHandIndex3",
      "mixamorig9RightHandMiddle1", "mixamorig9RightHandMiddle2", "mixamorig9RightHandMiddle3",
      "mixamorig9RightHandRing1", "mixamorig9RightHandRing2", "mixamorig9RightHandRing3",
      "mixamorig9RightHandPinky1", "mixamorig9RightHandPinky2", "mixamorig9RightHandPinky3",

      "mixamorig9LeftArm", "mixamorig9LeftForeArm", "mixamorig9LeftHand",
      "mixamorig9LeftHandThumb1", "mixamorig9LeftHandThumb2", "mixamorig9LeftHandThumb3",
      "mixamorig9LeftHandIndex1", "mixamorig9LeftHandIndex2", "mixamorig9LeftHandIndex3",
      "mixamorig9LeftHandMiddle1", "mixamorig9LeftHandMiddle2", "mixamorig9LeftHandMiddle3",
      "mixamorig9LeftHandRing1", "mixamorig9LeftHandRing2", "mixamorig9LeftHandRing3",
      "mixamorig9LeftHandPinky1", "mixamorig9LeftHandPinky2", "mixamorig9LeftHandPinky3"
   ];

   const pose = {};

   model.traverse(child => {

      if (child.isBone && handBones.includes(child.name)) {

         // convert quaternion to euler
         const euler = new THREE.Euler().setFromQuaternion(child.quaternion, "XYZ");

         const name = child.name.replace("mixamorig9", "mixamorig9:");

         pose[name] = {
            rotation: {
               x: Number(euler.x.toFixed(2)),
               y: Number(euler.y.toFixed(2)),
               z: Number(euler.z.toFixed(2))
            }
         };

      }

   });

   const json = JSON.stringify(pose, null, 2);

   navigator.clipboard?.writeText(json);

   console.log("Copied CURRENT pose:");
   console.log(json);

});

/* =========================
   MIRROR RIGHT → LEFT
========================= */

mirrorBtn?.addEventListener("click", () => {

   if (!model) return;

   model.traverse((rightBone) => {

      if (!rightBone.isBone) return;

      if (!rightBone.name.includes("RightHand") &&
         !rightBone.name.includes("RightForeArm") &&
         !rightBone.name.includes("RightArm")) return;

      const leftName = rightBone.name.replace("Right", "Left");
      const leftBone = model.getObjectByName(leftName);

      if (!leftBone) return;

      const q = rightBone.quaternion.clone();

      // Mirror across body (invert X axis)
      q.x *= -1;
      q.w *= -1;

      leftBone.quaternion.copy(q);

   });

   console.log("Mirrored Right → Left (Quaternion)");

});

function resetPoseInstant() {

   if (!model) return;

   const bones = [
      { name: "mixamorig9RightArm", rot: { x: 1.2, y: 0, z: 0 } },
      { name: "mixamorig9RightForeArm", rot: { x: 0.2, y: 0, z: 0 } },
      { name: "mixamorig9RightHand", rot: { x: 0, y: 0, z: 0 } },

      { name: "mixamorig9LeftArm", rot: { x: 1.2, y: 0, z: 0 } },
      { name: "mixamorig9LeftForeArm", rot: { x: 0.2, y: 0, z: 0 } },
      { name: "mixamorig9LeftHand", rot: { x: 0, y: 0, z: 0 } }
   ];

   bones.forEach(({ name, rot }) => {

      const bone = model.getObjectByName(name);
      if (!bone) return;

      bone.rotation.set(rot.x, rot.y, rot.z);

   });

   console.log("Pose reset");

}