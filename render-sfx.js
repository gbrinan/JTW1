// Renders the MIDI-style sound effects defined in mario-jump-A.html
// into 32-bit float mono WAV files under ./sfx
//
// Usage: node render-sfx.js

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const source = fs.readFileSync(path.join(__dirname, 'mario-jump-A.html'), 'utf8');
const block = source.match(/\/\/ SFX-BEGIN[\s\S]*?\/\/ SFX-END/);
if (!block) throw new Error('SFX block not found in mario-jump-A.html');

const lib = new Function(
  block[0] + '\nreturn { SFX, SFX_INSTRUMENTS, SFX_MASTER, midiToHz, noteLength, envelope };'
)();

function render(notes) {
  const length = Math.max(...notes.map(n => n.t + lib.noteLength(n)));
  const out = new Float32Array(Math.ceil((length + 0.05) * SAMPLE_RATE));
  for (const note of notes) {
    const inst = lib.SFX_INSTRUMENTS[note.i];
    const total = inst.partials.reduce((sum, [, amp]) => sum + amp, 0);
    const len = lib.noteLength(note);
    const first = Math.floor(note.t * SAMPLE_RATE);
    const last = Math.min(out.length, Math.ceil((note.t + len) * SAMPLE_RATE));
    for (const [ratio, amp] of inst.partials) {
      const peak = note.v * lib.SFX_MASTER * amp / total;
      const w = 2 * Math.PI * lib.midiToHz(note.n) * ratio;
      for (let i = first; i < last; i++) {
        const lt = i / SAMPLE_RATE - note.t;
        out[i] += Math.sin(w * lt) * lib.envelope(peak, len, lt);
      }
    }
  }
  return out;
}

// WAVE_FORMAT_IEEE_FLOAT (3), mono, 32 bits per sample, with the fact chunk the format requires
function writeFloatWav(file, samples) {
  const dataBytes = samples.length * 4;
  const buf = Buffer.alloc(58 + dataBytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(50 + dataBytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(18, 16);
  buf.writeUInt16LE(3, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(32, 34);
  buf.writeUInt16LE(0, 36);
  buf.write('fact', 38);
  buf.writeUInt32LE(4, 42);
  buf.writeUInt32LE(samples.length, 46);
  buf.write('data', 50);
  buf.writeUInt32LE(dataBytes, 54);
  for (let i = 0; i < samples.length; i++) buf.writeFloatLE(samples[i], 58 + i * 4);
  fs.writeFileSync(file, buf);
}

const outDir = path.join(__dirname, 'sfx');
fs.mkdirSync(outDir, { recursive: true });
for (const [name, notes] of Object.entries(lib.SFX)) {
  const samples = render(notes);
  const file = path.join(outDir, `${name}.wav`);
  writeFloatWav(file, samples);
  const peak = samples.reduce((m, s) => Math.max(m, Math.abs(s)), 0);
  console.log(`${name}.wav  ${(samples.length / SAMPLE_RATE).toFixed(2)}s  peak ${peak.toFixed(3)}`);
}
