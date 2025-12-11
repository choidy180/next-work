import React, { Suspense, useState, useMemo, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // 💡 useFrame 재등장
import { useGLTF, OrbitControls, Html, Center, Environment, Resize, Line } from '@react-three/drei';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';

interface ViewerProps {
  glbUrl: string;
}

const FullScreenWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1a1a1a;
  z-index: 0;
`;

const AnimatedLine = animated(Line);

// 🔴 색상 상수 (순수 레드)
const LASER_RED_HEX = 0xff0000;
const LASER_RED_RGB = '255, 0, 0';

function SceneContent({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const copiedScene = useMemo(() => scene.clone(), [scene]);
  const [hovered, setHover] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  
  const [dimensions, setDimensions] = useState({ width: 1, height: 1, depth: 1 });

  useLayoutEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3();
      let hasMesh = false;

      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          box.expandByObject(child);
          hasMesh = true;
        }
      });

      if (!hasMesh) box.setFromObject(modelRef.current);

      const size = new THREE.Vector3();
      box.getSize(size);
      
      // ✅ 크기 비율 유지 (0.2)
      setDimensions({
        width: size.x * 0.2, 
        height: size.y * 0.2,
        depth: size.z * 0.2
      });
    }
  }, [copiedScene]);

  // --- 🎛️ 애니메이션 설정 ---
  const { groundOpacity, riseHeight, scanOpacity, intensity } = useSpring({
    from: { groundOpacity: 0, riseHeight: 0, scanOpacity: 0, intensity: 0 },
    to: {
      groundOpacity: hovered ? 1 : 0, 
      riseHeight: hovered ? dimensions.height : 0, 
      scanOpacity: hovered ? 0.3 : 0,
      // 💡 붉은 톤 강도 (0 ~ 0.3) : 너무 세지 않게 0.3까지만 올림
      intensity: hovered ? 0.3 : 0, 
    },
    delay: 0,
    config: (key) => {
      if (key === 'groundOpacity') return config.stiff;
      if (key === 'riseHeight') return { mass: 5, tension: 120, friction: 50 };
      if (key === 'scanOpacity') return { mass: 2, tension: 150, friction: 40 };
      if (key === 'intensity') return config.default;
      return config.default;
    },
  });

  // 💡 매 프레임마다 마테리얼 색상을 부드럽게 업데이트
  useFrame(() => {
    if (!modelRef.current) return;
    
    // 현재 붉은 기운 강도 (0.0 ~ 0.3)
    const currentIntensity = intensity.get();

    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        // Emissive(자체 발광) 속성을 사용하여 붉은 틴트 효과를 줌
        // 기존 텍스처나 색상은 유지됨
        if (material) {
          material.emissive = new THREE.Color(LASER_RED_HEX);
          material.emissiveIntensity = currentIntensity;
        }
      }
    });
  });

  const halfW = dimensions.width / 2;
  const halfD = dimensions.depth / 2;
  
  const rectPoints = useMemo(() => [
    [-halfW, 0, -halfD], [halfW, 0, -halfD], [halfW, 0, halfD], [-halfW, 0, halfD], [-halfW, 0, -halfD] 
  ] as [number, number, number][], [halfW, halfD]);

  return (
    <group>
      {/* ✅ 위치/크기 고정 (Resize scale=3, Center top) - 절대 변경 없음 */}
      <Resize scale={3}>
        <Center top>
          <group ref={modelRef}>
            <primitive 
              object={copiedScene}
              onPointerOver={(e: any) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHover(true); }}
              onPointerOut={(e: any) => { document.body.style.cursor = 'auto'; setHover(false); }}
            />
          </group>
        </Center>
      </Resize>

      {/* --- 효과 1: 바닥 테두리 선 --- */}
      <animated.group position={[0, 0.02, 0]} visible={groundOpacity.to(o => o > 0.01)}>
        <AnimatedLine
          points={rectPoints} 
          lineWidth={2}
          transparent={true}
          depthWrite={false}
          color={groundOpacity.to(o => `rgba(${LASER_RED_RGB}, ${o})`)}
        />
      </animated.group>

      {/* --- 효과 2: 스캔 면 --- */}
      <animated.mesh 
        rotation={[-Math.PI / 2, 0, 0]}
        position-y={riseHeight}
        visible={scanOpacity.to(o => o > 0.01)}
      >
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <animated.meshBasicMaterial 
          color={LASER_RED_HEX}
          transparent={true}
          opacity={scanOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </animated.mesh>

    </group>
  );
}

const FullScreenGlbViewer: React.FC<ViewerProps> = ({ glbUrl }) => {
  return (
    <FullScreenWrapper>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }}>
        <color attach="background" args={['#1a1a1a']} />
        <Suspense fallback={<Html center style={{color: 'white'}}>Loading...</Html>}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
          <Environment preset="city" />
          <SceneContent url={glbUrl} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </FullScreenWrapper>
  );
}

const DynamicFullScreenGlbViewer = dynamic<ViewerProps>(
  () => Promise.resolve(FullScreenGlbViewer),
  { ssr: false }
);

export default DynamicFullScreenGlbViewer;