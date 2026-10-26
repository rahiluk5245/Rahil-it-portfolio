import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

// ============================================================================
// ACCESSORY TEXTURES & GEOMETRIES
// ============================================================================

const createCapTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Sleek metallic silver gradient base
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(0.3, "#e2e8f0");
  grad.addColorStop(0.7, "#cbd5e1");
  grad.addColorStop(0.95, "#94a3b8");
  grad.addColorStop(1.0, "#18181b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Six structural panel seams radiating from top button
  for (let i = 0; i < 6; i++) {
    const x = (i / 6) * 1024;

    ctx.strokeStyle = "rgba(30, 35, 45, 0.45)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 970);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 2, 0);
    ctx.lineTo(x + 2, 970);
    ctx.stroke();
  }

  // 3. Dark charcoal/black under-rim band along the bottom circumference
  ctx.fillStyle = "#111113";
  ctx.fillRect(0, 970, 1024, 54);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

// ============================================================================
// BONE & MESH NAME MAPPING LAYER
// ============================================================================

export const mapBonesAndMeshes = (character: THREE.Object3D) => {
  const nameMap = new Map<string, THREE.Object3D>();

  character.traverse((child) => {
    if (child.name) {
      nameMap.set(child.name, child);
      const clean = child.name.replace(/[\._\s]/g, "").toLowerCase();
      if (!nameMap.has(clean)) {
        nameMap.set(clean, child);
      }
    }
  });

  // Alias common bone and mesh variants (with/without dots or numbers)
  const aliases: Record<string, string[]> = {
    spine006: ["spine.006", "spine006", "spine_006", "head"],
    spine005: ["spine.005", "spine005", "spine_005", "neck"],
    screenlight: ["screenlight", "Glass.001", "Glass001", "ScreenLight"],
    monitor: ["Plane.004", "Plane004", "monitor", "Screen"],
    footL: ["foot.L", "footL", "foot_L"],
    footR: ["foot.R", "footR", "foot_R"],
  };

  Object.entries(aliases).forEach(([canonical, keys]) => {
    let target: THREE.Object3D | undefined;
    for (const key of keys) {
      const found =
        nameMap.get(key) ||
        nameMap.get(key.replace(/[\._\s]/g, "").toLowerCase());
      if (found) {
        target = found;
        break;
      }
    }
    if (target) {
      keys.forEach((k) => nameMap.set(k, target!));
      nameMap.set(canonical, target);
    }
  });

  const origGetObjectByName = character.getObjectByName.bind(character);
  character.getObjectByName = function (name: string): THREE.Object3D | undefined {
    return (
      nameMap.get(name) ||
      nameMap.get(name.replace(/[\._\s]/g, "").toLowerCase()) ||
      origGetObjectByName(name)
    );
  };
};

// ============================================================================
// MATERIAL & CLOTHING STYLING
// ============================================================================

const applyStyling = (character: THREE.Object3D) => {
  // 1. Warm brown tan skin tone: #9e6345
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#9e6345"),
    roughness: 0.52,
    metalness: 0.03,
  });

  // 2. Matte dark charcoal-grey crewneck t-shirt
  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#18181a"),
    roughness: 0.9,
    metalness: 0.04,
  });

  // 3. Thick black expressive eyebrows & hair
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0a0a0c"),
    roughness: 0.4,
    metalness: 0.05,
  });

  // 4. Dark pants
  const pantMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141416"),
    roughness: 0.85,
    metalness: 0.05,
  });

  // 5. Cap materials (silver-metallic crown + dark under-brim & trim)
  const capTexture = createCapTexture();
  const silverCapMaterial = new THREE.MeshStandardMaterial({
    map: capTexture,
    color: new THREE.Color("#e5eaf0"),
    metalness: 0.82,
    roughness: 0.28,
  });

  const darkTrimMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111113"),
    roughness: 0.85,
    metalness: 0.08,
  });

  character.traverse((child: any) => {
    if (child.isMesh) {
      const name = child.name;

      // 1. Head / Face (warm natural tan skin, no white mask)
      if (
        name === "Plane.007" ||
        name.includes("Head") ||
        name.includes("Face")
      ) {
        child.material = skinMaterial;
      }
      // 2. Ears, Neck, Hands
      else if (
        name.includes("Ear") ||
        name.includes("Neck") ||
        name.includes("Hand") ||
        name === "Plane.015" ||
        name === "Plane.016"
      ) {
        child.material = skinMaterial;
      }
      // 3. Eyes
      else if (
        name === "EYEs.001" ||
        name === "Sphere.002" ||
        name.includes("Eye")
      ) {
        if (child.material) {
          child.material.roughness = 0.08;
          child.material.metalness = 0.0;
        }
      }
      // 4. Shirt / Upper Body
      else if (
        name.includes("SHIRT") ||
        name === "BODY.SHIRT" ||
        name === "Mesh.002"
      ) {
        child.material = shirtMaterial;
      }
      // 5. Eyebrows & Hair Base
      else if (
        name.includes("Eyebrow") ||
        name.includes("hair") ||
        name === "Plane.003"
      ) {
        child.material = darkMaterial;
      }
      // 6. Pants / Lower Body
      else if (name.includes("Pant") || name === "Plane.005") {
        child.material = pantMaterial;
      }
      // 7. Shoes
      else if (name.includes("Shoe") || name === "Cube.004") {
        child.material = darkMaterial;
      }
    }
  });

  // Attach structured silver-metallic baseball cap to the hair bone if available
  const hair = character.getObjectByName("hair");
  if (hair && !hair.getObjectByName("BaseballCap")) {
    const cap = new THREE.Group();
    cap.name = "BaseballCap";

    const crownGeo = new THREE.SphereGeometry(
      0.108,
      48,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.53
    );
    const crown = new THREE.Mesh(crownGeo, silverCapMaterial);
    crown.scale.set(1.02, 0.96, 1.06);
    crown.position.set(0, 0.015, 0.01);
    crown.castShadow = true;
    cap.add(crown);

    const rimRingGeo = new THREE.TorusGeometry(0.106, 0.0035, 12, 48);
    const rimRing = new THREE.Mesh(rimRingGeo, darkTrimMaterial);
    rimRing.rotation.x = Math.PI * 0.5;
    rimRing.scale.set(1.02, 1.06, 0.96);
    rimRing.position.set(0, 0.015, 0.01);
    cap.add(rimRing);

    const buttonGeo = new THREE.SphereGeometry(0.012, 16, 12);
    const button = new THREE.Mesh(buttonGeo, silverCapMaterial);
    button.position.set(0, 0.118, 0.01);
    button.castShadow = true;
    cap.add(button);

    const brimGeo = new THREE.CylinderGeometry(
      0.116,
      0.122,
      0.008,
      36,
      1,
      false,
      Math.PI * 0.17,
      Math.PI * 0.66
    );
    const brim = new THREE.Mesh(brimGeo, [
      darkTrimMaterial,
      silverCapMaterial,
      darkTrimMaterial,
    ]);
    brim.rotation.y = Math.PI * 0.67;
    brim.rotation.x = 0.13;
    brim.position.set(0, 0.012, 0.068);
    brim.castShadow = true;
    cap.add(brim);

    hair.add(cap);
  }

  // Crewneck t-shirt collar ring around neck base
  if (!character.getObjectByName("ShirtCollar")) {
    const collarGeo = new THREE.TorusGeometry(0.36, 0.025, 16, 48);
    const collarMesh = new THREE.Mesh(collarGeo, darkTrimMaterial);
    collarMesh.name = "ShirtCollar";
    collarMesh.rotation.x = Math.PI * 0.52;
    collarMesh.position.set(0, 11.58, -0.06);
    collarMesh.scale.set(1.08, 0.95, 1.0);
    character.add(collarMesh);
  }
};

