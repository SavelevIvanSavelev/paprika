import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { FloorPlanResponse, Fixture } from '../types/floorplan';

export interface BoxProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  rotation: number;
  color: string;
  name: string;
  isGroentenTafel: boolean;
}

const PLAN_WIDTH = 4800;
const PLAN_HEIGHT = 4800;

const Box = ({ position, dimensions, rotation, color, name, isGroentenTafel }: BoxProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={[0, THREE.MathUtils.degToRad(rotation), 0]}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={dimensions} />
        <meshStandardMaterial
          color={hovered ? '#666666' : color}
          metalness={0.1}
          roughness={0.5}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...dimensions)]} />
          <lineBasicMaterial color="black" />
        </lineSegments>
      </mesh>
      {isGroentenTafel && (
        <mesh position={[0, dimensions[1] / 2 + 200, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[100, 200, 4]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

interface FloorPlanSceneProps {
  boxes: BoxProps[];
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  controls?: boolean;
  style?: React.CSSProperties;
}

const FloorPlanScene = ({
  boxes,
  cameraPosition = [600, 5800, 600],
  cameraTarget = [600, 600, 500],
  controls = true,
  style = { width: '100%', height: '100%' },
}: FloorPlanSceneProps) => (
  <div style={style}>
    <Canvas style={style}>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        rotation={[0, 0, 0]}
        fov={45}
        near={1}
        far={10000}
      />
      {(
        <OrbitControls
          enablePan={controls}
          enableZoom={controls}
          enableRotate={controls}
          minDistance={100}
          maxDistance={10000}
          target={cameraTarget}
        />
      )}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={cameraPosition}
        intensity={1.2}
        castShadow
      />
      {boxes.map((box, index) => (
        <Box key={index} {...box} />
      ))}
    </Canvas>
  </div>
);

// FloorPlanViewer now only renders the scene
const FloorPlanViewer = ({ boxes }: { boxes: BoxProps[] }) => {
  return <FloorPlanScene boxes={boxes} />;
};

export const FloorPlanMiniature = ({ boxes }: { boxes: BoxProps[] }) => (
  <FloorPlanScene
    boxes={boxes}
    controls={false}
    style={{ width: 400, height: 400, border: '2px solid #222', borderRadius: 8, boxSizing: 'border-box' }}
  />
);

// Utility to load and compute boxes from JSON
export async function loadBoxes(): Promise<BoxProps[]> {
  const [floorPlanResponse, fixturesResponse] = await Promise.all([
    fetch('/floorplan-response-prod.json'),
    fetch('/floorplan-response-fixtures-prod.json')
  ]);
  const floorPlanData: FloorPlanResponse = await floorPlanResponse.json();
  const fixturesData: Fixture[] = await fixturesResponse.json();

  const currentPeriod = floorPlanData.floorPlanPeriods[0];
  if (!currentPeriod) return [];

  return currentPeriod.fixturePlacements.map((placement) => {
    const fixture = fixturesData.find(f => f.name === placement.fixture.name);
    if (!fixture) return null;

    const x = parseFloat(placement.placement.coordinates.xCoordinate) - PLAN_WIDTH / 2;
    const y = parseFloat(placement.placement.coordinates.yCoordinate) - PLAN_HEIGHT / 2;
    const z = parseFloat(placement.placement.coordinates.zCoordinate);
    const rotation = parseFloat(placement.placement.angle.value);

    const width = parseFloat(fixture.dimensions.width);
    const height = parseFloat(fixture.dimensions.height) * 10;
    const depth = parseFloat(fixture.dimensions.depth);

    // Determine box color based on name
    let color = 'white';
    if (placement.fixture.name.includes('Kassa')) {
      color = 'green';
    } else if (placement.fixture.name.includes('Actie') || placement.fixture.name.includes('Bonus')) {
      color = 'orange';
    }

    // Check if it's a Groenten tafel
    const isGroentenTafel = placement.includedInSections.some(
      section => section.productCategory.name === 'Groenten tafel'
    );

    if (isGroentenTafel) {
      color = 'red';
    }

    const boxProps: BoxProps = {
      position: [x, z, y],
      dimensions: [width, height, depth],
      rotation,
      color,
      name: placement.fixture.name,
      isGroentenTafel
    };

    return boxProps;
  }).filter((box): box is BoxProps => box !== null && box.position[2] > -1800);
}

export default FloorPlanViewer; 