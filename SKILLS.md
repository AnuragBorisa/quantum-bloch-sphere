# SKILLS.md

## Bloch Math
- Represent a qubit on Bloch sphere by (x, y, z) with unit length.
- Convert from angles:
  - x = sin(theta) * cos(phi)
  - y = sin(theta) * sin(phi)
  - z = cos(theta)
- Convert to angles:
  - theta = acos(z)
  - phi = atan2(y, x)

## Rotations
- Use right-hand rule for rotations about axes.
- Rotation matrices:
  - RX(θ):
    - x' = x
    - y' = y*cosθ - z*sinθ
    - z' = y*sinθ + z*cosθ
  - RY(θ):
    - x' = x*cosθ + z*sinθ
    - y' = y
    - z' = -x*sinθ + z*cosθ
  - RZ(θ):
    - x' = x*cosθ - y*sinθ
    - y' = x*sinθ + y*cosθ
    - z' = z

## Preset States (θ, φ)
- |0> : (0, 0)
- |1> : (pi, 0)
- |+> : (pi/2, 0)
- |-> : (pi/2, pi)
- |+i> : (pi/2, pi/2)
- |-i> : (pi/2, -pi/2)

## UI Inputs
- Accept angles in degrees; convert to radians internally.
- Normalize angles: theta in [0, pi], phi in (-pi, pi].

## Visuals
- Show axes labels: X, Y, Z.
- Draw state vector from origin to point (x, y, z).
- Optional: show a faint latitude/longitude grid.
