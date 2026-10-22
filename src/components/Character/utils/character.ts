import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

// ============================================================================
// PROCEDURAL LUXURY TEXTURES
// ============================================================================

// 1. Bespoke Tailored Charcoal-Grey Wool Suiting Fabric Texture
const createSuitTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Heather charcoal grey base
  ctx.fillStyle = "#333842";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle organic wool heather mottling
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = Math.random() * 2 + 1;
    ctx.fillStyle =
      Math.random() > 0.5
        ? "rgba(255, 255, 255, 0.035)"
        : "rgba(10, 15, 25, 0.07)";
    ctx.fillRect(x, y, s, s);
  }

  // Fine 45-degree diagonal twill weave lines
  ctx.lineWidth = 1;
  for (let i = -512; i < 1024; i += 4) {
    ctx.strokeStyle =
      i % 8 === 0 ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 20, 30, 0.07)";
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
};

// 2. Executive Royal / Navy Blue Silk Patterned Tie Texture (Matching Reference)
const createTieTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Royal blue to deep navy silk gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, "#1d4ed8");
  grad.addColorStop(0.5, "#1e40af");
  grad.addColorStop(1, "#172554");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Micro-silk horizontal weave texture
  for (let y = 0; y < 1024; y += 3) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    ctx.fillRect(0, y, 512, 1);
  }

  // Elegant diagonal stripes (matching Gemini_Generated_Image and rahil.jpeg)
  const stripeSpacing = 44;
  for (let i = -1024; i < 2048; i += stripeSpacing) {
    // Crisp white/silver accent stripe
    ctx.strokeStyle = "rgba(248, 250, 252, 0.88)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1024, 1024);
    ctx.stroke();

    // Vibrant sky blue secondary pinstripe
    ctx.strokeStyle = "rgba(56, 189, 248, 0.82)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(i + 6, 0);
    ctx.lineTo(i + 1030, 1024);
    ctx.stroke();

    // Soft shadow edge for embossed silk ribbing
    ctx.strokeStyle = "rgba(10, 15, 30, 0.45)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(i - 4, 0);
    ctx.lineTo(i + 1020, 1024);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
};

