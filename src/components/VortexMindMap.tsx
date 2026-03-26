import { cn } from "@jokuh/gooey";
import { useEffect, useRef, useState } from "react";
import type { MindNode } from "./vortexMindMapData";
import { VORTEX_MIND_MAP, VORTEX_PALETTE } from "./vortexMindMapData";

type GraphNode = {
  id: string;
  label: string;
  category: string;
  desc: string;
  depth: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  collapsed: boolean;
  childrenIds: string[];
  parentId: string | null;
  visible: boolean;
  pulsePhase: number;
  mesh: import("three/webgpu").Mesh | null;
  glowMesh: import("three/webgpu").Mesh | null;
  labelSprite: import("three/webgpu").Sprite | null;
  indicatorMesh: import("three/webgpu").Mesh | null;
  indicatorRadius?: number;
  currentScale: number;
  scaleTarget: number;
  _glowScale: number;
  _hoverFactor?: number;
};

type GraphLink = {
  source: string;
  target: string;
  line: import("three/webgpu").Line;
  particle: import("three/webgpu").Mesh;
};

function buildGraph(
  data: MindNode,
  parent: GraphNode | null,
  depth: number,
  theta: number,
  phi: number,
  spread: number,
  nodes: GraphNode[],
  links: GraphLink[],
  nodeMap: Record<string, GraphNode>,
): void {
  const node: GraphNode = {
    id: data.id,
    label: data.label,
    category: data.category,
    desc: data.desc ?? "",
    depth,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    radius: depth === 0 ? 12 : depth === 1 ? 8 : depth === 2 ? 5.5 : 4,
    collapsed: depth >= 2,
    childrenIds: [],
    parentId: parent ? parent.id : null,
    visible: depth < 3,
    pulsePhase: Math.random() * Math.PI * 2,
    mesh: null,
    glowMesh: null,
    labelSprite: null,
    indicatorMesh: null,
    currentScale: 0.01,
    scaleTarget: 1,
    _glowScale: 2,
  };

  if (depth === 0) {
    node.x = 0;
    node.y = 0;
    node.z = 0;
  } else if (parent) {
    const dist = depth === 1 ? 120 : depth === 2 ? 70 : 50;
    node.x = parent.x + Math.sin(theta) * Math.cos(phi) * dist + (Math.random() - 0.5) * 20;
    node.y = parent.y + Math.cos(theta) * dist * 0.6 + (Math.random() - 0.5) * 20;
    node.z = parent.z + Math.sin(theta) * Math.sin(phi) * dist + (Math.random() - 0.5) * 20;
  }

  nodes.push(node);
  nodeMap[node.id] = node;

  if (parent) {
    links.push({
      source: parent.id,
      target: node.id,
      line: null as unknown as GraphLink["line"],
      particle: null as unknown as GraphLink["particle"],
    });
    parent.childrenIds.push(node.id);
  }

  if (data.children) {
    const childCount = data.children.length;
    data.children.forEach((child, i) => {
      let childTheta: number;
      let childPhi: number;
      if (depth === 0) {
        childTheta = (i / childCount) * Math.PI * 2;
        childPhi = (Math.random() - 0.5) * Math.PI * 0.5;
      } else {
        const arc = spread * 0.7;
        childTheta = theta - arc / 2 + (arc / Math.max(1, childCount - 1)) * i;
        childPhi = phi + (Math.random() - 0.5) * 0.6;
      }
      buildGraph(child, node, depth + 1, childTheta, childPhi, spread / childCount, nodes, links, nodeMap);
    });
  }
}

function getDescendants(node: GraphNode, nodes: GraphNode[]): GraphNode[] {
  let result: GraphNode[] = [];
  nodes.forEach((n) => {
    if (n.parentId === node.id) {
      result.push(n);
      result = result.concat(getDescendants(n, nodes));
    }
  });
  return result;
}

