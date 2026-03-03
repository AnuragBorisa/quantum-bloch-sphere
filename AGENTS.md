# AGENTS.md

## Purpose
Build a 3D web app that visualizes a single-qubit state on the Bloch sphere. Users can select famous states or input their own state, apply rotation gates, and see the state rotate in real time.

## Non-Goals (v1)
- No coin visualization (deferred).
- No multi-qubit circuits.
- No backend.

## Product Rules
- 3D visualization is the core. The Bloch sphere must be prominent and responsive.
- Inputs must be simple: presets + manual entry.
- Gate actions must be visible immediately on the sphere.
- Keep UI minimal and clear.

## UX Rules
- One-screen experience: sphere on the left/center, controls on the right/bottom.
- Provide a small legend explaining axes and phase.
- Avoid nested menus.

## Tech Direction
- Frontend-only. Prefer Vite + React + Three.js.
- Use deterministic math: represent state as a Bloch vector and update via rotation matrices.
- Use radians internally, degrees in UI.

## Data Model
- Represent state as Bloch vector (x, y, z) with unit length.
- Track display values: theta (polar), phi (azimuth).
- Store selected preset name.

## Gates (v1)
- Rotations: RX(θ), RY(θ), RZ(θ)
- Pauli: X, Y, Z (as π rotations)
- Optional: H, S, T if time permits

## Definition of Done (v1)
- A user can select a preset state and see the correct vector.
- A user can input a custom state (θ, φ) and see the vector.
- A user can apply RX/RY/RZ and see rotation with numeric readout.
- The app runs locally with one command.

## Vibe Coding Rules
- Keep files small and focused.
- Prefer explicit math over magical libraries.
- No heavy state management.
- Be consistent about radians vs degrees.