// ============================================================================
// CHARACTER LOADER
// ============================================================================

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadModelFromUrl = (url: string): Promise<GLTF> => {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        async (gltf) => {
          try {
            const character = gltf.scene;

            // 1. Map bones and meshes for universal compatibility
            mapBonesAndMeshes(character);

            // 2. Apply styling safely
            try {
              applyStyling(character);
            } catch (styleErr) {
              console.warn("applyStyling warning:", styleErr);
            }

            // 3. Safe shader pre-compilation (guarded with timeout so it NEVER blocks localhost)
            try {
              if (renderer && typeof renderer.compileAsync === "function") {
                await Promise.race([
                  renderer.compileAsync(character, camera, scene),
                  new Promise((res) => setTimeout(res, 400)),
                ]);
              }
            } catch (compileErr) {
              console.warn("Shader pre-compile skipped:", compileErr);
            }

            // 4. Enable shadows
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            // 5. Initialize GSAP Scroll timelines
            try {
              setCharTimeline(character, camera);
              setAllTimeline();
            } catch (tlErr) {
              console.warn("Timeline init warning:", tlErr);
            }

            // 6. Feet positioning
            const footR =
              character.getObjectByName("foot.R") ||
              character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;

            const footL =
              character.getObjectByName("foot.L") ||
              character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            resolve(gltf);
          } catch (initErr) {
            console.error("Error initializing character model:", initErr);
            reject(initErr);
          }
        },
        undefined,
        (error) => {
          console.error("GLTF load error for:", url, error);
          reject(error);
        }
      );
    });
  };

  const loadCharacter = async (): Promise<GLTF | null> => {
    // Attempt 1: Standard unencrypted direct GLB load (instant on localhost and production)
    try {
      return await loadModelFromUrl("/models/character.glb");
    } catch (err) {
      console.warn("Direct load from /models/character.glb failed, trying encrypted model:", err);
    }

    // Attempt 2: Decrypt .enc file as fallback
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      return await loadModelFromUrl(blobUrl);
    } catch (encErr) {
      console.error("All character loading attempts failed:", encErr);
      throw encErr;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
