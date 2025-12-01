'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EntityBase } from './entities/entity.base';
import { World } from './world';

type SceneProps = {
  world: World;
};

export default function Scene(props: SceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const world = props.world;
  const size = world.size;
  const entities = world.allEntities;
  
  useEffect(() => {


    if (!containerRef.current) return;
    if (typeof window === 'undefined') return;

    // Scene, camera, renderer, entityMeshes
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202025);

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, world.size.x, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Lights 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(30, 50, 20);
    scene.add(dirLight);

    // Terrain geometry
    const { x: sx, z: sz } = size;

    const terrain = new THREE.PlaneGeometry(sx, sz, sx - 1, sz - 1);

    // Make it a horizontal terrain in XZ plane
    terrain.rotateX(-Math.PI / 2);

    const posAttr = terrain.getAttribute('position') as THREE.BufferAttribute;

    for (let x = 0; x < sx; x++) {
      for (let z = 0; z < sz; z++) {
        const y = world.board.heightmap.coords[x][z]; 
        const index = z * sx + x; 

        posAttr.setY(index, y);
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
    entities.map((entity) => {
      if(entity.mesh){
        scene.add(entity.mesh);
      }
      updateEntityPositions();
    });

    // Animation loop
    const animate = () => {
      controls.update();
      world.tick();
      updateEntityPositions();
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
  }, [props.world]);

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

  function updateEntityPositions(): void{
    entities.map((entity) =>{
      if(entity.mesh){
        const wX = entity.position.x - world.xCenter;
        const wY = entity.position.y;
        const wZ = entity.position.z - world.zCenter;
        entity.mesh.position.set(wX, wY, wZ);
      }
    })
  }

  // function entityToMesh(entity: EntityBase) {
  //   const { x: sx, z: sz } = size;
  
  //   const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);
  //   const sphereMat = () => {
  //     switch (entity.species) {
  //       case 'test':
  //         return ;
  //       case 'carn':
  //         return new THREE.MeshStandardMaterial({ color: 0xFF0000 });
  //       case 'plant':
  //         return new THREE.MeshStandardMaterial({ color: 0x319b31 });
  //       case 'blob':
  //         return new THREE.MeshStandardMaterial({ color: 0x1090f0 });
  //       default:
  //         return new THREE.MeshStandardMaterial({ color: 'white' });
  //     }
  //   };
  
  //   const mesh = new THREE.Mesh(sphereGeometry, sphereMat());
  
  //   const location = entity.location; 
  
  //   const gridX = location.x;
  //   const gridZ = location.z;
  //   const height = location.y + 1; 
  
  //   // Map grid indices -> centered world coordinates
  //   const worldX = gridX - sx / 2;
  //   const worldZ = gridZ - sz / 2;
  //   const worldY = height;
  
  //   mesh.position.set(worldX, worldY, worldZ);
  
  //   return mesh;
  // }

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}
