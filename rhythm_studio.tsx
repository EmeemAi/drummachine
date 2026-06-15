import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Activity, SlidersHorizontal, Disc } from 'lucide-react';

// Utilities
const rep16 = (arr) => [...arr, ...arr, ...arr, ...arr];

const INSTRUMENTS = [
  { id: 'BD', name: 'KICK', capColor: 'bg-rose-600', shadow: 'shadow-rose-500' },
  { id: 'SD', name: 'SNARE', capColor: 'bg-[#5c4a3d]', shadow: 'shadow-amber-500' },
  { id: 'CP', name: 'CLAP', capColor: 'bg-orange-600', shadow: 'shadow-orange-400' },
  { id: 'CH', name: 'C. HAT', capColor: 'bg-yellow-500', shadow: 'shadow-yellow-400' },
  { id: 'OH', name: 'O. HAT', capColor: 'bg-[#6b705c]', shadow: 'shadow-lime-400' },
  { id: 'TM', name: 'TOM', capColor: 'bg-blue-600', shadow: 'shadow-cyan-400' },
  { id: 'CB', name: 'COWBELL', capColor: 'bg-[#6b5b95]', shadow: 'shadow-indigo-400' }
];

const PRESETS = {
  vacio: {
    name: 'VACÍO', length: 1,
    grid: { BD: Array(64).fill(0), SD: Array(64).fill(0), CP: Array(64).fill(0), CH: Array(64).fill(0), OH: Array(64).fill(0), TM: Array(64).fill(0), CB: Array(64).fill(0) }
  },
  house: {
    name: 'CLASSIC HOUSE', length: 1,
    grid: {
      BD: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]), SD: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), CP: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CH: rep16([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]), OH: rep16([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]), TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  trap: {
    name: 'TRAP', length: 2,
    grid: {
      BD: rep16([1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]), SD: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]), CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), OH: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  reggaeton: {
    name: 'DEMBOW', length: 1,
    grid: {
      BD: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]), SD: rep16([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0]), CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]), OH: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  }
};