// 3. Natural Black Hair Strand Specular Texture
const createHairTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0c0b10";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle directional hair strand highlights
  for (let i = 0; i < 512; i += 2) {
    const alpha = Math.random() * 0.12 + 0.02;
    ctx.strokeStyle = `rgba(45, 42, 58, ${alpha})`;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + (Math.random() - 0.5) * 8, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// ============================================================================
// 3D GEOMETRY GENERATORS
// ============================================================================

// 1. Signature Voluminous Swept-Up Pompadour / Quiff Hairstyle
const createPompadourHair = (hairMat: THREE.Material): THREE.Group => {
  const hairGroup = new THREE.Group();
  hairGroup.name = "PompadourHair";

  // a) Base Skull Shell (hugging top, sides, and back of skull)
  const skullGeo = new THREE.SphereGeometry(
    0.108,
    48,
    28,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.58
  );
  const skullMesh = new THREE.Mesh(skullGeo, hairMat);
  skullMesh.scale.set(1.02, 0.98, 1.05);
  skullMesh.position.set(0, 0.012, 0.005);
  skullMesh.castShadow = true;
  skullMesh.receiveShadow = true;
  hairGroup.add(skullMesh);

  // b) Tapered Back of Head & Nape
  const backGeo = new THREE.SphereGeometry(0.068, 32, 16);
  const backMesh = new THREE.Mesh(backGeo, hairMat);
  backMesh.scale.set(1.28, 1.05, 0.68);
  backMesh.position.set(0, -0.012, -0.078);
  backMesh.castShadow = true;
  hairGroup.add(backMesh);

  const napeGeo = new THREE.CylinderGeometry(0.058, 0.046, 0.05, 24);
  const napeMesh = new THREE.Mesh(napeGeo, hairMat);
  napeMesh.position.set(0, -0.065, -0.072);
  napeMesh.rotation.x = -0.15;
  hairGroup.add(napeMesh);

  // c) Side Tapers & Sideburns (Left & Right)
  const sideGeo = new THREE.SphereGeometry(0.058, 24, 16);
  const sideburnGeo = new THREE.BoxGeometry(0.012, 0.045, 0.024);

  // Left side taper & sideburn
  const leftSide = new THREE.Mesh(sideGeo, hairMat);
  leftSide.scale.set(0.42, 1.08, 1.35);
  leftSide.position.set(0.088, 0.018, -0.005);
  hairGroup.add(leftSide);

  const leftSideburn = new THREE.Mesh(sideburnGeo, hairMat);
  leftSideburn.position.set(0.096, -0.038, 0.032);
  leftSideburn.rotation.z = -0.12;
  hairGroup.add(leftSideburn);

  // Right side taper & sideburn
  const rightSide = new THREE.Mesh(sideGeo, hairMat);
  rightSide.scale.set(0.42, 1.08, 1.35);
  rightSide.position.set(-0.088, 0.018, -0.005);
  hairGroup.add(rightSide);

  const rightSideburn = new THREE.Mesh(sideburnGeo, hairMat);
  rightSideburn.position.set(-0.096, -0.038, 0.032);
  rightSideburn.rotation.z = 0.12;
  hairGroup.add(rightSideburn);

  // d) The Signature Voluminous Pompadour Quiff (Front Crest)
  // 1. Main Central Quiff Body (lifts up from forehead and sweeps backward)
  const quiffMainGeo = new THREE.SphereGeometry(0.076, 36, 24);
  const quiffMain = new THREE.Mesh(quiffMainGeo, hairMat);
  quiffMain.scale.set(0.96, 0.88, 1.28);
  quiffMain.position.set(0, 0.096, 0.048);
  quiffMain.rotation.x = -0.22;
  quiffMain.castShadow = true;
  hairGroup.add(quiffMain);

  // 2. Top Peak / Wave Crest
  const crestGeo = new THREE.SphereGeometry(0.062, 32, 20);
  const crestMesh = new THREE.Mesh(crestGeo, hairMat);
  crestMesh.scale.set(0.92, 0.72, 1.18);
  crestMesh.position.set(0, 0.128, 0.032);
  crestMesh.rotation.x = -0.16;
  crestMesh.castShadow = true;
  hairGroup.add(crestMesh);

  // 3. Left Front Wave Lobe (natural swept crest fullness on the left)
  const waveLeft = new THREE.Mesh(quiffMainGeo, hairMat);
  waveLeft.scale.set(0.7, 0.75, 1.05);
  waveLeft.position.set(0.042, 0.092, 0.048);
  waveLeft.rotation.set(-0.18, 0.14, -0.16);
  waveLeft.castShadow = true;
  hairGroup.add(waveLeft);

  // 4. Right Front Wave Lobe (natural swept crest fullness on the right)
  const waveRight = new THREE.Mesh(quiffMainGeo, hairMat);
  waveRight.scale.set(0.7, 0.75, 1.05);
  waveRight.position.set(-0.042, 0.092, 0.048);
  waveRight.rotation.set(-0.18, -0.14, 0.16);
  waveRight.castShadow = true;
  hairGroup.add(waveRight);

  // 5. Forehead Hairline Transition Brow
  const browGeo = new THREE.TorusGeometry(
    0.096,
    0.016,
    16,
    36,
    Math.PI * 0.72
  );
  const browMesh = new THREE.Mesh(browGeo, hairMat);
  browMesh.rotation.x = Math.PI * 0.42;
  browMesh.rotation.z = -Math.PI * 0.36;
  browMesh.position.set(0, 0.044, 0.046);
  hairGroup.add(browMesh);

  return hairGroup;
};

// 2. Sculpted 3D Groomed Mustache Mesh (Matching Reference Photo & Avatar)
const createMustache = (hairMat: THREE.Material): THREE.Group => {
  const mustacheGroup = new THREE.Group();
  mustacheGroup.name = "Mustache";

  const wingGeo = new THREE.CylinderGeometry(0.007, 0.003, 0.026, 16);

  // Left wing of mustache
  const leftWing = new THREE.Mesh(wingGeo, hairMat);
  leftWing.position.set(0.016, -0.125, 0.082);
  leftWing.rotation.set(0.24, 0.28, -Math.PI * 0.44);
  leftWing.scale.set(1.0, 1.0, 0.55);
  leftWing.castShadow = true;
  mustacheGroup.add(leftWing);

  // Right wing of mustache
  const rightWing = new THREE.Mesh(wingGeo, hairMat);
  rightWing.position.set(-0.016, -0.125, 0.082);
  rightWing.rotation.set(0.24, -0.28, Math.PI * 0.44);
  rightWing.scale.set(1.0, 1.0, 0.55);
  rightWing.castShadow = true;
  mustacheGroup.add(rightWing);

  // Center arch under philtrum
  const centerGeo = new THREE.SphereGeometry(0.0065, 16, 12);
  const centerMesh = new THREE.Mesh(centerGeo, hairMat);
  centerMesh.scale.set(1.4, 0.85, 0.5);
  centerMesh.position.set(0, -0.122, 0.083);
  centerMesh.castShadow = true;
  mustacheGroup.add(centerMesh);

  return mustacheGroup;
};

// 3. Bespoke Tailored Executive Suit (Suit Notch Lapels, White Dress Shirt, Tie, Pocket Square, Buttons)
const createExecutiveSuit = (
  suitMat: THREE.Material,
  lapelMat: THREE.Material,
  whiteShirtMat: THREE.Material,
  tieMat: THREE.Material
): THREE.Group => {
  const suitGroup = new THREE.Group();
  suitGroup.name = "ExecutiveSuit";

  // 1. Crisp White Dress Shirt Inset Panel (fills the V of the suit jacket)
  const shirtShape = new THREE.Shape();
  shirtShape.moveTo(-0.24, 0); // top left (neck)
  shirtShape.lineTo(0.24, 0); // top right (neck)
  shirtShape.lineTo(0.04, -1.35); // bottom right (closure)
  shirtShape.lineTo(-0.04, -1.35); // bottom left (closure)
  shirtShape.closePath();

  const shirtPanelGeo = new THREE.ExtrudeGeometry(shirtShape, {
    depth: 0.015,
    bevelEnabled: false,
  });
  const shirtPanel = new THREE.Mesh(shirtPanelGeo, whiteShirtMat);
  shirtPanel.position.set(0, 11.66, 0.28);
  shirtPanel.rotation.x = 0.22; // follow chest slope
  suitGroup.add(shirtPanel);

  // 2. Structured White Dress Shirt Spread Collar Points
  const leftCollarShape = new THREE.Shape();
  leftCollarShape.moveTo(0, 0);
  leftCollarShape.lineTo(0.16, -0.06);
  leftCollarShape.lineTo(0.06, -0.22);
  leftCollarShape.lineTo(0, -0.12);
  leftCollarShape.closePath();

  const rightCollarShape = new THREE.Shape();
  rightCollarShape.moveTo(0, 0);
  rightCollarShape.lineTo(-0.16, -0.06);
  rightCollarShape.lineTo(-0.06, -0.22);
  rightCollarShape.lineTo(0, -0.12);
  rightCollarShape.closePath();

  const collarExtrudeOptions = {
    depth: 0.012,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
  };

  // Left collar point
  const leftCollar = new THREE.Mesh(
    new THREE.ExtrudeGeometry(leftCollarShape, collarExtrudeOptions),
    whiteShirtMat
  );
  leftCollar.position.set(0.06, 11.62, 0.32);
  leftCollar.rotation.set(0.38, -0.15, -0.22);
  suitGroup.add(leftCollar);

  // Right collar point
  const rightCollar = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rightCollarShape, collarExtrudeOptions),
    whiteShirtMat
  );
  rightCollar.position.set(-0.06, 11.62, 0.32);
  rightCollar.rotation.set(0.38, 0.15, 0.22);
  suitGroup.add(rightCollar);

  // White shirt collar band wrapping around neck base
  const neckBandGeo = new THREE.TorusGeometry(0.35, 0.022, 16, 48);
  const neckBand = new THREE.Mesh(neckBandGeo, whiteShirtMat);
  neckBand.rotation.x = Math.PI * 0.52;
  neckBand.position.set(0, 11.62, -0.05);
  neckBand.scale.set(1.05, 0.94, 1.0);
  suitGroup.add(neckBand);

  // 3. Executive Tie
  // a) Windsor Tie Knot (tapered inverted trapezoid nestled at collar)
  const knotGeo = new THREE.CylinderGeometry(0.068, 0.046, 0.12, 16);
  const tieKnot = new THREE.Mesh(knotGeo, tieMat);
  tieKnot.position.set(0, 11.44, 0.44);
  tieKnot.rotation.x = 0.25;
  tieKnot.scale.set(1.15, 1.0, 0.65);
  tieKnot.castShadow = true;
  suitGroup.add(tieKnot);

  // b) Tie Blade (drapes down the center chest with sharp diamond point)
  const tieShape = new THREE.Shape();
  tieShape.moveTo(-0.055, 0);
  tieShape.lineTo(0.055, 0);
  tieShape.lineTo(0.075, -1.25);
  tieShape.lineTo(0, -1.52); // diamond tip
  tieShape.lineTo(-0.075, -1.25);
  tieShape.closePath();

  const tieBladeGeo = new THREE.ExtrudeGeometry(tieShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  });
  const tieBlade = new THREE.Mesh(tieBladeGeo, tieMat);
  tieBlade.position.set(0, 11.38, 0.44);
  tieBlade.rotation.x = 0.22;
  tieBlade.castShadow = true;
  suitGroup.add(tieBlade);

  // 4. Tailored Suit Notch Lapels (Left and Right with authentic notch geometry)
  const leftLapelShape = new THREE.Shape();
  leftLapelShape.moveTo(0.16, 0); // top neck
  leftLapelShape.lineTo(0.38, -0.42); // upper notch point
  leftLapelShape.lineTo(0.31, -0.47); // notch cutout inner
  leftLapelShape.lineTo(0.42, -0.72); // lower notch corner
  leftLapelShape.lineTo(0.06, -1.45); // bottom closure
  leftLapelShape.lineTo(0.02, -1.45); // inner edge at closure
  leftLapelShape.lineTo(0.12, 0); // inner edge at neck
  leftLapelShape.closePath();

  const rightLapelShape = new THREE.Shape();
  rightLapelShape.moveTo(-0.16, 0);
  rightLapelShape.lineTo(-0.38, -0.42);
  rightLapelShape.lineTo(-0.31, -0.47);
  rightLapelShape.lineTo(-0.42, -0.72);
  rightLapelShape.lineTo(-0.06, -1.45);
  rightLapelShape.lineTo(-0.02, -1.45);
  rightLapelShape.lineTo(-0.12, 0);
  rightLapelShape.closePath();

  const lapelExtrudeOptions = {
    depth: 0.022,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  };

  // Left notch lapel
  const leftLapel = new THREE.Mesh(
    new THREE.ExtrudeGeometry(leftLapelShape, lapelExtrudeOptions),
    lapelMat
  );
  leftLapel.position.set(0, 11.66, 0.32);
  leftLapel.rotation.x = 0.23;
  leftLapel.castShadow = true;
  suitGroup.add(leftLapel);

  // Right notch lapel
  const rightLapel = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rightLapelShape, lapelExtrudeOptions),
    lapelMat
  );
  rightLapel.position.set(0, 11.66, 0.32);
  rightLapel.rotation.x = 0.23;
  rightLapel.castShadow = true;
  suitGroup.add(rightLapel);

  // Suit jacket collar roll wrapping around back of neck
  const jacketCollarGeo = new THREE.TorusGeometry(
    0.375,
    0.028,
    16,
    48,
    Math.PI * 1.05
  );
  const jacketCollar = new THREE.Mesh(jacketCollarGeo, suitMat);
  jacketCollar.rotation.x = Math.PI * 0.54;
  jacketCollar.rotation.z = -Math.PI * 0.52;
  jacketCollar.position.set(0, 11.64, -0.06);
  jacketCollar.scale.set(1.08, 0.96, 1.0);
  suitGroup.add(jacketCollar);

  // 5. Breast Pocket Welt & Folded Silk Pocket Square (Left Chest)
  const pocketBarGeo = new THREE.BoxGeometry(0.18, 0.024, 0.022);
  const pocketBar = new THREE.Mesh(pocketBarGeo, suitMat);
  pocketBar.position.set(0.48, 10.82, 0.56);
  pocketBar.rotation.set(0.24, 0.08, 0.12);
  pocketBar.castShadow = true;
  suitGroup.add(pocketBar);

  // Crisp White Pocket Square (two peaks fold peeking out)
  const psShape = new THREE.Shape();
  psShape.moveTo(-0.06, 0);
  psShape.lineTo(-0.02, 0.055); // peak 1
  psShape.lineTo(0.01, 0.025);
  psShape.lineTo(0.05, 0.065); // peak 2
  psShape.lineTo(0.07, 0);
  psShape.closePath();

  const psGeo = new THREE.ExtrudeGeometry(psShape, {
    depth: 0.008,
    bevelEnabled: false,
  });
  const pocketSquare = new THREE.Mesh(psGeo, whiteShirtMat);
  pocketSquare.position.set(0.47, 10.83, 0.57);
  pocketSquare.rotation.set(0.24, 0.08, 0.12);
  suitGroup.add(pocketSquare);

  // 6. Suit Closure Buttons (Dark Horn with Metallic Sheen)
  const buttonGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.008, 20);
  const buttonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1a1d24"),
    roughness: 0.35,
    metalness: 0.45,
  });

  const button1 = new THREE.Mesh(buttonGeo, buttonMat);
  button1.rotation.x = Math.PI * 0.5 + 0.22;
  button1.position.set(0.02, 10.18, 0.72);
  suitGroup.add(button1);

  const button2 = new THREE.Mesh(buttonGeo, buttonMat);
  button2.rotation.x = Math.PI * 0.5 + 0.22;
  button2.position.set(0.02, 9.78, 0.76);
  suitGroup.add(button2);

  return suitGroup;
};

