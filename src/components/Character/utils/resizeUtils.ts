import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  const rect = canvasDiv.current.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const aspect = width / height;

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = aspect;

  // Adjust distance / FOV dynamically for mobile
  if (aspect < 1) {
    camera.position.set(0, 13.5, 36); // Pull back on mobile
    camera.fov = 18;
  } else {
    camera.position.set(0, 13.1, 24.7); // Default desktop position
    camera.fov = 14.5;
  }
  camera.updateProjectionMatrix();

  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger !== workTrigger) trigger.kill();
  });

  setCharTimeline(character, camera);
  setAllTimeline();
}
