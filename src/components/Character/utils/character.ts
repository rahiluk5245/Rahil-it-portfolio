import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

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
