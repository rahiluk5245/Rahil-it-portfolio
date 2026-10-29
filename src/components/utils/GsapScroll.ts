import * as THREE from "three";
import gsap from "gsap";

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  const tl1 = gsap.timeline({
    id: "char-tl1",
    scrollTrigger: {
      id: "char-trigger1",
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    id: "char-tl2",
    scrollTrigger: {
      id: "char-trigger2",
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    id: "char-tl3",
    scrollTrigger: {
      id: "char-trigger3",
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  let screenLight: any = null;
  let monitor: any = null;
  character?.traverse((object: any) => {
    if (
      object.name === "Plane.004" ||
      object.name === "Plane004" ||
      object.name === "monitor"
    ) {
      monitor = object;
      monitor.position.set(-0.0628, 9.0406, 5.1186);
      if (Array.isArray(object.material)) {
        object.material.forEach((mat: any) => {
          mat.transparent = true;
          mat.opacity = 0;
        });
      } else if (object.material) {
        object.material.transparent = true;
        object.material.opacity = 0;
      }
    }
    if (object.name === "screenlight" || object.name === "Glass.002") {
      screenLight = object;
      screenLight.position.set(-0.0531, 9.0411, 5.1217);
      if (object.material) {
        object.material.transparent = true;
        object.material.opacity = 0;
        if (object.material.emissive) {
          object.material.emissive.set("#5eead4");
          gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
            emissiveIntensity: () => intensity * 8,
            duration: () => Math.random() * 0.6,
            delay: () => Math.random() * 0.1,
          });
        }
      }
    }
  });
  let neckBone =
    character?.getObjectByName("spine.005") ||
    character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }

      if (monitor) {
        monitor.position.set(-0.0628, 9.0406, 5.1186);
        if (Array.isArray(monitor.material)) {
          monitor.material.forEach((mat: any) => {
            tl2.to(mat, { opacity: 1, duration: 1.2, delay: 3.0 }, 0);
          });
        } else if (monitor.material) {
          tl2.to(monitor.material, { opacity: 1, duration: 1.2, delay: 3.0 }, 0);
        }
      }
      if (screenLight) {
        screenLight.position.set(-0.0531, 9.0411, 5.1217);
        if (screenLight.material) {
          tl2.to(screenLight.material, { opacity: 1, duration: 1.2, delay: 3.2 }, 0);
        }
      }

      tl2.fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
        0.3
      );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    if (character) {
      if (monitor) {
        monitor.position.set(-0.0628, 9.0406, 5.1186);
        if (Array.isArray(monitor.material)) {
          monitor.material.forEach((mat: any) => {
            mat.transparent = true;
            mat.opacity = 0;
          });
        } else if (monitor.material) {
          monitor.material.transparent = true;
          monitor.material.opacity = 0;
        }
      }
      if (screenLight && screenLight.material) {
        screenLight.position.set(-0.0531, 9.0411, 5.1217);
        screenLight.material.transparent = true;
        screenLight.material.opacity = 0;
      }
    }
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