// ============================================================================
// CHARACTER STYLING APPLICATION
// ============================================================================

const applyStyling = (character: THREE.Object3D) => {
  // 1. Textures
  const suitTexture = createSuitTexture();
  const tieTexture = createTieTexture();
  const hairTexture = createHairTexture();

  // 2. Materials
  // Warm golden-tan Indian skin tone (#9e6345)
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#9e6345"),
    roughness: 0.52,
    metalness: 0.02,
  });

  // Tailored charcoal grey wool suit jacket
  const suitMaterial = new THREE.MeshStandardMaterial({
    map: suitTexture,
    color: new THREE.Color("#353b45"),
    roughness: 0.76,
    metalness: 0.03,
    side: THREE.DoubleSide,
  });

  // Tailored suit notch lapels (slightly richer contrast tone)
  const lapelMaterial = new THREE.MeshStandardMaterial({
    map: suitTexture,
    color: new THREE.Color("#2d333d"),
    roughness: 0.72,
    metalness: 0.03,
    side: THREE.DoubleSide,
  });

  // Crisp white dress shirt
  const whiteShirtMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#f8fafc"),
    roughness: 0.5,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  // Executive royal/navy blue silk tie
  const tieMaterial = new THREE.MeshStandardMaterial({
    map: tieTexture,
    color: new THREE.Color("#1e3a8a"),
    roughness: 0.32,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  // Deep natural black hair & eyebrows
  const hairMaterial = new THREE.MeshStandardMaterial({
    map: hairTexture,
    color: new THREE.Color("#0c0b10"),
    roughness: 0.42,
    metalness: 0.06,
  });

  // Tailored charcoal trousers
  const pantMaterial = new THREE.MeshStandardMaterial({
    map: suitTexture,
    color: new THREE.Color("#242831"),
    roughness: 0.82,
    metalness: 0.02,
  });

  // Polished black leather executive dress shoes
  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0c0c0e"),
    roughness: 0.22,
    metalness: 0.08,
  });

  const soleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141416"),
    roughness: 0.9,
    metalness: 0.02,
  });

  // 3. Mesh Traversals & Dynamic Vertex Coloring
  character.traverse((child: any) => {
    if (child.isMesh) {
      const name = child.name;

      if (name === "Plane.007") {
        // Head mesh: dynamically apply vertex colors
        const geom = child.geometry;
        if (geom && geom.attributes.position) {
          const pos = geom.attributes.position;
          const norm = geom.attributes.normal;
          const count = pos.count;
          const colors = new Float32Array(count * 3);

          const skinColor = new THREE.Color("#9e6345");
          const teethColor = new THREE.Color("#ffffff");
          const cavityColor = new THREE.Color("#120d10");
          const lipColor = new THREE.Color("#9b5a4d");
          const mustacheBaseColor = new THREE.Color("#251b16");
          const stubbleColor = new THREE.Color("#6c4636");

          for (let i = 0; i < count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const nz = norm ? norm.getZ(i) : 0;

            if (
              y >= 12.43 &&
              y <= 12.6 &&
              Math.abs(x) <= 0.36 &&
              z >= 0.81 &&
              z <= 0.9 &&
              nz > 0.65
            ) {
              // Gleaming white teeth
              colors[i * 3] = teethColor.r;
              colors[i * 3 + 1] = teethColor.g;
              colors[i * 3 + 2] = teethColor.b;
            } else if (
              y >= 12.4 &&
              y <= 12.62 &&
              Math.abs(x) <= 0.38 &&
              z >= 0.7 &&
              z <= 0.86
            ) {
              // Deep mouth cavity
              colors[i * 3] = cavityColor.r;
              colors[i * 3 + 1] = cavityColor.g;
              colors[i * 3 + 2] = cavityColor.b;
            } else if (
              y >= 12.61 &&
              y <= 12.68 &&
              Math.abs(x) <= 0.32 &&
              z >= 0.88
            ) {
              // Natural lips
              colors[i * 3] = lipColor.r;
              colors[i * 3 + 1] = lipColor.g;
              colors[i * 3 + 2] = lipColor.b;
            } else if (
              y >= 12.68 &&
              y <= 12.82 &&
              Math.abs(x) <= 0.34 &&
              z >= 0.91 &&
              nz > 0.2
            ) {
              // Groomed mustache base shadow
              colors[i * 3] = mustacheBaseColor.r;
              colors[i * 3 + 1] = mustacheBaseColor.g;
              colors[i * 3 + 2] = mustacheBaseColor.b;
            } else if (
              y >= 12.18 &&
              y <= 12.38 &&
              Math.abs(x) <= 0.22 &&
              z >= 0.78
            ) {
              // Subtle chin stubble / goatee shadow
              colors[i * 3] = stubbleColor.r;
              colors[i * 3 + 1] = stubbleColor.g;
              colors[i * 3 + 2] = stubbleColor.b;
            } else {
              // Warm tan skin
              colors[i * 3] = skinColor.r;
              colors[i * 3 + 1] = skinColor.g;
              colors[i * 3 + 2] = skinColor.b;
            }
          }

          geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          child.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.52,
            metalness: 0.02,
          });
        } else {
          child.material = skinMaterial;
        }
      } else if (
        name.includes("Ear") ||
        name.includes("Neck") ||
        name.includes("Hand")
      ) {
        child.material = skinMaterial;
      } else if (name === "EYEs.001") {
        // Expressive dark eyes with clearcoat sheen
        if (child.material) {
          child.material.color = new THREE.Color("#181412");
          child.material.roughness = 0.06;
          child.material.metalness = 0.0;
        }
      } else if (name.includes("SHIRT") || name === "BODY.SHIRT") {
        child.material = suitMaterial;
      } else if (name.includes("Eyebrow")) {
        child.material = hairMaterial;
      } else if (name === "hair") {
        // Clear placeholder mesh geometry without hiding bone hierarchy
        child.geometry = new THREE.BufferGeometry();
      } else if (name.includes("Pant")) {
        child.material = pantMaterial;
      } else if (name.includes("Shoe")) {
        child.material = shoeMaterial;
      } else if (name.includes("Sole")) {
        child.material = soleMaterial;
      }
    }
  });

  // 4. Attach Pompadour Hairstyle & 3D Groomed Mustache to the hair bone
  const hair = character.getObjectByName("hair");
  if (hair) {
    const oldCap = hair.getObjectByName("BaseballCap");
    if (oldCap) hair.remove(oldCap);

    if (!hair.getObjectByName("PompadourHair")) {
      const pompadour = createPompadourHair(hairMaterial);
      hair.add(pompadour);
    }

    if (!hair.getObjectByName("Mustache")) {
      const mustache = createMustache(hairMaterial);
      hair.add(mustache);
    }
  }

  // 5. Attach Bespoke Executive Suit (Notch Lapels, Dress Shirt, Tie, Pocket Square, Buttons)
  const oldCollar = character.getObjectByName("ShirtCollar");
  if (oldCollar) character.remove(oldCollar);

  const oldSuit = character.getObjectByName("ExecutiveSuit");
  if (oldSuit) character.remove(oldSuit);

  const executiveSuit = createExecutiveSuit(
    suitMaterial,
    lapelMaterial,
    whiteShirtMaterial,
    tieMaterial
  );
  character.add(executiveSuit);
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
          try {
            const character = gltf.scene;

            try {
              applyStyling(character);
            } catch (styleErr) {
              console.error("applyStyling error:", styleErr);
            }

            // Safe pre-compilation (guarded with a 500ms timeout so it NEVER blocks the page)
            try {
              if (renderer && renderer.compileAsync) {
                await Promise.race([
                  renderer.compileAsync(character, camera, scene),
                  new Promise((res) => setTimeout(res, 500)),
                ]);
              }
            } catch (compileErr) {
              console.warn("Pre-compilation skipped:", compileErr);
            }

            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            resolve(gltf);

            try {
              setCharTimeline(character, camera);
              setAllTimeline();
            } catch (tlErr) {
              console.warn("Timeline initialization warning:", tlErr);
            }

            const footR =
              character.getObjectByName("foot.R") ||
              character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL =
              character.getObjectByName("foot.L") ||
              character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;
          } catch (err) {
            console.error("Error in loadModelFromUrl processing:", err);
            reject(err);
          }
        },
        undefined,
        (error) => {
          console.error("GLTF load error:", error);
          reject(error);
        }
      );
    });
  };

  const loadCharacter = async (): Promise<GLTF | null> => {
    // Attempt 1: Direct GLB load
    try {
      return await loadModelFromUrl("/models/character.glb");
    } catch (glbErr) {
      console.warn("Direct GLB load failed, trying encrypted model:", glbErr);
    }

    // Attempt 2: Decrypt .enc file
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      return await loadModelFromUrl(blobUrl);
    } catch (encErr) {
      console.error(
        "Both direct and encrypted character loads failed:",
        encErr
      );
      throw encErr;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
