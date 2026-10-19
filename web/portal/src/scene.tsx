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
    
        //  Terrain Mesh generation
        const terrain: THREE.BufferGeometry = new THREE.BufferGeometry();
        const verticies = new Float32Array(window.data);
        terrain.setAttribute('position', new THREE.BufferAttribute(verticies, 3));
        applyHeightColors(terrain);
        const terrainMat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: true,
        });
        const terrainMesh = new THREE.Mesh(terrain, terrainMat);

        scene.add(terrainMesh);

        const side = window.diameter * window.chunkSize + 1;
        const indices = new Uint32Array((side - 1) * (side - 1) * 6);
        let i = 0;

        for (let z = 0; z < side - 1; z++) {
            for (let x = 0; x < side - 1; x++) {
                const a = z * side + x;
                const b = a + 1;
                const c = a + side;
                const d = c + 1;

                // Two upward-facing triangles per grid cell.
                indices[i++] = a;
                indices[i++] = c;
                indices[i++] = b;

                indices[i++] = b;
                indices[i++] = c;
                indices[i++] = d;
            }
        }

        terrain.setIndex(new THREE.BufferAttribute(indices, 1));
        terrain.computeVertexNormals();

        // Init entities
        entities.map((entity) => {
          if (entity.mesh) {
            scene.add(entity.mesh);
          }
          // updateEntityPositions();
        });

    
        // Animation loop
        const animate = () => {
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
          terrain.dispose();
        
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

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}
