'use client'

import React, { useRef, useEffect} from "react";
import * as THREE from "three";

const Scene = () => {
    const containerRef = useRef(null);

    useEffect(()=> {
        if (typeof window !== 'undefined'){
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);

            camera.position.z = 2;

            const geometry = new THREE.BoxGeometry(1,1,1);
            const geometryMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
            const geometryMesh = new THREE.Mesh(geometry, geometryMat);
            scene.add(geometryMesh);

            renderer.setAnimationLoop(()=>{
                geometryMesh.rotation.x += Math.random()*0.01;
                geometryMesh.rotation.y += Math.random()*0.01;
                geometryMesh.rotation.z += Math.random()*0.01;
                renderer.render(scene, camera);
            })
            
            document.body.appendChild( renderer.domElement );
        }
    }, []);

    return <div ref={containerRef} />
};

export default Scene;