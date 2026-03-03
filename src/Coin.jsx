import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function makeFaceTexture(label, bg, fg) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  ctx.font = 'bold 96px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Coin({ vector }) {
  const mountRef = useRef(null);
  const coinRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f14);

    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(1.8, 1.4, 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 4, 2);
    scene.add(dirLight);

    const radius = 0.8;
    const thickness = 0.18;
    const geometry = new THREE.CylinderGeometry(radius, radius, thickness, 64);

    const headTexture = makeFaceTexture('H', '#f6c453', '#2b1f0a');
    const tailTexture = makeFaceTexture('T', '#3a4250', '#eaf2f9');

    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6a2b, metalness: 0.6, roughness: 0.3 });
    const headMaterial = new THREE.MeshStandardMaterial({ map: headTexture, metalness: 0.4, roughness: 0.4 });
    const tailMaterial = new THREE.MeshStandardMaterial({ map: tailTexture, metalness: 0.4, roughness: 0.4 });

    const coin = new THREE.Mesh(geometry, [
      sideMaterial,
      sideMaterial,
      headMaterial,
      tailMaterial,
      sideMaterial,
      sideMaterial,
    ]);
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    coinRef.current = coin;

    let frameId = 0;
    const onFrame = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(onFrame);
    };
    onFrame();

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
    const coin = coinRef.current;
    if (!coin) return;
    const dir = new THREE.Vector3(vector.x, vector.y, vector.z).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    coin.setRotationFromQuaternion(quat);
  }, [vector]);

  return <div className="coin-canvas" ref={mountRef} />;
}
