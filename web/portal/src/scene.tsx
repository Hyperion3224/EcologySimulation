'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EntityBase } from './entities/entity.base';
import { World } from './world';
import { Queue } from './utilities';
import Chunk from './map/chunk';

type SceneProps = {
  world: World;
};

export default function Scene({ world }: SceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === 'undefined') return;

        const entities = world.allEntities;

        //  Track geometries & materials created in this effect
        const terrains: THREE.BufferGeometry[] = [];
        const terrainMats: THREE.Material[] = [];

        // Scene, camera, renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x202025);

        const width = containerRef.current.clientWidth || window.innerWidth;
        const height = containerRef.current.clientHeight || window.innerHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, (world.size*3 > 1000)? world.size*3 : 1000);
        camera.position.set(0, world.size, 0);
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
    
        // Init entities
        entities.map((entity) => {
          if (entity.mesh) {
            scene.add(entity.mesh);
          }
          // updateEntityPositions();
        });
    
        // Animation loop
        const animate = () => {
          if(world.chunkManager){
            if(world.chunkManager.hasNext){
              world.chunkManager.generateNextChunks()
            }
            if(world.chunkManager.chunkLoadQueue.hasNext()){
              const chunk = world.chunkManager.chunkLoadQueue.next()
              if(chunk != null){
                loadChunkAsync(chunk, terrains, terrainMats, scene);
              }
            }
          }
          
          
          controls.update();
          world.tick();
          // updateEntityPositions();
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
    
        // CLEANUP
        return () => {
          window.removeEventListener('resize', onResize);
        
          // stop render loop
          renderer.setAnimationLoop(null);
        
          // dispose controls (removes event listeners)
          controls.dispose();
        
          // dispose all tracked geometries/materials
          terrains.forEach((geo) => geo.dispose());
          terrainMats.forEach((mat) => mat.dispose());
        
          // (optional) remove entity meshes from scene
          entities.forEach((entity) => {
            if (entity.mesh) {
              scene.remove(entity.mesh);
              entity.destroyEntityMesh();
            }
          });
      
          // dispose renderer + remove canvas from DOM
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        };
    }, [world]);


  function applyHeightColors(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const vertexCount = position.count;

  const colors = new Float32Array(vertexCount * 3);

  //  This should reflect your *global* height range.
  // From your previous code, it looked like heights go from 0 → world.height / 2
  const maxHeight = world.height;   // or world.maxHeight if you track it
  const minHeight = 0;                  // adjust if you have negative heights

  const heightRange = maxHeight - minHeight || 1;

  // Gradient stops in [0..1] normalized world-height space
  const gradientStops = [
    { stop: 0.00, color: new THREE.Color(66 / 255, 182 / 255, 214 / 255) },  // water
    { stop: 0.10, color: new THREE.Color(235 / 255, 191 / 255, 134 / 255) }, // beach
    { stop: 0.85, color: new THREE.Color(51 / 255, 74 / 255, 45 / 255) },    // low grass
    { stop: 0.90, color: new THREE.Color(69 / 255, 57 / 255, 46 / 255) },    // rock
    { stop: 0.95, color: new THREE.Color(128 / 255, 120 / 255, 112 / 255) }, // high rock
    { stop: 1.00, color: new THREE.Color(1, 1, 1) },                         // snow
  ];

  const getGradientColor = (t: number): THREE.Color => {
    // clamp normalized height to [0,1]
    t = Math.max(0, Math.min(1, t));

    for (let i = 0; i < gradientStops.length - 1; i++) {
      const curr = gradientStops[i];
      const next = gradientStops[i + 1];

      if (t <= next.stop) {
        const segmentT =
          (t - curr.stop) / (next.stop - curr.stop || 1);
        return curr.color.clone().lerp(next.color, segmentT);
      }
    }

    return gradientStops[gradientStops.length - 1].color;
  };

  for (let i = 0; i < vertexCount; i++) {
    const h = position.getY(i);

    // world-based normalized height
    const t = (h - minHeight) / heightRange;

    const c = getGradientColor(t);
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.attributes.color.needsUpdate = true;
  }

  // function updateEntityPositions(): void{
  //   entities.map((entity) =>{
  //     if(entity.mesh){
  //       const wX = entity.position.x;
  //       const wY = entity.position.y;
  //       const wZ = entity.position.z;
  //       entity.mesh.position.set(wX, wY, wZ);
  //     }
  //   })
  // }

  async function loadChunkAsync(chunk: Chunk, terrains: THREE.BufferGeometry[], terrainMats: THREE.Material[], scene: THREE.Scene){
    const sL = chunk.sideLength;
    const plane = new THREE.PlaneGeometry(sL, sL, sL - 1, sL - 1);
    plane.rotateX(-Math.PI / 2);
    plane.translate(chunk.xOffset, 0, chunk.zOffset);
  
    const posAttr = plane.getAttribute('position') as THREE.BufferAttribute;
  
    for (let x = 0; x < sL; x++) {
      for (let z = 0; z < sL; z++) {
        const y = chunk.heightmap.coords[x][z];
        const index = z * sL + x;
        posAttr.setY(index, y);
      }
    }
    posAttr.needsUpdate = true;

    applyHeightColors(plane);

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(plane, terrainMat);

    //  Track for disposal
    terrains.push(plane);
    terrainMats.push(terrainMat);

    scene.add(terrainMesh);
  }

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}
