import * as THREE from 'three';
import { materials } from '../materials';

const TAU = Math.PI * 2;

export interface CountingWheelOptions {
  teeth?: number;
  rootRadius?: number;
  tipRadius?: number;
  boreRadius?: number;
  thickness?: number;
}

/**
 * Build a flat spur-gear geometry in the XY plane (axis Z), with a central bore,
 * then rotate it so its axis lies along X (to match the drum). Trapezoidal teeth
 * — legible, not involute; the mesh never drives motion by contact.
 */
function makeGearGeometry(
  teeth: number,
  rootRadius: number,
  tipRadius: number,
  boreRadius: number,
  thickness: number,
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const step = TAU / teeth;
  const tipHalf = step * 0.2; // angular half-width of the tooth tip
  const point = (r: number, a: number): [number, number] => [Math.cos(a) * r, Math.sin(a) * r];

  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const rootStart = a;
    const tipStart = a + step * 0.5 - tipHalf;
    const tipEnd = a + step * 0.5 + tipHalf;
    const rootEnd = a + step;
    if (i === 0) shape.moveTo(...point(rootRadius, rootStart));
    else shape.lineTo(...point(rootRadius, rootStart));
    shape.lineTo(...point(tipRadius, tipStart));
    shape.lineTo(...point(tipRadius, tipEnd));
    shape.lineTo(...point(rootRadius, rootEnd));
  }
  shape.closePath();

  const bore = new THREE.Path();
  bore.absarc(0, 0, boreRadius, 0, TAU, true);
  shape.holes.push(bore);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 24,
  });
  geo.translate(0, 0, -thickness / 2); // centre along the extrusion (Z) axis
  geo.rotateY(Math.PI / 2); // put the gear axis along X
  geo.computeVertexNormals();
  return geo;
}

/**
 * The counting wheel: a toothed gear that turns about X with the drum. Phase 2
 * adds the two carry pins on the +X face and wires it to the sautoir.
 */
export function createCountingWheel(opts: CountingWheelOptions = {}): THREE.Mesh {
  const teeth = opts.teeth ?? 20;
  const rootRadius = opts.rootRadius ?? 0.72;
  const tipRadius = opts.tipRadius ?? 0.85;
  const boreRadius = opts.boreRadius ?? 0.12;
  const thickness = opts.thickness ?? 0.28;

  const mesh = new THREE.Mesh(
    makeGearGeometry(teeth, rootRadius, tipRadius, boreRadius, thickness),
    materials.steel,
  );
  mesh.name = 'countingWheel';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
