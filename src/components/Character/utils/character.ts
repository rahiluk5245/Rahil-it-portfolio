import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

// ============================================================================
// BONE & MESH ALIAS MAPPING LAYER
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

  // Ensure dot and non-dot notation both resolve instantly
  const aliases: Record<string, string[]> = {
    spine006: ["spine.006", "spine006", "spine_006", "head"],
    spine005: ["spine.005", "spine005", "spine_005", "neck"],
    screenlight: ["screenlight", "Glass.002", "Glass.001", "Glass002"],
    monitor: ["Plane.004", "Plane004", "monitor", "Plane.010"],
    footL: ["footL", "foot.L", "foot_L"],
    footR: ["footR", "foot.R", "foot_R"],
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
// MATERIAL & THEME COLOR STYLING
// ============================================================================

const applyStyling = (character: THREE.Object3D) => {
  character.traverse((child: any) => {
    if (child.isMesh) {
      const mesh = child as THREE.Mesh;

      // Customize shirt and pants to match executive dark palette
      // while preserving all native PBR materials for the cap, teeth, eyes, and skin!
      if (mesh.material) {
        if (mesh.name === "BODY.SHIRT" || mesh.name.includes("SHIRT")) {
          const newMat = (
            mesh.material as THREE.Material
          ).clone() as THREE.MeshStandardMaterial;
          newMat.color = new THREE.Color("#18181a"); // Sleek matte dark charcoal
          newMat.roughness = 0.85;
          newMat.metalness = 0.04;
          mesh.material = newMat;
        } else if (mesh.name === "Pant" || mesh.name.includes("Pant")) {
          const newMat = (
            mesh.material as THREE.Material
          ).clone() as THREE.MeshStandardMaterial;
          newMat.color = new THREE.Color("#0c0c0e"); // Deep black trousers
          newMat.roughness = 0.85;
          newMat.metalness = 0.05;
          mesh.material = newMat;
        }
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;
    }
  });
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

            // 1. Map bone and mesh aliases
            mapBonesAndMeshes(character);

            // 2. Apply theme styling to shirt and pants
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

            // 4. Initialize GSAP Scroll timelines
            try {
              setCharTimeline(character, camera);
              setAllTimeline();
            } catch (tlErr) {
              console.warn("Timeline init warning:", tlErr);
            }

            // 5. Position feet properly to rest on ground
            const footR =
              character.getObjectByName("footR") ||
              character.getObjectByName("foot.R");
            if (footR) footR.position.y = 3.36;

            const footL =
              character.getObjectByName("footL") ||
              character.getObjectByName("foot.L");
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
      console.warn("Direct load from /models/character.glb failed, trying encrypted fallback:", err);
    }

    // Attempt 2: Decrypt .enc file as fallback
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "MyCharacter12"
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