// Componente Perilla (Knob)
const RotaryKnob = ({ value, min, max, onChange, size = 50, isMetallic = false }) => {
  const knobRef = useRef(null);
  
  const handlePointerDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startVal = value;
    
    const handlePointerMove = (moveEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const range = max - min;
      let newVal = startVal + (deltaY / 150) * range;
      newVal = Math.max(min, Math.min(max, newVal));
      onChange(newVal);
    };
    
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const percent = (value - min) / (max - min);
  const angle = -135 + (percent * 270);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div 
        ref={knobRef}
        onPointerDown={handlePointerDown}
        className={`rounded-full shadow-[0_8px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] cursor-ns-resize border-2 border-black/40 ${isMetallic ? 'bg-gradient-to-br from-[#f0f0f0] via-[#a0a0a0] to-[#555]' : 'bg-gradient-to-br from-[#5c4a3d] to-[#2a1d13]'}`}
        style={{ width: size, height: size, touchAction: 'none' }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Indicador */}
          <div className={`mx-auto mt-[4px] rounded-full ${isMetallic ? 'w-1.5 h-3.5 bg-[#111] shadow-inner' : 'w-1 h-3 bg-[#eab308] shadow-[0_0_6px_rgba(234,179,8,0.6)]'}`}></div>
        </div>
        <div className="absolute inset-[20%] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.1)] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default function RhythmStudio() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Share+Tech+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(128);
  const [swing, setSwing] = useState(0); 
  const [activeStep, setActiveStep] = useState(-1);
  const [currentPreset, setCurrentPreset] = useState('vacio');
  const [showMixer, setShowMixer] = useState(true);

  const [currentPage, setCurrentPage] = useState(0); 
  const [patternLength, setPatternLength] = useState(1);
  const [drumGrid, setDrumGrid] = useState(PRESETS.house.grid);

  // Mixer
  const [volumes, setVolumes] = useState({ BD: 0.9, SD: 0.8, CP: 0.7, CH: 0.6, OH: 0.6, TM: 0.8, CB: 0.5 });
  const [mutes, setMutes] = useState({ BD: false, SD: false, CP: false, CH: false, OH: false, TM: false, CB: false });
  const [pitches, setPitches] = useState({ BD: 1.0, SD: 1.0, CP: 1.0, CH: 1.0, OH: 1.0, TM: 1.0, CB: 1.0 });

  // Efectos Master Avanzados
  const [masterDrive, setMasterDrive] = useState(0.0); 
  const [masterReverb, setMasterReverb] = useState(0.0); 
  const [masterFilter, setMasterFilter] = useState(1.0); 
  const [masterDelay, setMasterDelay] = useState(0.0); 
  const [masterComp, setMasterComp] = useState(0.0); 
  const [masterCrush, setMasterCrush] = useState(0.0); 
  const [masterVol, setMasterVol] = useState(0.8); 

  // Grabación
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const audioChunksRef = useRef([[], []]);
  const recorderNodeRef = useRef(null);

  // Refs para AudioNodes
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const noiseBufferRef = useRef(null);
  
  const cleanCrushGainRef = useRef(null);
  const crushGainRef = useRef(null);
  const filterNodeRef = useRef(null);
  const cleanDriveGainRef = useRef(null);
  const driveGainRef = useRef(null);
  const compNodeRef = useRef(null);
  const delayNodeRef = useRef(null);
  const delayWetGainRef = useRef(null);
  const wetReverbGainRef = useRef(null);
  const dryReverbGainRef = useRef(null);

  const drumGridRef = useRef(drumGrid);
  const tempoRef = useRef(tempo);
  const swingRef = useRef(swing);
  const volumesRef = useRef(volumes);
  const mutesRef = useRef(mutes);
  const pitchesRef = useRef(pitches);
  const patternLengthRef = useRef(patternLength);
  
  useEffect(() => { drumGridRef.current = drumGrid; }, [drumGrid]);
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { swingRef.current = swing; }, [swing]);
  useEffect(() => { volumesRef.current = volumes; }, [volumes]);
  useEffect(() => { mutesRef.current = mutes; }, [mutes]);
  useEffect(() => { pitchesRef.current = pitches; }, [pitches]);
  useEffect(() => { patternLengthRef.current = patternLength; }, [patternLength]);

  const nextStepTimeRef = useRef(0.0);
  const currentStepRef = useRef(0);
  const timerIdRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noiseBufferRef.current = buffer;

        const masterGain = ctx.createGain();
        masterGainRef.current = masterGain;

        const crushNode = ctx.createWaveShaper();
        const makeCrushCurve = (bits) => {
          const steps = Math.pow(2, bits);
          const curve = new Float32Array(44100);
          for(let i=0; i<44100; i++) {
            let x = i * 2 / 44100 - 1;
            curve[i] = Math.round(x * steps) / steps;
          }
          return curve;
        };
        crushNode.curve = makeCrushCurve(4); 
        const cleanCrushGain = ctx.createGain();
        const crushGain = ctx.createGain();
        cleanCrushGainRef.current = cleanCrushGain;
        crushGainRef.current = crushGain;
        
        masterGain.connect(cleanCrushGain);
        masterGain.connect(crushNode);
        crushNode.connect(crushGain);
        
        const postCrushNode = ctx.createGain();
        cleanCrushGain.connect(postCrushNode);
        crushGain.connect(postCrushNode);

        const filterNode = ctx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.Q.value = 5; 
        filterNodeRef.current = filterNode;
        postCrushNode.connect(filterNode);

        const driveNode = ctx.createWaveShaper();
        const k = 400; const deg = Math.PI / 180;
        const driveCurve = new Float32Array(44100);
        for (let i = 0; i < 44100; ++i ) {
          const x = i * 2 / 44100 - 1;
          driveCurve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        driveNode.curve = driveCurve;
        driveNode.oversample = '4x';
        
        const cleanDriveGain = ctx.createGain();
        const driveGain = ctx.createGain();
        cleanDriveGainRef.current = cleanDriveGain;
        driveGainRef.current = driveGain;

        filterNode.connect(cleanDriveGain);
        filterNode.connect(driveNode);
        driveNode.connect(driveGain);
        
        const postDriveNode = ctx.createGain();
        cleanDriveGain.connect(postDriveNode);
        driveGain.connect(postDriveNode);

        const compNode = ctx.createDynamicsCompressor();
        compNodeRef.current = compNode;
        postDriveNode.connect(compNode);

        const delayNode = ctx.createDelay(2.0);
        const delayFeedback = ctx.createGain();
        delayFeedback.gain.value = 0.4; 
        const delayWetGain = ctx.createGain();
        delayNodeRef.current = delayNode;
        delayWetGainRef.current = delayWetGain;
        
        compNode.connect(delayNode);
        delayNode.connect(delayFeedback);
        delayFeedback.connect(delayNode);
        delayNode.connect(delayWetGain);

        const dryReverbGain = ctx.createGain();
        const wetReverbGain = ctx.createGain();
        dryReverbGainRef.current = dryReverbGain;
        wetReverbGainRef.current = wetReverbGain;

        const convolver = ctx.createConvolver();
        const rvLength = ctx.sampleRate * 2.5; 
        const impulse = ctx.createBuffer(2, rvLength, ctx.sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        for (let i = 0; i < rvLength; i++) {
          const decay = Math.exp(-i / (ctx.sampleRate * 0.4)); 
          left[i] = (Math.random() * 2 - 1) * decay;
          right[i] = (Math.random() * 2 - 1) * decay;
        }
        convolver.buffer = impulse;

        compNode.connect(dryReverbGain);
        compNode.connect(convolver);
        convolver.connect(wetReverbGain);

        const finalMasterVolNode = ctx.createGain();
        dryReverbGain.connect(finalMasterVolNode);
        wetReverbGain.connect(finalMasterVolNode);
        delayWetGain.connect(finalMasterVolNode);
        finalMasterVolNode.connect(ctx.destination);
        masterGainRef.current.finalVol = finalMasterVolNode;

        // --- CINTA DE GRABACIÓN ---
        if (!recorderNodeRef.current) {
          const recorder = ctx.createScriptProcessor(4096, 2, 2);
          recorder.onaudioprocess = (e) => {
            if (!isRecordingRef.current) return;
            const leftData = e.inputBuffer.getChannelData(0);
            const rightData = e.inputBuffer.getChannelData(1);
            audioChunksRef.current[0].push(new Float32Array(leftData));
            audioChunksRef.current[1].push(new Float32Array(rightData));
          };
          finalMasterVolNode.connect(recorder);
          recorder.connect(ctx.destination);
          recorderNodeRef.current = recorder;
        }

        // Init values para que inicie limpio
        masterGain.gain.value = 1.0;
        
        cleanCrushGain.gain.value = 1 - masterCrush;
        crushGain.gain.value = masterCrush;
        
        filterNode.frequency.value = 200 + Math.pow(masterFilter, 3) * 19800;
        
        cleanDriveGain.gain.value = 1 - masterDrive;
        driveGain.gain.value = masterDrive;
        
        compNode.threshold.value = -40 * masterComp;
        compNode.ratio.value = 1 + 19 * masterComp;
        compNode.knee.value = 10;
        
        const beatDuration = 60.0 / tempo;
        delayNode.delayTime.value = beatDuration * 0.75;
        delayWetGain.gain.value = masterDelay;
        
        wetReverbGain.gain.value = masterReverb;
        dryReverbGain.gain.value = 1 - (masterReverb * 0.3);
        
        finalMasterVolNode.gain.value = masterVol;

      } catch (e) {
        console.error("Audio init error:", e);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    if (cleanCrushGainRef.current) {
      cleanCrushGainRef.current.gain.setTargetAtTime(1 - masterCrush, audioCtxRef.current.currentTime, 0.05);
      crushGainRef.current.gain.setTargetAtTime(masterCrush, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterCrush]);

  useEffect(() => {
    if (filterNodeRef.current) {
      const freq = 200 + Math.pow(masterFilter, 3) * 19800;
      filterNodeRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterFilter]);

  useEffect(() => {
    if (cleanDriveGainRef.current) {
      cleanDriveGainRef.current.gain.setTargetAtTime(1 - masterDrive, audioCtxRef.current.currentTime, 0.05);
      driveGainRef.current.gain.setTargetAtTime(masterDrive, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterDrive]);

  useEffect(() => {
    if (compNodeRef.current) {
      compNodeRef.current.threshold.setTargetAtTime(-40 * masterComp, audioCtxRef.current.currentTime, 0.05);
      compNodeRef.current.ratio.setTargetAtTime(1 + 19 * masterComp, audioCtxRef.current.currentTime, 0.05);
      compNodeRef.current.knee.setTargetAtTime(10, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterComp]);

  useEffect(() => {
    if (delayNodeRef.current) {
      const beatDuration = 60.0 / tempo;
      delayNodeRef.current.delayTime.setTargetAtTime(beatDuration * 0.75, audioCtxRef.current.currentTime, 0.1);
      delayWetGainRef.current.gain.setTargetAtTime(masterDelay, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterDelay, tempo]);

  useEffect(() => {
    if (wetReverbGainRef.current) {
      wetReverbGainRef.current.gain.setTargetAtTime(masterReverb, audioCtxRef.current.currentTime, 0.05);
      dryReverbGainRef.current.gain.setTargetAtTime(1 - (masterReverb * 0.3), audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterReverb]);

  useEffect(() => {
    if (masterGainRef.current && masterGainRef.current.finalVol) {
      masterGainRef.current.finalVol.gain.setTargetAtTime(masterVol, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVol]);

  useEffect(() => {
    const savedState = localStorage.getItem('rhythm_studio_analog');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.grid) setDrumGrid(state.grid);
        if (state.tempo) setTempo(state.tempo);
        if (state.volumes) setVolumes(state.volumes);
        if (state.pitches) setPitches(state.pitches);
        if (state.patternLength) setPatternLength(state.patternLength);
        if (state.masterDrive !== undefined) setMasterDrive(state.masterDrive);
        if (state.masterReverb !== undefined) setMasterReverb(state.masterReverb);
        if (state.masterFilter !== undefined) setMasterFilter(state.masterFilter);
        if (state.masterDelay !== undefined) setMasterDelay(state.masterDelay);
        if (state.masterComp !== undefined) setMasterComp(state.masterComp);
        if (state.masterCrush !== undefined) setMasterCrush(state.masterCrush);
        if (state.masterVol !== undefined) setMasterVol(state.masterVol);
      } catch (e) {}
    }
  }, []);

  const saveStateLocally = () => {
    const state = { 
      grid: drumGrid, tempo, volumes, pitches, patternLength, 
      masterDrive, masterReverb, masterFilter, masterDelay, masterComp, masterCrush, masterVol 
    };
    localStorage.setItem('rhythm_studio_analog', JSON.stringify(state));
  };

  const exportWav = (audioChunksLeft, audioChunksRight, sampleRate) => {
    let length = 0;
    audioChunksLeft.forEach(chunk => length += chunk.length);
    const leftBuffer = new Float32Array(length);
    const rightBuffer = new Float32Array(length);
    let offset = 0;
    for(let i=0; i<audioChunksLeft.length; i++) {
      leftBuffer.set(audioChunksLeft[i], offset);
      rightBuffer.set(audioChunksRight[i], offset);
      offset += audioChunksLeft[i].length;
    }

    const interleaved = new Float32Array(length * 2);
    for(let i=0; i<length; i++) {
      interleaved[i*2] = leftBuffer[i];
      interleaved[i*2+1] = rightBuffer[i];
    }

    const buffer = new ArrayBuffer(44 + interleaved.length * 2);
    const view = new DataView(buffer);
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    let index = 44;
    for (let i = 0; i < interleaved.length; i++) {
      let sample = Math.max(-1, Math.min(1, interleaved[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(index, sample, true);
      index += 2;
    }

    const blob = new Blob([view], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'rhythm_studio_bounce.wav';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRecordToggle = () => {
    initAudio();
    if (isRecording) {
      setIsRecording(false);
      isRecordingRef.current = false;
      exportWav(audioChunksRef.current[0], audioChunksRef.current[1], audioCtxRef.current.sampleRate);
      audioChunksRef.current = [[], []]; 
    } else {
      audioChunksRef.current = [[], []];
      setIsRecording(true);
      isRecordingRef.current = true;
      if (!isPlaying) togglePlay();
    }
  };

  const playInstrument = (inst, time) => {
    if (mutesRef.current[inst]) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    const vol = volumesRef.current[inst];
    const pitch = pitchesRef.current[inst];
    const instGain = ctx.createGain();
    instGain.gain.setValueAtTime(vol, time);
    instGain.connect(masterGainRef.current);

    const safeFreq = (f) => Math.min(f, ctx.sampleRate / 2);

    if (inst === 'BD') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(instGain);
      osc.frequency.setValueAtTime(safeFreq(150 * pitch), time);
      osc.frequency.exponentialRampToValueAtTime(safeFreq(45 * pitch), time + 0.1);
      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.start(time); osc.stop(time + 0.5);
    } else if (inst === 'SD') {
      const noiseSource = ctx.createBufferSource(); noiseSource.buffer = noiseBufferRef.current;
      const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = safeFreq(1000 * pitch);
      const noiseGain = ctx.createGain(); noiseGain.gain.setValueAtTime(0.8, time); noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      noiseSource.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(instGain);
      const toneOsc = ctx.createOscillator(); toneOsc.type = 'triangle'; toneOsc.frequency.setValueAtTime(safeFreq(180 * pitch), time);
      const toneGain = ctx.createGain(); toneGain.gain.setValueAtTime(0.5, time); toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      toneOsc.connect(toneGain); toneGain.connect(instGain);
      noiseSource.start(time); noiseSource.stop(time + 0.2);
      toneOsc.start(time); toneOsc.stop(time + 0.1);
    } else if (inst === 'CP') {
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = safeFreq(1500 * pitch); filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, time); gain.gain.setValueAtTime(1, time + 0.01); gain.gain.setValueAtTime(0, time + 0.02); gain.gain.setValueAtTime(1, time + 0.03); gain.gain.setValueAtTime(0, time + 0.04); gain.gain.setValueAtTime(1, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      const noiseSource = ctx.createBufferSource(); noiseSource.buffer = noiseBufferRef.current;
      noiseSource.connect(filter); filter.connect(gain); gain.connect(instGain);
      noiseSource.start(time); noiseSource.stop(time + 0.3);
    } else if (inst === 'CH' || inst === 'OH') {
      const source = ctx.createBufferSource(); source.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.setValueAtTime(safeFreq(7000 * pitch), time);
      const gain = ctx.createGain(); const isClosed = inst === 'CH'; const decay = isClosed ? 0.05 : 0.4;
      gain.gain.setValueAtTime(0.7, time); gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
      source.connect(filter); filter.connect(gain); gain.connect(instGain);
      source.start(time); source.stop(time + decay);
    } else if (inst === 'TM') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(instGain);
      osc.frequency.setValueAtTime(safeFreq(180 * pitch), time); osc.frequency.exponentialRampToValueAtTime(safeFreq(100 * pitch), time + 0.15);
      gain.gain.setValueAtTime(0.8, time); gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      osc.start(time); osc.stop(time + 0.4);
    } else if (inst === 'CB') {
      const osc1 = ctx.createOscillator(); osc1.type = 'square'; osc1.frequency.setValueAtTime(safeFreq(540 * pitch), time);
      const osc2 = ctx.createOscillator(); osc2.type = 'square'; osc2.frequency.setValueAtTime(safeFreq(800 * pitch), time);
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.setValueAtTime(safeFreq(860 * pitch), time);
      const gain = ctx.createGain(); gain.gain.setValueAtTime(0.5, time); gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(instGain);
      osc1.start(time); osc2.start(time); osc1.stop(time + 0.2); osc2.stop(time + 0.2);
    }
  };

  const scheduleNextStep = (step, baseTime) => {
    const currentGrid = drumGridRef.current;
    let time = baseTime;
    if (step % 2 !== 0) {
      const secondsPerBeat = 60.0 / tempoRef.current;
      time += (secondsPerBeat / 4) * swingRef.current;
    }
    Object.keys(currentGrid).forEach(inst => {
      if (currentGrid[inst][step]) playInstrument(inst, time);
    });
  };

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;
    while (nextStepTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      scheduleNextStep(currentStepRef.current, nextStepTimeRef.current);
      nextStepTimeRef.current += (60.0 / tempoRef.current) / 4;
      const scheduledStep = currentStepRef.current;
      setTimeout(() => setActiveStep(scheduledStep), 0);
      currentStepRef.current = (currentStepRef.current + 1) % (patternLengthRef.current * 16);
    }
    timerIdRef.current = setTimeout(scheduler, 25.0);
  }, []);

  const togglePlay = () => {
    initAudio();
    if (isPlaying) {
      clearTimeout(timerIdRef.current);
      setIsPlaying(false);
      setActiveStep(-1);
    } else {
      setIsPlaying(true);
      currentStepRef.current = 0; 
      nextStepTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
    }
  };

  const toggleStep = (inst, indexInPage) => {
    initAudio();
    const globalIndex = currentPage * 16 + indexInPage;
    setDrumGrid(prev => {
      const copy = { ...prev };
      const row = [...copy[inst]];
      row[globalIndex] = row[globalIndex] ? 0 : 1;
      copy[inst] = row;
      return copy;
    });
  };

  const PhysicalButton = ({ children, onClick, active, className="" }) => (
    <button 
      onClick={onClick}
      className={`relative rounded flex items-center justify-center font-bold transition-all
        ${active 
          ? 'bg-[#1e1a17] text-[#eab308] translate-y-[2px] shadow-none border-t border-black/80' 
          : 'bg-[#3b352d] text-[#a8a090] shadow-[0_4px_0_#1a1613] hover:brightness-110 -translate-y-[1px]'} 
        ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#111] flex justify-center py-0 sm:py-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <div className="w-full max-w-[500px] lg:max-w-none lg:w-[1100px] bg-gradient-to-b from-[#4a483e] via-[#3a382e] to-[#2b2a22] sm:rounded-xl shadow-2xl relative overflow-hidden border-l-[12px] border-r-[12px] border-[#2b1d14] flex flex-col lg:flex-row">
        
        <div className="flex-1 flex flex-col border-b-2 lg:border-b-0 lg:border-r-4 border-[#1a1813] relative">
          
          {/* HEADER */}
          <div className="px-6 py-5 border-b-2 border-[#222] shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-gradient-to-r from-transparent to-black/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#d4d0c5]">
                  <Activity className="w-8 h-8 opacity-70" />
                  <h1 className="text-2xl font-black tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">
                    Rhythm Studio
                  </h1>
                </div>
                <span className="text-[9px] text-[#a09a88] font-mono tracking-widest pl-10 mt-1 opacity-80">Powered by Emeem</span>
              </div>
              
              <div className="bg-[#1a1205] border-2 border-black/80 rounded px-3 py-1 shadow-[inset_0_2px_8px_rgba(0,0,0,1)]">
                <span className="font-['Share_Tech_Mono'] text-xl text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,170,0,0.6)]">PRO FX</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#b8b29c] mb-1">SAVE</span>
                <PhysicalButton onClick={saveStateLocally} className="w-16 h-6 rounded-md bg-[#222] shadow-[0_3px_0_#000] text-[#a8a090] text-[8px]">SAVE</PhysicalButton>
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-bold mb-1 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-[#b8b29c]'}`}>REC</span>
                <PhysicalButton 
                  onClick={handleRecordToggle} 
                  active={isRecording}
                  className={`w-16 h-6 rounded-md shadow-[0_3px_0_#000] text-[8px] ${isRecording ? 'bg-rose-900 text-rose-400' : 'bg-[#222] text-[#a8a090]'}`}
                >
                  <Disc className="w-3 h-3" />
                </PhysicalButton>
              </div>

              <div className="flex flex-col items-center lg:hidden ml-auto">
                <span className="text-[10px] font-bold text-[#b8b29c] mb-1">MIXER & FX</span>
                <PhysicalButton onClick={() => setShowMixer(!showMixer)} active={showMixer} className="w-24 h-6 rounded-md bg-[#222] shadow-[0_3px_0_#000] text-transparent">.</PhysicalButton>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-b-2 border-[#222] flex justify-between items-end shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col items-center gap-2">
              <button onClick={togglePlay} className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 border-black/50 transition-all ${isPlaying ? 'bg-[#1a1a1a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] translate-y-[2px]' : 'bg-[#2a2a2a] shadow-[0_6px_0_#111,inset_0_2px_2px_rgba(255,255,255,0.1)]'}`}>
                <div className={`w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-b-[12px] border-b-transparent transition-colors ${isPlaying ? 'border-l-[#eab308] drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'border-l-[#16a34a] opacity-80'}`}></div>
              </button>
              <span className="text-[11px] font-bold text-[#b8b29c] tracking-widest mt-1">PLAY</span>
            </div>

            <div className="flex flex-col items-center">
              <RotaryKnob value={tempo} min={60} max={200} onChange={(v) => setTempo(Math.round(v))} size={60} />
              <div className="flex justify-between w-full px-2 mt-1">
                <span className="text-[8px] text-[#888] font-bold">60</span><span className="text-[8px] text-[#888] font-bold">200</span>
              </div>
              <span className="text-[11px] font-bold text-[#b8b29c] tracking-widest mt-1">TEMPO</span>
            </div>

            <div className="bg-[#1a1205] border-2 border-black/80 rounded-md px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,1)] mb-6">
              <span className="font-['Share_Tech_Mono'] text-3xl text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,170,0,0.6)]">{Math.round(tempo)}</span>
              <span className="font-['Share_Tech_Mono'] text-sm text-[#ffaa00]/70 ml-1">BPM</span>
            </div>

            <div className="flex flex-col items-center">
              <RotaryKnob value={swing} min={0} max={0.5} onChange={setSwing} size={60} />
              <div className="flex justify-between w-full px-2 mt-1">
                <span className="text-[8px] text-[#888] font-bold">0</span><span className="text-[8px] text-[#888] font-bold">MAX</span>
              </div>
              <span className="text-[11px] font-bold text-[#b8b29c] tracking-widest mt-1">SWING</span>
            </div>
          </div>

          <div className="px-3 sm:px-6 py-5 lg:flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.keys(PRESETS).map(key => (
                <PhysicalButton key={key} onClick={() => { setCurrentPreset(key); setDrumGrid(PRESETS[key].grid); setPatternLength(PRESETS[key].length || 1); setCurrentPage(0); }} active={currentPreset === key} className="px-3 py-1.5 text-[10px]">{PRESETS[key].name}</PhysicalButton>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {[1, 2, 3, 4].map(len => (
                <PhysicalButton key={len} onClick={() => setPatternLength(len)} active={patternLength === len} className="px-3 py-1.5 text-[10px]">{len} Bar{len>1?'s':''}</PhysicalButton>
              ))}
              <div className="w-px bg-black/40 mx-1"></div>
              {Array.from({ length: patternLength }).map((_, page) => (
                <PhysicalButton key={page} onClick={() => setCurrentPage(page)} active={currentPage === page} className="px-3 py-1.5 text-[10px]">{page * 16 + 1}-{page * 16 + 16}</PhysicalButton>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {INSTRUMENTS.map((inst) => {
                const pageSteps = drumGrid[inst.id].slice(currentPage * 16, (currentPage + 1) * 16);
                return (
                  <div key={inst.id} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center gap-1 w-8 sm:w-10 shrink-0">
                      <span className="text-[10px] font-bold text-[#b8b29c]">{inst.id}</span>
                      <button className="w-full h-5 sm:h-6 bg-[#3b2a20] rounded shadow-[0_3px_0_#1a110a] active:translate-y-[2px] active:shadow-none border border-[#4a3a30]" onClick={() => { initAudio(); playInstrument(inst.id, audioCtxRef.current?.currentTime || 0); }} />
                    </div>
                    <div className="flex-1 grid grid-cols-16 gap-0.5 sm:gap-1.5">
                      {pageSteps.map((val, stepInPage) => {
                        const globalIndex = currentPage * 16 + stepInPage;
                        const isActive = val === 1;
                        const isPlayhead = activeStep === globalIndex;
                        const isAlternateBeat = Math.floor(stepInPage / 4) % 2 === 1;

                        return (
                          <div key={stepInPage} className="flex flex-col items-center gap-1">
                            <div className={`w-3 h-1 rounded-[1px] shadow-inner transition-colors ${isActive || isPlayhead ? 'bg-[#ffaa00] shadow-[0_0_8px_rgba(255,170,0,0.8)]' : 'bg-black/80'}`}></div>
                            <button
                              onClick={() => toggleStep(inst.id, stepInPage)}
                              className={`w-full aspect-[2/3] rounded border border-black/40 transition-all
                                ${isActive ? 'bg-[#ffaa00] shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] brightness-110' : isAlternateBeat ? 'bg-[#6a685e] shadow-[0_3px_0_#2a2921]' : 'bg-[#8a887e] shadow-[0_3px_0_#4a4941]'}
                                active:translate-y-[2px] active:shadow-none
                              `}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`lg:w-[480px] shrink-0 bg-gradient-to-b from-[#3a3931] to-[#2a2921] flex-col ${showMixer ? 'flex' : 'hidden lg:flex'}`}>
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 border-2 border-[#5a584e] rounded-xl p-2 sm:p-4 bg-[#2a2923] shadow-inner flex-1 mb-6">
              {INSTRUMENTS.map((inst, idx) => (
                <div key={inst.id} className={`flex flex-col items-center pt-2 ${idx !== 6 ? 'border-r border-black/30' : ''}`}>
                  <span className={`text-[10px] lg:text-[11px] font-bold mb-4 ${inst.id === 'SD' ? 'text-[#a38a6a]' : inst.id === 'CP' ? 'text-orange-400' : inst.id === 'CH' ? 'text-yellow-400' : inst.id === 'OH' ? 'text-lime-400' : inst.id === 'TM' ? 'text-blue-400' : inst.id === 'CB' ? 'text-purple-400' : 'text-[#b8b29c]'}`}>
                    {inst.id}
                  </span>
                  <span className="text-[8px] font-bold text-[#888] mb-1">MUTE</span>
                  <button onClick={() => setMutes(prev => ({...prev, [inst.id]: !prev[inst.id]}))} className="w-4 h-8 bg-black/50 rounded-full shadow-inner relative flex justify-center mb-6 border border-white/5">
                    <div className={`w-3 h-4 bg-gradient-to-b from-[#eee] to-[#888] rounded-full shadow-md absolute transition-all ${mutes[inst.id] ? 'bottom-[2px]' : 'top-[2px]'}`}></div>
                  </button>
                  <span className="text-[8px] font-bold text-[#888] mb-1 text-center leading-none">PITCH</span>
                  <div className="mb-6">
                    <RotaryKnob value={pitches[inst.id]} min={0.5} max={2} onChange={(v) => setPitches(prev => ({...prev, [inst.id]: v}))} size={30} />
                  </div>
                  <span className="text-[8px] font-bold text-[#888] mb-1 text-center leading-none">VOL</span>
                  <div className="w-6 flex-1 min-h-[100px] lg:min-h-[150px] bg-black/80 rounded shadow-inner relative flex justify-center border border-white/5 mb-2">
                    <div className="absolute inset-y-2 w-full flex flex-col justify-between items-center opacity-30 pointer-events-none">
                      {[...Array(9)].map((_, i) => <div key={i} className="w-4 h-px bg-white"></div>)}
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05" value={volumes[inst.id]} onChange={(e) => setVolumes(prev => ({...prev, [inst.id]: parseFloat(e.target.value)}))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10" style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                    />
                    <div className={`w-5 h-8 ${inst.capColor} rounded shadow-lg border border-black/50 absolute pointer-events-none transition-all`} style={{ bottom: `${volumes[inst.id] * 100}%`, transform: 'translateY(50%)' }}>
                      <div className="w-full h-1 bg-black/40 mt-3.5 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-[#5a584e] rounded-xl p-4 bg-[#2a2923] shadow-inner relative">
              <div className="absolute -top-3 left-4 bg-[#2a2923] px-2 text-[10px] font-bold text-[#b8b29c] tracking-widest flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> MASTER FX STUDIO
              </div>

              <div className="grid grid-cols-3 gap-y-6 gap-x-2 mt-2">
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterDrive} min={0} max={1} onChange={setMasterDrive} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">DRIVE</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterCrush} min={0} max={1} onChange={setMasterCrush} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">LO-FI</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterComp} min={0} max={1} onChange={setMasterComp} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">COMP</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterFilter} min={0} max={1} onChange={setMasterFilter} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">MOOG LPF</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterDelay} min={0} max={1} onChange={setMasterDelay} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">DELAY</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotaryKnob value={masterReverb} min={0} max={1} onChange={setMasterReverb} size={45} isMetallic={true} />
                  <span className="text-[9px] font-bold text-[#b8b29c] tracking-widest mt-2">REVERB</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/30 flex items-center justify-between gap-4">
                 <span className="text-[10px] font-bold text-[#b8b29c] tracking-widest">OUTPUT</span>
                 <div className="flex-1 h-4 bg-black/80 rounded shadow-inner relative flex items-center border border-white/5">
                    <input type="range" min="0" max="1" step="0.05" value={masterVol} onChange={(e) => setMasterVol(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
                    <div className="w-5 h-7 bg-[#d4d0c5] rounded shadow-lg border border-black/50 absolute pointer-events-none transition-all" style={{ left: `${masterVol * 100}%`, transform: 'translateX(-50%)' }}>
                      <div className="w-0.5 h-full bg-black/40 mx-auto"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `.grid-cols-16 { grid-template-columns: repeat(16, minmax(0, 1fr)); }`}} />
    </div>
  );
}
