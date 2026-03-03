import { useMemo, useState } from 'react';
import './App.css';
import BlochSphere from './BlochSphere.jsx';
import Coin from './Coin.jsx';
import {
  PRESETS,
  degToRad,
  radToDeg,
  vectorFromAngles,
  anglesFromVector,
  normalizeAngles,
  rotateX,
  rotateY,
  rotateZ,
  GATES,
} from './bloch.js';

const defaultPreset = PRESETS[0];

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(3) : '0.000';
}

export default function App() {
  const [thetaDeg, setThetaDeg] = useState(radToDeg(defaultPreset.theta));
  const [phiDeg, setPhiDeg] = useState(radToDeg(defaultPreset.phi));
  const [vector, setVector] = useState(vectorFromAngles(defaultPreset.theta, defaultPreset.phi));
  const [rotationDeg, setRotationDeg] = useState(30);
  const [presetLabel, setPresetLabel] = useState(defaultPreset.label);

  const angles = useMemo(() => {
    const { theta, phi } = anglesFromVector(vector);
    return { theta, phi };
  }, [vector]);

  const applyAngles = (thetaInput, phiInput) => {
    const thetaRad = degToRad(thetaInput);
    const phiRad = degToRad(phiInput);
    const normalized = normalizeAngles(thetaRad, phiRad);
    setThetaDeg(radToDeg(normalized.theta));
    setPhiDeg(radToDeg(normalized.phi));
    setVector(vectorFromAngles(normalized.theta, normalized.phi));
    setPresetLabel('Custom');
  };

  const applyRotation = (axis) => {
    const angle = degToRad(rotationDeg || 0);
    let next = vector;
    if (axis === 'x') next = rotateX(vector, angle);
    if (axis === 'y') next = rotateY(vector, angle);
    if (axis === 'z') next = rotateZ(vector, angle);
    setVector(next);
    const { theta, phi } = anglesFromVector(next);
    setThetaDeg(radToDeg(theta));
    setPhiDeg(radToDeg(phi));
    setPresetLabel('Custom');
  };

  const applyGate = (gate) => {
    const next = GATES[gate](vector);
    setVector(next);
    const { theta, phi } = anglesFromVector(next);
    setThetaDeg(radToDeg(theta));
    setPhiDeg(radToDeg(phi));
    setPresetLabel('Custom');
  };

  const p0 = (1 + vector.z) / 2;
  const p1 = (1 - vector.z) / 2;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Bloch Sphere Studio</h1>
          <p>Rotate a single-qubit state and see the geometry update in real time.</p>
        </div>
        <div className="preset-pill">State: {presetLabel}</div>
      </header>

      <main className="app-grid">
        <section className="left-column">
          <div className="sphere-panel">
            <BlochSphere vector={vector} />
            <div className="legend">
              <span className="legend-item"><span className="dot x" /> X axis</span>
              <span className="legend-item"><span className="dot y" /> Y axis</span>
              <span className="legend-item"><span className="dot z" /> Z axis</span>
              <span className="legend-item"><span className="dot v" /> State</span>
            </div>
          </div>

          <div className="panel-block coin-block">
            <div className="coin-head">
              <h2>Classical Coin View</h2>
              <p>Heads/Tails probability from the Z projection.</p>
            </div>
            <Coin vector={vector} />
            <div className="coin-readout">
              <div>
                <span>Heads (|0⟩)</span>
                <strong>{formatNumber(p0)}</strong>
              </div>
              <div>
                <span>Tails (|1⟩)</span>
                <strong>{formatNumber(p1)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="control-panel">
          <div className="panel-block">
            <h2>Preset States</h2>
            <div className="preset-grid">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  className="chip"
                  onClick={() => {
                    setPresetLabel(preset.label);
                    setThetaDeg(radToDeg(preset.theta));
                    setPhiDeg(radToDeg(preset.phi));
                    setVector(vectorFromAngles(preset.theta, preset.phi));
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-block">
            <h2>Custom State</h2>
            <div className="field-row">
              <label>
                θ (deg)
                <input
                  type="number"
                  value={thetaDeg}
                  onChange={(e) => setThetaDeg(Number(e.target.value))}
                />
              </label>
              <label>
                φ (deg)
                <input
                  type="number"
                  value={phiDeg}
                  onChange={(e) => setPhiDeg(Number(e.target.value))}
                />
              </label>
            </div>
            <button className="primary" onClick={() => applyAngles(thetaDeg, phiDeg)}>
              Apply Angles
            </button>
          </div>

          <div className="panel-block">
            <h2>Rotations</h2>
            <div className="field-row">
              <label>
                Angle (deg)
                <input
                  type="number"
                  value={rotationDeg}
                  onChange={(e) => setRotationDeg(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="gate-row">
              <button onClick={() => applyRotation('x')}>RX(θ)</button>
              <button onClick={() => applyRotation('y')}>RY(θ)</button>
              <button onClick={() => applyRotation('z')}>RZ(θ)</button>
            </div>
            <div className="gate-row">
              <button onClick={() => applyGate('X')}>X</button>
              <button onClick={() => applyGate('Y')}>Y</button>
              <button onClick={() => applyGate('Z')}>Z</button>
            </div>
          </div>

          <div className="panel-block">
            <h2>Readout</h2>
            <div className="readout">
              <div>
                <span>θ</span>
                <strong>{formatNumber(radToDeg(angles.theta))}°</strong>
              </div>
              <div>
                <span>φ</span>
                <strong>{formatNumber(radToDeg(angles.phi))}°</strong>
              </div>
              <div>
                <span>x</span>
                <strong>{formatNumber(vector.x)}</strong>
              </div>
              <div>
                <span>y</span>
                <strong>{formatNumber(vector.y)}</strong>
              </div>
              <div>
                <span>z</span>
                <strong>{formatNumber(vector.z)}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
