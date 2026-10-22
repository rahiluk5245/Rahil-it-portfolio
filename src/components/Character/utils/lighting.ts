import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // 1. Warm-neutral Front Key Light (highlights face, teeth, and cap)
  const keyLight = new THREE.DirectionalLight(0xfff7ed, 0);
  keyLight.position.set(1.5, 14.5, 6.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  scene.add(keyLight);

  // 2. Vibrant Right Rim Light (Pink/Magenta - highlights right side of cap, ear, cheek)
  const pinkRimLight = new THREE.DirectionalLight(0xff2a8d, 0);
  pinkRimLight.position.set(5.0, 13.5, 0.5);
  scene.add(pinkRimLight);

  const pinkPointLight = new THREE.PointLight(0xff3399, 0, 25, 1.8);
  pinkPointLight.position.set(4.0, 13.0, 1.0);
  scene.add(pinkPointLight);

  // 3. Vibrant Back/Under Rim Light (Cyan/Teal - highlights neck, shoulders, and silhouette)
  const cyanBackLight = new THREE.PointLight(0x00e5ff, 0, 25, 1.5);
  cyanBackLight.position.set(0, 11.0, -3.0);
  scene.add(cyanBackLight);

  // 4. Soft Left Cool Fill Light
  const fillLight = new THREE.DirectionalLight(0x818cf8, 0);
  fillLight.position.set(-4.0, 13.5, 3.0);
  scene.add(fillLight);

  // 5. Directional Light & Point Light from original laptop scene
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.position.set(-0.47, -0.32, -1);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.65,
      duration: duration,
      ease: ease,
    });
    gsap.to(keyLight, {
      intensity: 1.8,
      duration: duration,
      ease: ease,
    });
    gsap.to(pinkRimLight, {
      intensity: 3.5,
      duration: duration,
      ease: ease,
    });
    gsap.to(pinkPointLight, {
      intensity: 4.0,
      duration: duration,
      ease: ease,
    });
    gsap.to(cyanBackLight, {
      intensity: 6.0,
      duration: duration,
      ease: ease,
    });
    gsap.to(fillLight, {
      intensity: 0.8,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 0.6,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
