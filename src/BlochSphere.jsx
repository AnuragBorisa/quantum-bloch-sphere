import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function buildGreatCircle(radius, segments, axis) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    let x = 0;
    let y = 0;
    let z = 0;
    if (axis === 'x') {
      x = 0;
      y = Math.cos(t) * radius;
      z = Math.sin(t) * radius;
    } else if (axis === 'y') {
      x = Math.cos(t) * radius;
      y = 0;
      z = Math.sin(t) * radius;
    } else {
      x = Math.cos(t) * radius;
      y = Math.sin(t) * radius;
      z = 0;
    }
    points.push(new THREE.Vector3(x, y, z));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return geometry;
}

function createArrow(color, shaftRadius = 0.03, headRadius = 0.08, headLength = 0.22) {
  const group = new THREE.Group();
  const shaftLength = 1 - headLength;

  const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 24);
  const headGeo = new THREE.ConeGeometry(headRadius, headLength, 32);
  const mat = new THREE.MeshStandardMaterial({ color });

  const shaft = new THREE.Mesh(shaftGeo, mat);
  const head = new THREE.Mesh(headGeo, mat);

  shaft.position.y = shaftLength / 2;
  head.position.y = shaftLength + headLength / 2;

  group.add(shaft, head);
  return group;
}

function createAxis(color, axis) {
  const group = new THREE.Group();
  const shaftRadius = 0.02;
  const headRadius = 0.05;
  const headLength = 0.18;
  const length = 1.25;

  const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, length - headLength, 20);
  const headGeo = new THREE.ConeGeometry(headRadius, headLength, 24);
  const mat = new THREE.MeshStandardMaterial({ color });

  const shaft = new THREE.Mesh(shaftGeo, mat);
  const head = new THREE.Mesh(headGeo, mat);

  shaft.position.y = (length - headLength) / 2;
  head.position.y = length - headLength / 2;

  group.add(shaft, head);

  if (axis === 'x') group.rotation.z = -Math.PI / 2;
  if (axis === 'z') group.rotation.x = Math.PI / 2;

  return group;
}

export default function BlochSphere({ vector }) {
  const mountRef = useRef(null);
  const arrowRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const currentVecRef = useRef(new THREE.Vector3(0, 0, 1));
  const startVecRef = useRef(new THREE.Vector3(0, 0, 1));
  const targetVecRef = useRef(new THREE.Vector3(0, 0, 1));
  const animStartRef = useRef(0);
  const animDurationRef = useRef(650);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f16);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(2.7, 2.1, 2.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.5;

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0x9ad0ff, 0x0b1018, 0.6);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(4, 6, 5);
    scene.add(dirLight);

    const sphereGeo = new THREE.SphereGeometry(1, 72, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x122130,
      roughness: 0.55,
      metalness: 0.05,
      transmission: 0.12,
      transparent: true,
      opacity: 0.78,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4aa3ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(sphereGeo, glowMat);
    glow.scale.set(1.04, 1.04, 1.04);
    scene.add(glow);

    const gridMat = new THREE.LineBasicMaterial({ color: 0x304252, transparent: true, opacity: 0.4 });
    const latSegments = 10;
    for (let i = 1; i < latSegments; i += 1) {
      const phi = (i / latSegments) * Math.PI - Math.PI / 2;
      const radius = Math.cos(phi);
      const y = Math.sin(phi);
      const points = [];
      const circleSegments = 96;
      for (let j = 0; j <= circleSegments; j += 1) {
        const t = (j / circleSegments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, gridMat);
      scene.add(line);
    }

    const longSegments = 10;
    for (let i = 0; i < longSegments; i += 1) {
      const angle = (i / longSegments) * Math.PI;
      const points = [];
      const curveSegments = 96;
      for (let j = 0; j <= curveSegments; j += 1) {
        const t = (j / curveSegments) * Math.PI * 2;
        const x = Math.cos(t) * Math.sin(angle);
        const y = Math.cos(angle);
        const z = Math.sin(t) * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, gridMat);
      scene.add(line);
    }

    const xAxis = createAxis(0xff4d4d, 'x');
    const yAxis = createAxis(0x55ff9a, 'y');
    const zAxis = createAxis(0x5aa9ff, 'z');
    scene.add(xAxis, yAxis, zAxis);

    const equator = new THREE.Line(buildGreatCircle(1.01, 160, 'z'), new THREE.LineBasicMaterial({
      color: 0x5aa9ff,
      transparent: true,
      opacity: 0.35,
    }));
    scene.add(equator);

    const arrow = createArrow(0xf6c453, 0.05, 0.12, 0.26);
    scene.add(arrow);

    arrowRef.current = arrow;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    let frameId = 0;
    const onFrame = (now) => {
      const start = animStartRef.current;
      const duration = animDurationRef.current;
      if (start) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = currentVecRef.current;
        const startVec = startVecRef.current;
        const target = targetVecRef.current;
        current.lerpVectors(startVec, target, eased).normalize();
        if (t >= 1) {
          current.copy(target);
          animStartRef.current = 0;
        }
      }

      sphere.rotation.y += 0.0012;
      glow.rotation.y += 0.0012;

      const arrowVec = currentVecRef.current.clone().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, arrowVec);
      arrow.setRotationFromQuaternion(quat);

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(onFrame);
    };
    frameId = requestAnimationFrame(onFrame);

    const onResize = () => {
      if (!mount) return;
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const next = new THREE.Vector3(vector.x, vector.y, vector.z).normalize();
    const current = currentVecRef.current;
    if (!current.length()) {
      current.copy(next);
      startVecRef.current.copy(next);
      targetVecRef.current.copy(next);
      return;
    }
    startVecRef.current.copy(current);
    targetVecRef.current.copy(next);
    animStartRef.current = performance.now();
  }, [vector]);

  return <div className="bloch-canvas" ref={mountRef} />;
}
