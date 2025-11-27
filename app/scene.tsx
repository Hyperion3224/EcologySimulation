'use client'

import React, { useRef, useEffect} from "react";
import * as THREE from "three";

export default function Scene(props: any) {
    const containerRef = useRef(null);

    useEffect(()=> {
        if (typeof window !== 'undefined'){

            //spawn render camera and scene
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);

            camera.position.z = 2;


            const terrain = new THREE.PlaneGeometry(props.size.x, props.size.y, props.size.x-1, props.size.y-1);
            const posAttr = terrain.attributes.position;
            for(let i = 0; i < posAttr.count; i++){
                const x = i % (props.size.x);
                const y = Math.floor(i / (props.size.y));

                const z = props.coords[x][y];

                posAttr.setZ(i, z);
            }


            const cube = new THREE.BoxGeometry(1,1,1);
            const cubeMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
            const cubeMesh = new THREE.Mesh(cube, cubeMat);
            scene.add(cubeMesh);

            renderer.setAnimationLoop(()=>{
                cubeMesh.rotation.x += Math.random()*0.01;
                cubeMesh.rotation.y += Math.random()*0.01;
                cubeMesh.rotation.z += Math.random()*0.01;
                renderer.render(scene, camera);
            })
            
            document.body.appendChild( renderer.domElement );
        }
    }, []);

    return <div ref={containerRef} />
};
