import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const isMobile = aspect < 1;
      const camera = new THREE.PerspectiveCamera(
        isMobile ? 18 : 14.5,
        aspect,
        0.1,
        1000
      );
      camera.position.z = 10;
      if (isMobile) {
        camera.position.set(0, 13.5, 36);
      } else {
        camera.position.set(0, 13.1, 24.7);
      }
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let isProgressLoaded = false;
      const safeLoadProgress = (onComplete?: () => void) => {
        if (!isProgressLoaded) {
          isProgressLoaded = true;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              if (onComplete) onComplete();
            }, 2500);
          });
        }
      };

      const fallbackTimer = setTimeout(() => {
        console.warn("Triggering fallback progress completion");
        safeLoadProgress();
      }, 5000);

      let activeChar: THREE.Object3D | null = null;
      const onWindowResize = () => {
        if (activeChar) {
          handleResize(renderer, camera, canvasDiv, activeChar);
        }
      };
      window.addEventListener("resize", onWindowResize);

      loadCharacter()
        .then((gltf) => {
          clearTimeout(fallbackTimer);
          if (gltf) {
            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            let loadedChar = gltf.scene;
            activeChar = loadedChar;
            scene.add(loadedChar);
            headBone =
              loadedChar.getObjectByName("spine.006") ||
              loadedChar.getObjectByName("spine006") ||
              null;
            screenLight =
              loadedChar.getObjectByName("screenlight") ||
              loadedChar.getObjectByName("Glass.001") ||
              null;
            safeLoadProgress(() => {
              animations.startIntro();
            });
            handleResize(renderer, camera, canvasDiv, loadedChar);
          }
        })
        .catch((err) => {
          clearTimeout(fallbackTimer);
          console.error("Character failed to load:", err);
          safeLoadProgress();
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onWindowResize);
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
