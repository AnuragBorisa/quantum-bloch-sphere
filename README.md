# Quantum Bloch Sphere

An interactive 3D web app for visualizing a single-qubit state on the Bloch sphere. Users can select common basis states, input custom angles, and apply rotation gates to see how the qubit state evolves geometrically. A classical coin view maps the Z projection to heads/tails probabilities for intuition.

## Features
- Real-time 3D Bloch sphere with axes, grid, and state vector
- Preset states: |0>, |1>, |+>, |->, |+i>, |-i>
- Custom state input using theta and phi (degrees)
- Gate controls: RX, RY, RZ and X, Y, Z
- Numeric readouts for angles and vector components
- Classical coin analogy tied to the Z projection

## Tech Stack
- React + Vite
- Three.js

## Getting Started
```bash
npm install
npm run dev
```

## Notes
- Angles are entered in degrees; internal math uses radians.
- The Bloch vector is always normalized to unit length.
