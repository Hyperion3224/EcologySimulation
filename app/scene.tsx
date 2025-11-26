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

            renderer.setAnimationLoop(()=>{
                renderer.render(scene, camera);
            })
            
            document.body.appendChild( renderer.domElement );
        }
    }, []);

    return <div ref={containerRef} />
};

export default Scene;