export function VortexMindMap({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [webgpuOk, setWebgpuOk] = useState(true);
  const [physicsPaused, setPhysicsPaused] = useState(false);
  const physicsRef = useRef(true);

  useEffect(() => {
    physicsRef.current = !physicsPaused;
  }, [physicsPaused]);

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    let disposed = false;
    let rendererInst: InstanceType<Awaited<typeof import("three/webgpu")>["WebGPURenderer"]> | null =
      null;
    let controlsInst: InstanceType<Awaited<typeof import("three/addons/controls/OrbitControls.js")>["OrbitControls"]> | null =
      null;
    let roInst: ResizeObserver | null = null;
    const removeListeners: Array<() => void> = [];

    void (async () => {
      const THREE = await import("three/webgpu");
      const { pass, mrt, output, emissive } = await import("three/tsl");
      const { bloom } = await import("three/addons/tsl/display/BloomNode.js");
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
      const { RGBELoader } = await import("three/addons/loaders/RGBELoader.js");

      if (disposed || !rootRef.current) return;

      const materialCache: Record<string, InstanceType<typeof THREE.MeshStandardMaterial>> = {};
      const glowMaterialCache: Record<string, InstanceType<typeof THREE.MeshBasicMaterial>> = {};
      const linkMaterialCache: Record<string, InstanceType<typeof THREE.LineBasicMaterial>> = {};

      const getPalette = (category: string) => VORTEX_PALETTE[category] ?? VORTEX_PALETTE.root;

      const mkNodeMat = (category: string) => {
        const p = getPalette(category);
        return new THREE.MeshStandardMaterial({
          color: p.bg,
          emissive: p.bg,
          emissiveIntensity: 0.35,
          roughness: 0.3,
          metalness: 0.1,
        });
      };

      const mkGlowMat = (category: string) => {
        const p = getPalette(category);
        return new THREE.MeshBasicMaterial({
          color: p.bg,
          transparent: true,
          opacity: 0.05,
          side: THREE.BackSide,
        });
      };

      const mkLinkMat = (category: string) => {
        const p = getPalette(category);
        return new THREE.LineBasicMaterial({
          color: p.bg,
          transparent: true,
          opacity: 0.3,
        });
      };

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0f);

      const w0 = container.clientWidth || 640;
      const h0 = container.clientHeight || 480;
      const camera = new THREE.PerspectiveCamera(60, w0 / h0, 0.1, 2000);
      camera.position.set(0, 150, 400);

      let renderer: InstanceType<typeof THREE.WebGPURenderer>;
      try {
        renderer = new THREE.WebGPURenderer({ antialias: true });
        renderer.setSize(w0, h0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        const canvas = renderer.domElement;
        Object.assign(canvas.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: "0",
        });
        container.appendChild(canvas);
      } catch {
        setWebgpuOk(false);
        return;
      }

      if (disposed) {
        renderer.dispose();
        return;
      }

      rendererInst = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsInst = controls;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 80;
      controls.maxDistance = 900;
      controls.target.set(0, 0, 0);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      ambientLight.name = "ambientLight";
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.name = "dirLight";
      dirLight.position.set(100, 200, 150);
      scene.add(dirLight);
      const dirLight2 = new THREE.DirectionalLight(0x6688ff, 0.3);
      dirLight2.name = "dirLight2";
      dirLight2.position.set(-100, -50, -100);
      scene.add(dirLight2);

      new RGBELoader().load(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonless_golf_1k.hdr",
        (hdrTexture: any) => {
          hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = hdrTexture;
          scene.backgroundBlurriness = 0;
          scene.backgroundIntensity = 0;
          scene.environment = hdrTexture;
          scene.environmentIntensity = 0.6;
        },
        undefined,
        () => {
          new RGBELoader().load(
            "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/starry_sky_1k.hdr",
            (hdrTexture: any) => {
              hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
              scene.background = hdrTexture;
              scene.environment = hdrTexture;
              scene.environmentIntensity = 0.6;
            },
            undefined,
            () => {},
          );
        },
      );

      let nodes: GraphNode[] = [];
      let links: GraphLink[] = [];
      const nodeMap: Record<string, GraphNode> = {};

      const relinkArrays = () => {
        nodes = [];
        links = [];
        Object.keys(nodeMap).forEach((k) => delete nodeMap[k]);
        buildGraph(VORTEX_MIND_MAP, null, 0, 0, 0, Math.PI * 2, nodes, links, nodeMap);
      };
      relinkArrays();

      const sphereGeoHigh = new THREE.SphereGeometry(1, 32, 32);
      const sphereGeoLow = new THREE.SphereGeometry(1, 16, 16);

      function createLabelTexture(text: string) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2d");
        const lines = text.split("\n");
        const fontSize = 48;
        canvas.width = 512;
        canvas.height = 128 * Math.max(1, lines.length);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        const lineH = fontSize * 1.3;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineH) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, canvas.width / 2, startY + i * lineH);
        });
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
      }

      const nodesGroup = new THREE.Group();
      scene.add(nodesGroup);
      const linksGroup = new THREE.Group();
      scene.add(linksGroup);

      function rebuildMeshes() {
        while (nodesGroup.children.length) nodesGroup.remove(nodesGroup.children[0]);
        while (linksGroup.children.length) linksGroup.remove(linksGroup.children[0]);
        Object.keys(materialCache).forEach((k) => delete materialCache[k]);
        Object.keys(glowMaterialCache).forEach((k) => delete glowMaterialCache[k]);
        Object.keys(linkMaterialCache).forEach((k) => delete linkMaterialCache[k]);

        nodes.forEach((node) => {
          const geo = node.depth <= 1 ? sphereGeoHigh : sphereGeoLow;
          const mat = mkNodeMat(node.category);
          materialCache[node.category] = mat;
          const mesh = new THREE.Mesh(geo, mat);
          mesh.scale.setScalar(node.radius);
          mesh.position.set(node.x, node.y, node.z);
          mesh.userData.nodeId = node.id;
          nodesGroup.add(mesh);
          node.mesh = mesh;

          const glowMat = mkGlowMat(node.category);
          glowMaterialCache[node.category] = glowMat;
          const glowMesh = new THREE.Mesh(geo, glowMat);
          glowMesh.scale.setScalar(node.radius * 2.5);
          glowMesh.position.copy(mesh.position);
          nodesGroup.add(glowMesh);
          node.glowMesh = glowMesh;

          const labelTex = createLabelTexture(node.label);
          const spriteMat = new THREE.SpriteMaterial({
            map: labelTex,
            transparent: true,
            depthWrite: false,
            sizeAttenuation: true,
          });
          const sprite = new THREE.Sprite(spriteMat);
          const aspect = labelTex.image.width / labelTex.image.height;
          const spriteH = node.depth === 0 ? 16 : node.depth === 1 ? 11 : 8;
          sprite.scale.set(spriteH * aspect, spriteH, 1);
          sprite.position.set(node.x, node.y + node.radius + spriteH * 0.6, node.z);
          nodesGroup.add(sprite);
          node.labelSprite = sprite;

          const vis = node.visible;
          mesh.visible = vis;
          glowMesh.visible = vis;
          sprite.visible = vis;
          node.currentScale = vis ? 1 : 0.01;
          if (!vis) {
            mesh.scale.setScalar(0.01);
            glowMesh.scale.setScalar(0.01);
            sprite.scale.setScalar(0.01);
          }
        });

        nodes.forEach((node) => {
          const hasChildren = nodes.some((n) => n.parentId === node.id);
          if (hasChildren) {
            const indicatorGeo = new THREE.SphereGeometry(1, 12, 12);
            const indicatorMat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 1,
            });
            const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
            const ir = node.depth === 0 ? 3 : 2;
            indicator.scale.setScalar(ir);
            indicator.visible = node.visible;
            nodesGroup.add(indicator);
            node.indicatorMesh = indicator;
            node.indicatorRadius = ir;
          }
        });

        links.forEach((link) => {
          const s = nodeMap[link.source];
          const t = nodeMap[link.target];
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(s.x, s.y, s.z),
            new THREE.Vector3((s.x + t.x) / 2, (s.y + t.y) / 2 + 10, (s.z + t.z) / 2),
            new THREE.Vector3(t.x, t.y, t.z),
          );
          const points = curve.getPoints(20);
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mat = mkLinkMat(t.category);
          linkMaterialCache[`${link.source}-${link.target}`] = mat;
          const line = new THREE.Line(geo, mat);
          line.visible = s.visible && t.visible;
          linksGroup.add(line);
          link.line = line;

          const particleGeo = new THREE.SphereGeometry(1.2, 8, 8);
          const particleMat = new THREE.MeshBasicMaterial({
            color: getPalette(t.category).bg,
            transparent: true,
            opacity: 0.6,
          });
          const particle = new THREE.Mesh(particleGeo, particleMat);
          particle.visible = s.visible && t.visible;
          linksGroup.add(particle);
          link.particle = particle;
        });
      }

      rebuildMeshes();

      const particleCount = 400;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 800;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      }
      const ambientParticleGeo = new THREE.BufferGeometry();
      ambientParticleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const ambientParticleMat = new THREE.PointsMaterial({
        color: 0x6688cc,
        size: 3,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      });
      const ambientParticles = new THREE.Points(ambientParticleGeo, ambientParticleMat);
      scene.add(ambientParticles);

      let hoveredNode: GraphNode | null = null;
      let draggedNode: GraphNode | null = null;
      const dragPlane = new THREE.Plane();
      const dragOffset = new THREE.Vector3();
      let clickStartTime = 0;
      let isDragging = false;
      let tooltipTimer: ReturnType<typeof setTimeout> | null = null;
      let tooltipReady = false;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function getIntersectedNode(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const meshes = nodes.filter((n) => n.visible).map((n) => n.mesh!);
        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const nodeId = intersects[0].object.userData.nodeId as string;
          return nodeMap[nodeId];
        }
        return null;
      }

      function toggleNode(node: GraphNode) {
        const directChildren = nodes.filter((n) => n.parentId === node.id);
        if (directChildren.length === 0) return;
        if (!directChildren[0].visible) {
          directChildren.forEach((c) => {
            c.visible = true;
            c.x = node.x + (Math.random() - 0.5) * 30;
            c.y = node.y + (Math.random() - 0.5) * 30;
            c.z = node.z + (Math.random() - 0.5) * 30;
            c.currentScale = 0.01;
            c.scaleTarget = 1;
          });
          node.collapsed = false;
        } else {
          const descendants = getDescendants(node, nodes);
          descendants.forEach((c) => {
            c.visible = false;
            c.collapsed = true;
            c.scaleTarget = 0.01;
          });
          node.collapsed = true;
        }
      }

      function simulate() {
        if (!physicsRef.current) return;
        const visibleNodes = nodes.filter((n) => n.visible);
        for (let i = 0; i < visibleNodes.length; i++) {
          for (let j = i + 1; j < visibleNodes.length; j++) {
            const a = visibleNodes[i];
            const b = visibleNodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dz = a.z - b.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
            const minDist = (a.radius + b.radius) * 5;
            if (dist < minDist) {
              const force = ((minDist - dist) / dist) * 0.4;
              a.vx += dx * force * 0.1;
              a.vy += dy * force * 0.1;
              a.vz += dz * force * 0.1;
              b.vx -= dx * force * 0.1;
              b.vy -= dy * force * 0.1;
              b.vz -= dz * force * 0.1;
            }
          }
        }
        links.forEach((link) => {
          const s = nodeMap[link.source];
          const t = nodeMap[link.target];
          if (!s.visible || !t.visible) return;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dz = t.z - s.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const idealDist = s.depth === 0 ? 120 : s.depth === 1 ? 80 : 55;
          const force = ((dist - idealDist) / dist) * 0.02;
          s.vx += dx * force;
          s.vy += dy * force;
          s.vz += dz * force;
          t.vx -= dx * force;
          t.vy -= dy * force;
          t.vz -= dz * force;
        });
        const rootNode = nodeMap.root;
        if (rootNode) {
          rootNode.vx += (0 - rootNode.x) * 0.01;
          rootNode.vy += (0 - rootNode.y) * 0.01;
          rootNode.vz += (0 - rootNode.z) * 0.01;
        }
        visibleNodes.forEach((n) => {
          if (n === draggedNode) return;
          n.vx *= 0.88;
          n.vy *= 0.88;
          n.vz *= 0.88;
          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;
          const speed = Math.abs(n.vx) + Math.abs(n.vy) + Math.abs(n.vz);
          if (speed < 0.3) {
            const time = performance.now() * 0.001;
            const p = n.pulsePhase;
            n.x += Math.sin(time * 0.4 + p) * 0.04;
            n.y += Math.cos(time * 0.3 + p * 1.3) * 0.06;
            n.z += Math.sin(time * 0.35 + p * 0.7) * 0.04;
          }
        });
      }

      const tooltipEl = tooltipRef.current;

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        const hit = getIntersectedNode(e);
        clickStartTime = Date.now();
        isDragging = false;
        if (hit) {
          draggedNode = hit;
          controls.enabled = false;
          const camDir = new THREE.Vector3();
          camera.getWorldDirection(camDir);
          dragPlane.setFromNormalAndCoplanarPoint(camDir.negate(), hit.mesh!.position);
          const intersectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(dragPlane, intersectPoint);
          dragOffset.copy(hit.mesh!.position).sub(intersectPoint);
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (draggedNode) {
          isDragging = true;
          const intersectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(dragPlane, intersectPoint);
          intersectPoint.add(dragOffset);
          draggedNode.x = intersectPoint.x;
          draggedNode.y = intersectPoint.y;
          draggedNode.z = intersectPoint.z;
          draggedNode.vx = 0;
          draggedNode.vy = 0;
          draggedNode.vz = 0;
          return;
        }

        const hit = getIntersectedNode(e);
        if (hit !== hoveredNode) {
          hoveredNode = hit;
          renderer.domElement.style.cursor = hit ? "pointer" : "default";
          if (tooltipEl) tooltipEl.style.opacity = "0";
          tooltipReady = false;
          if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
          }
          if (hit) tooltipTimer = setTimeout(() => { tooltipReady = true; }, 1000);
        }

        if (tooltipEl && hit) {
          tooltipEl.style.left = `${e.clientX + 16}px`;
          tooltipEl.style.top = `${e.clientY - 10}px`;
          tooltipEl.textContent = hit.desc || hit.label.replace("\n", " ");
          if (tooltipReady) tooltipEl.style.opacity = "1";
        } else if (tooltipEl) {
          tooltipEl.style.opacity = "0";
        }
      };

      const onPointerUp = () => {
        if (draggedNode) {
          const elapsed = Date.now() - clickStartTime;
          if (elapsed < 250 && !isDragging) toggleNode(draggedNode);
          draggedNode = null;
          controls.enabled = true;
        }
      };

      const el = renderer.domElement;
      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointerleave", onPointerUp);
      removeListeners.push(() => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointerleave", onPointerUp);
      });

      const ro = new ResizeObserver(() => {
        if (!rootRef.current) return;
        const w = rootRef.current.clientWidth;
        const h = rootRef.current.clientHeight;
        if (w < 2 || h < 2) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(container);
      roInst = ro;

      try {
        await renderer.init();
      } catch {
        setWebgpuOk(false);
        renderer.dispose();
        renderer.domElement.remove();
        rendererInst = null;
        return;
      }
      if (disposed) return;

      const postProcessing = new THREE.PostProcessing(renderer);
      const scenePass = pass(scene, camera);
      scenePass.setMRT(
        mrt({
          output,
          emissive,
        }),
      );
      const scenePassColor = scenePass.getTextureNode("output");
      const scenePassEmissive = scenePass.getTextureNode("emissive");
      const bloomPass = bloom(scenePassEmissive, 2.5, 0.5, 0);
      postProcessing.outputNode = scenePassColor.add(bloomPass);

      const clock = new THREE.Clock();
      const linkParticlesVisible = true;

      function animate() {
        if (disposed) return;
        const t = clock.getElapsedTime();
        simulate();
        controls.update();

        nodes.forEach((node) => {
          const target = node.visible ? 1 : 0.01;
          node.currentScale += (target - node.currentScale) * 0.12;
          const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.06 + 1;
          const isHov = node === hoveredNode;
          if (node._hoverFactor === undefined) node._hoverFactor = 0;
          const hoverTarget = isHov ? 1 : 0;
          node._hoverFactor += (hoverTarget - node._hoverFactor) * 0.08;
          const hoverScale = 1 + node._hoverFactor * 0.25;
          if (node.mesh && node.glowMesh && node.labelSprite) {
            node.mesh.position.set(node.x, node.y, node.z);
            node.mesh.scale.setScalar(node.radius * node.currentScale * pulse * hoverScale);
            node.mesh.visible = node.currentScale > 0.02;
            node.glowMesh.position.set(node.x, node.y, node.z);
            node.glowMesh.scale.setScalar(node.radius * (node._glowScale || 2.5) * node.currentScale);
            node.glowMesh.visible = node.currentScale > 0.02;
            const spriteH = node.depth === 0 ? 16 : node.depth === 1 ? 11 : 8;
            node.labelSprite.position.set(
              node.x,
              node.y + node.radius * node.currentScale + spriteH * 0.6,
              node.z,
            );
            node.labelSprite.visible = node.currentScale > 0.3;
            const labelScale = node.currentScale;
            const map = node.labelSprite.material.map;
            const aspect = map ? map.image.width / map.image.height : 4;
            node.labelSprite.scale.set(spriteH * aspect * labelScale, spriteH * labelScale, 1);
          }
          if (node.indicatorMesh) {
            const showIndicator = node.visible && node.currentScale > 0.5 && node.collapsed;
            node.indicatorMesh.visible = showIndicator;
            if (showIndicator) {
              const ir = node.indicatorRadius ?? 2;
              const speed = node.collapsed ? 2 : 1.2;
              const orbitRadius = node.radius * node.currentScale + ir + 2;
              const ang = t * speed + node.pulsePhase;
              node.indicatorMesh.position.set(
                node.x + Math.cos(ang) * orbitRadius,
                node.y + Math.sin(ang * 0.7) * ir * 1.5,
                node.z + Math.sin(ang) * orbitRadius,
              );
              const indicatorScale = node.collapsed ? ir : ir * 0.6;
              node.indicatorMesh.scale.setScalar(indicatorScale);
              const im = node.indicatorMesh.material as InstanceType<(typeof THREE)["MeshBasicMaterial"]>;
              im.opacity = node.collapsed ? 1 : 0.5;
            }
          }
        });

        links.forEach((link) => {
          const s = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          const vis =
            s.visible && tgt.visible && s.currentScale > 0.1 && tgt.currentScale > 0.1;
          link.line.visible = vis;
          link.particle.visible = vis && linkParticlesVisible;
          if (vis) {
            const sp = new THREE.Vector3(s.x, s.y, s.z);
            const tp = new THREE.Vector3(tgt.x, tgt.y, tgt.z);
            const mid = new THREE.Vector3().addVectors(sp, tp).multiplyScalar(0.5);
            mid.y += 8;
            const curve = new THREE.QuadraticBezierCurve3(sp, mid, tp);
            const points = curve.getPoints(20);
            link.line.geometry.setFromPoints(points);
            link.line.geometry.computeBoundingSphere();
            const pt = (t * 0.3 + s.pulsePhase) % 1;
            const pos = curve.getPoint(pt);
            link.particle.position.copy(pos);
          }
        });

        const positions = ambientParticleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += Math.sin(t * 0.5 + i * 0.7) * 0.03;
          positions[i * 3 + 1] += Math.cos(t * 0.3 + i) * 0.04;
          positions[i * 3 + 2] += Math.sin(t * 0.4 + i * 1.3) * 0.03;
        }
        ambientParticleGeo.attributes.position.needsUpdate = true;

        postProcessing.render();
      }

      renderer.setAnimationLoop(animate);

      (window as unknown as { __vortexMindMapApi?: unknown }).__vortexMindMapApi = {
        resetView: () => {
          controls.target.set(0, 0, 0);
          camera.position.set(0, 150, 400);
        },
        expandAll: () => {
          nodes.forEach((n) => {
            n.visible = true;
            n.collapsed = false;
            n.scaleTarget = 1;
            if (n.currentScale < 0.1) {
              n.currentScale = 0.01;
              const parent = n.parentId ? nodeMap[n.parentId] : null;
              if (parent) {
                n.x = parent.x + (Math.random() - 0.5) * 30;
                n.y = parent.y + (Math.random() - 0.5) * 30;
                n.z = parent.z + (Math.random() - 0.5) * 30;
              }
            }
          });
        },
        collapseAll: () => {
          nodes.forEach((n) => {
            if (n.depth >= 2) {
              n.visible = false;
              n.scaleTarget = 0.01;
            }
            if (n.depth >= 1) n.collapsed = true;
          });
          const r = nodeMap.root;
          if (r) r.collapsed = false;
        },
      };
    })();

    return () => {
      disposed = true;
      delete (window as unknown as { __vortexMindMapApi?: unknown }).__vortexMindMapApi;
      removeListeners.forEach((fn) => fn());
      roInst?.disconnect();
      roInst = null;
      controlsInst?.dispose();
      controlsInst = null;
      rendererInst?.setAnimationLoop(null);
      rendererInst?.dispose();
      rendererInst = null;
      container.querySelectorAll("canvas").forEach((c) => c.remove());
    };
  }, []);

  const callApi = (method: "resetView" | "expandAll" | "collapseAll") => {
    const api = (window as unknown as { __vortexMindMapApi?: Record<string, () => void> })
      .__vortexMindMapApi;
    api?.[method]?.();
  };

  return (
    <div ref={rootRef} className={cn("relative h-full min-h-[280px] w-full bg-smoke-2 light:bg-zinc-100", className)}>
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-[100] max-w-[220px] rounded-lg border border-light-space/10 bg-[rgb(18,18,24)]/95 px-3.5 py-2 text-[13px] leading-snug text-[#e0e0e0] opacity-0 transition-opacity duration-300"
        aria-hidden
      />

      {!webgpuOk ? (
        <div className="absolute inset-0 z-[200] flex items-center justify-center rounded-[inherit] bg-[rgb(18,18,24)]/95 p-8 text-center">
          <div className="max-w-sm rounded-xl border border-light-space/10 p-6">
            <h2 className="text-lg font-semibold text-[#e0e0e0]">WebGPU not available</h2>
            <p className="mt-2 text-[13px] text-light-space/50">
              Use Chrome 113+, Edge 113+, or another WebGPU-capable browser to see this visualization.
            </p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[min(100%,280px)] flex-col gap-3 md:left-4 md:top-4">
        <div className="px-1 text-left text-[#e0e0e0]">
          <h2 className="font-serif text-lg font-semibold tracking-wide md:text-xl">3D mind map</h2>
          <p className="mt-1 text-[11px] text-light-space/40">
            Drag nodes · Scroll to zoom · Click to expand · Right-drag to orbit
          </p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-1.5">
          <button
            type="button"
            className="rounded-md border border-light-space/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#c0c0c0] transition-colors hover:bg-white/[0.12] hover:text-light-space"
            onClick={() => callApi("resetView")}
          >
            Reset view
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors",
              physicsPaused
                ? "border-[#648cff]/40 bg-[#648cff]/20 text-[#8aafff]"
                : "border-light-space/10 bg-white/[0.06] text-[#c0c0c0] hover:bg-white/[0.12] hover:text-light-space",
            )}
            onClick={() => setPhysicsPaused((p) => !p)}
          >
            {physicsPaused ? "Resume physics" : "Pause physics"}
          </button>
          <button
            type="button"
            className="rounded-md border border-light-space/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#c0c0c0] transition-colors hover:bg-white/[0.12] hover:text-light-space"
            onClick={() => callApi("expandAll")}
          >
            Expand all
          </button>
          <button
            type="button"
            className="rounded-md border border-light-space/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#c0c0c0] transition-colors hover:bg-white/[0.12] hover:text-light-space"
            onClick={() => callApi("collapseAll")}
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-light-space/[0.08] bg-[rgb(18,18,24)]/85 px-3 py-2.5 md:bottom-4 md:right-4">
        {Object.entries(VORTEX_PALETTE)
          .filter(([k]) => k !== "root")
          .map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 text-[11px] text-light-space/50">
              <span className="size-2 shrink-0 rounded-full" style={{ background: val.hex }} />
              {key}
            </div>
          ))}
      </div>
    </div>
  );
}
