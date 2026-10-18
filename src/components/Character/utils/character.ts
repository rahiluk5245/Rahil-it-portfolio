import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
const applyStyling = (character: THREE.Object3D) => {
  // 1. Warm brown tan skin tone: #9e6345
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#9e6345"),
    roughness: 0.55,
    metalness: 0.05,
  });

  // 2. Matte dark charcoal-grey crewneck t-shirt
  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#202022"),
    roughness: 0.85,
    metalness: 0.08,
  });

  // 3. Thick black expressive eyebrows & hair
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111113"),
    roughness: 0.5,
    metalness: 0.1,
  });

  // 4. Dark pants
  const pantMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#19191b"),
    roughness: 0.8,
    metalness: 0.1,
  });

  // 5. Silver metallic cap material
  const silverCapMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c8ced7"),
    metalness: 0.85,
    roughness: 0.22,
  });

  character.traverse((child: any) => {
    if (child.isMesh) {
      const name = child.name;
      if (
        name === "Plane.007" ||
        name.includes("Ear") ||
        name.includes("Neck") ||
        name.includes("Hand")
      ) {
        child.material = skinMaterial;
      } else if (name.includes("SHIRT") || name === "BODY.SHIRT") {
        child.material = shirtMaterial;
      } else if (name.includes("Eyebrow") || name.includes("hair")) {
        child.material = darkMaterial;
      } else if (name.includes("Pant")) {
        child.material = pantMaterial;
      }
    }
  });

  // Attach structured silver-metallic baseball cap to the hair
  const hair = character.getObjectByName("hair");
  if (hair && !hair.getObjectByName("BaseballCap")) {
    const cap = new THREE.Group();
    cap.name = "BaseballCap";

    // Crown / dome of the baseball cap
    const crownGeo = new THREE.SphereGeometry(
      0.106,
      32,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    );
    const crown = new THREE.Mesh(crownGeo, silverCapMaterial);
    crown.scale.set(1.02, 0.95, 1.08);
    crown.position.set(0, 0.015, 0.01);
    crown.castShadow = true;
    cap.add(crown);

    // Top button
    const buttonGeo = new THREE.SphereGeometry(0.012, 16, 8);
    const button = new THREE.Mesh(buttonGeo, silverCapMaterial);
    button.position.set(0, 0.115, 0.01);
    button.castShadow = true;
    cap.add(button);

    // Visor / Brim extending straight forward
    const brimGeo = new THREE.CylinderGeometry(
      0.11,
      0.115,
      0.008,
      32,
      1,
      false,
      0,
      Math.PI * 0.65
    );
    const brim = new THREE.Mesh(brimGeo, silverCapMaterial);
    brim.rotation.y = Math.PI * 0.675;
    brim.rotation.x = 0.12;
    brim.position.set(0, 0.012, 0.065);
    brim.castShadow = true;
    cap.add(brim);

    hair.add(cap);
  }
};

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
          const character = gltf.scene;
          applyStyling(character);
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child: any) => {
            if (child.isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.frustumCulled = true;
            }
          });
          resolve(gltf);
          setCharTimeline(character, camera);
          setAllTimeline();
          const footR =
            character.getObjectByName("foot.R") ||
            character.getObjectByName("footR");
          if (footR) footR.position.y = 3.36;
          const footL =
            character.getObjectByName("foot.L") ||
            character.getObjectByName("footL");
          if (footL) footL.position.y = 3.36;
          dracoLoader.dispose();
        },
        undefined,
        (error) => reject(error)
      );
    });
  };

  const loadCharacter = async (): Promise<GLTF | null> => {
    // Attempt 1: Direct GLB load (fastest, standard unencrypted preview model)
    try {
      return await loadModelFromUrl("/models/character.glb");
    } catch (glbErr) {
      console.warn("Direct GLB load failed, trying encrypted model:", glbErr);
    }

    // Attempt 2: Decrypt .enc file (original MoncyDev encrypted pipeline)
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      return await loadModelFromUrl(blobUrl);
    } catch (encErr) {
      console.error("Both direct and encrypted character loads failed:", encErr);
      throw encErr;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
