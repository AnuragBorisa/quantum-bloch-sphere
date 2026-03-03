# Requirements

## Functional
- Render a Bloch sphere with axes labels.
- Render a unit vector for the current qubit state.
- Allow preset selection: |0>, |1>, |+>, |->, |+i>, |-i>.
- Allow custom input via (theta, phi) in degrees.
- Apply RX/RY/RZ with user-specified angle (degrees).
- Provide X/Y/Z buttons as pi rotations.
- Display current (theta, phi) and (x, y, z).

## Non-Functional
- Runs locally with a single command.
- Smooth animation at interactive frame rates.
- Clear UI that fits on desktop and mobile.

## Constraints
- Frontend-only, Vite + React + Three.js.
- Deterministic math, no external physics engines.
