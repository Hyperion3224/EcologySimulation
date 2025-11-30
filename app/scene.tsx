'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EntityBase } from './entities/entity.base';

type SceneProps = {
  size: { x: number; y: number };          
  coords: number[][];                      
  entities: EntityBase[];
};

export default function Scene(props: SceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof window === 'undefined') return;

    // Scene, camera, renderer, entityMeshes
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202025);

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 150, 150);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Lights 🔆
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(30, 50, 20);
    scene.add(dirLight);

    // Terrain geometry
    const { x: sx, y: sy } = props.size;

    const terrain = new THREE.PlaneGeometry(sx, sy, sx - 1, sy - 1);

    // Make it a horizontal terrain in XZ plane
    terrain.rotateX(-Math.PI / 2);

    const posAttr = terrain.getAttribute('position') as THREE.BufferAttribute;

    for (let x = 0; x < sx; x++) {
      for (let y = 0; y < sy; y++) {
        const z = props.coords[x][y]; 
        const index = y * sx + x; 

        posAttr.setY(index, z);
      }
    }
    posAttr.needsUpdate = true;

    // Apply colors based on height (Y after rotation)
    applyHeightColors(terrain);

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrain, terrainMat);
    scene.add(terrainMesh);

    //Init entities
    props.entities.forEach(entity => {
      scene.add(entityToMesh(entity));
    });

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Handle resize
    const onResize = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      terrain.dispose();
      terrainMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [props.size.x, props.size.y, props.coords]);

  function applyHeightColors(geometry: THREE.BufferGeometry) {
    const position = geometry.getAttribute('position') as THREE.BufferAttribute;

    const vertexCount = position.count;
    const colors = new Float32Array(vertexCount * 3);

    let minH = Infinity;
    let maxH = -Infinity;

    for (let i = 0; i < vertexCount; i++) {
      const h = position.getY(i); // height is Y after rotation
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }

    const range = maxH - minH || 1;
    const color = new THREE.Color();

    const getColorForHeight = (t: number): THREE.Color => {
      if (t < 0.3) {
        const tt = t / 0.3;
        return color.setRGB(
          0 * (1 - tt) + 0 * tt,
          0 * (1 - tt) + 0.5 * tt,
          0.5 * (1 - tt) + 0 * tt
        );
      } else if (t < 0.6) {
        const tt = (t - 0.3) / 0.3;
        return color.setRGB(
          0 * (1 - tt) + 0.4 * tt,
          0.5 * (1 - tt) + 0.26 * tt,
          0 * (1 - tt) + 0.13 * tt
        );
      } else {
        const tt = (t - 0.6) / 0.4;
        return color.setRGB(
          0.4 * (1 - tt) + 1.0 * tt,
          0.26 * (1 - tt) + 1.0 * tt,
          0.13 * (1 - tt) + 1.0 * tt
        );
      }
    };

    for (let i = 0; i < vertexCount; i++) {
      const h = position.getY(i);
      const t = (h - minH) / range;

      const c = getColorForHeight(t);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.attributes.color.needsUpdate = true;
  }

  function entityToMesh(entity: EntityBase) {
    const { x: sx, y: sy } = props.size;
  
    const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);
    const sphereMat = () => {
      switch (entity.getSpecies()) {
        case 'test':
          return new THREE.MeshStandardMaterial({ color: '#ffdb11ff' });
        case 'carn':
          return new THREE.MeshStandardMaterial({ color: '#FF0000' });
        case 'plant':
          return new THREE.MeshStandardMaterial({ color: '#319b31ff' });
        case 'blob':
          return new THREE.MeshStandardMaterial({ color: '#1090f0' });
        default:
          return new THREE.MeshStandardMaterial({ color: 'white' });
      }
    };
  
    const mesh = new THREE.Mesh(sphereGeometry, sphereMat());
  
    const location = entity.getLocation(); // { x: gridX, y: gridY, z: height }
  
    const gridX = location.x;
    const gridY = location.y;
    const height = location.z + 1; // Board z = Three y
  
    // Map grid indices -> centered world coordinates
    const worldX = gridX - sx / 2;
    const worldZ = gridY - sy / 2;
    const worldY = height;
  
    mesh.position.set(worldX, worldY, worldZ);
  
    return mesh;
  }


  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}
