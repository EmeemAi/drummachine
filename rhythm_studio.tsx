import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Square, Volume2, VolumeX, Settings, 
  Trash2, Sliders, Cpu, Save, FolderOpen, 
  Download, Activity, ArrowRight, Minus, Plus, Repeat, Layers,
  Radio, Zap
} from 'lucide-react';

// Utilidad para repetir patrones de 16 pasos 4 veces
const rep16 = (arr) => [...arr, ...arr, ...arr, ...arr];

// Instrumentos y sus colores
const INSTRUMENTS = [
  { id: 'BD', name: 'KICK', color: 'bg-rose-500', shadow: 'shadow-rose-500', text: 'text-rose-500' },
  { id: 'SD', name: 'SNARE', color: 'bg-amber-500', shadow: 'shadow-amber-500', text: 'text-amber-500' },
  { id: 'CP', name: 'CLAP', color: 'bg-orange-400', shadow: 'shadow-orange-400', text: 'text-orange-400' },
  { id: 'CH', name: 'C. HAT', color: 'bg-yellow-400', shadow: 'shadow-yellow-400', text: 'text-yellow-400' },
  { id: 'OH', name: 'O. HAT', color: 'bg-lime-400', shadow: 'shadow-lime-400', text: 'text-lime-400' },
  { id: 'TM', name: 'TOM', color: 'bg-cyan-400', shadow: 'shadow-cyan-400', text: 'text-cyan-400' },
  { id: 'CB', name: 'COWBELL', color: 'bg-indigo-400', shadow: 'shadow-indigo-400', text: 'text-indigo-400' }
];

const PRESETS = {
  vacio: {
    name: 'Vacío',
    length: 1,
    grid: {
      BD: Array(64).fill(0), SD: Array(64).fill(0), CP: Array(64).fill(0),
      CH: Array(64).fill(0), OH: Array(64).fill(0), TM: Array(64).fill(0), CB: Array(64).fill(0)
    }
  },
  house: {
    name: 'Classic House',
    length: 1,
    grid: {
      BD: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
      SD: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CP: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CH: rep16([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
      OH: rep16([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]),
      TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  trap: {
    name: 'Trap',
    length: 2,
    grid: {
      BD: rep16([1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]),
      SD: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      OH: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  reggaeton: {
    name: 'Dembow',
    length: 1,
    grid: {
      BD: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
      SD: rep16([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0]),
      CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
      OH: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  techno: {
    name: 'Techno',
    length: 4,
    grid: {
      BD: rep16([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
      SD: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CP: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CH: rep16([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
      OH: rep16([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
      TM: [
        ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
      ],
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  hiphop: {
    name: 'Hip Hop',
    length: 4,
    grid: {
      BD: [
        ...[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        ...[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        ...[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        ...[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]
      ],
      SD: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
      OH: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]),
      TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  },
  dnb: {
    name: 'Drum & Bass',
    length: 2,
    grid: {
      BD: rep16([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]),
      SD: rep16([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
      CP: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CH: rep16([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
      OH: rep16([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]),
      TM: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      CB: rep16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  }
};

export default function RhythmStudio() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Estado Principal
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [swing, setSwing] = useState(0); 
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [activeStep, setActiveStep] = useState(-1);
  const [currentPreset, setCurrentPreset] = useState('vacio');
  const [showSettings, setShowSettings] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); 
  const [autoFollow, setAutoFollow] = useState(true);
  const [patternLength, setPatternLength] = useState(1);

  const [drumGrid, setDrumGrid] = useState(PRESETS.vacio.grid);

  // Mixer: Volumen, Mute y Pitch individual
  const [volumes, setVolumes] = useState({ BD: 0.9, SD: 0.8, CP: 0.7, CH: 0.6, OH: 0.6, TM: 0.8, CB: 0.5 });
  const [mutes, setMutes] = useState({ BD: false, SD: false, CP: false, CH: false, OH: false, TM: false, CB: false });
  const [pitches, setPitches] = useState({ BD: 1.0, SD: 1.0, CP: 1.0, CH: 1.0, OH: 1.0, TM: 1.0, CB: 1.0 });

  // Efectos Master
  const [masterDrive, setMasterDrive] = useState(0); // 0 a 1
  const [masterReverb, setMasterReverb] = useState(0); // 0 a 1

  // Referencias de Web Audio
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const noiseBufferRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Referencias de Nodos de Efectos
  const cleanGainRef = useRef(null);
  const driveGainRef = useRef(null);
  const wetReverbGainRef = useRef(null);
  const dryReverbGainRef = useRef(null);

  // Referencias mutables para el secuenciador
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
  const scheduleAheadTime = 0.1;
  const lookahead = 25.0;
  const timerIdRef = useRef(null);

  useEffect(() => {
    if (currentPage >= patternLength) setCurrentPage(patternLength - 1);
  }, [patternLength, currentPage]);

  useEffect(() => {
    if (autoFollow && activeStep !== -1) {
      const pageOfStep = Math.floor(activeStep / 16);
      if (pageOfStep !== currentPage && pageOfStep < patternLength) {
        setCurrentPage(pageOfStep);
      }
    }
  }, [activeStep, autoFollow, currentPage, patternLength]);

  // Inicialización de Audio
  const initAudio = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noiseBufferRef.current = buffer;

        // Estructura de Efectos
        const masterGain = ctx.createGain();
        masterGainRef.current = masterGain;

        // Drive (Distorsión)
        const cleanGain = ctx.createGain();
        const driveGain = ctx.createGain();
        cleanGainRef.current = cleanGain;
        driveGainRef.current = driveGain;

        const waveShaper = ctx.createWaveShaper();
        const k = 400; // Intensidad máxima de la curva
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i ) {
          const x = i * 2 / n_samples - 1;
          curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        waveShaper.curve = curve;
        waveShaper.oversample = '4x';

        masterGain.connect(cleanGain);
        masterGain.connect(waveShaper);
        waveShaper.connect(driveGain);

        // Suma de distorsión
        const preReverbNode = ctx.createGain();
        cleanGain.connect(preReverbNode);
        driveGain.connect(preReverbNode);

        // Reverb (Salón)
        const dryReverbGain = ctx.createGain();
        const wetReverbGain = ctx.createGain();
        dryReverbGainRef.current = dryReverbGain;
        wetReverbGainRef.current = wetReverbGain;

        const convolver = ctx.createConvolver();
        const rvLength = ctx.sampleRate * 2.5; // 2.5 segundos de cola
        const impulse = ctx.createBuffer(2, rvLength, ctx.sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        for (let i = 0; i < rvLength; i++) {
          const decay = Math.exp(-i / (ctx.sampleRate * 0.4)); // decaimiento exponencial
          left[i] = (Math.random() * 2 - 1) * decay;
          right[i] = (Math.random() * 2 - 1) * decay;
        }
        convolver.buffer = impulse;

        preReverbNode.connect(dryReverbGain);
        preReverbNode.connect(convolver);
        convolver.connect(wetReverbGain);

        // Analizador final
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        dryReverbGain.connect(analyser);
        wetReverbGain.connect(analyser);
        analyser.connect(ctx.destination);

        // Ajustar volúmenes iniciales
        masterGain.gain.value = masterVolume;
        cleanGain.gain.value = 1;
        driveGain.gain.value = 0;
        dryReverbGain.gain.value = 1;
        wetReverbGain.gain.value = 0;

      } catch (e) {
        console.error("Error al inicializar audio:", e);
      }
    }
    
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Efectos UI -> Nodos
  useEffect(() => {
    if (cleanGainRef.current && driveGainRef.current) {
      // Crossfade de Drive
      cleanGainRef.current.gain.setTargetAtTime(1 - masterDrive, audioCtxRef.current.currentTime, 0.05);
      driveGainRef.current.gain.setTargetAtTime(masterDrive, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterDrive]);

  useEffect(() => {
    if (wetReverbGainRef.current && dryReverbGainRef.current) {
      wetReverbGainRef.current.gain.setTargetAtTime(masterReverb, audioCtxRef.current.currentTime, 0.05);
      // Bajamos un poco la señal original seca si hay mucha reverb para compensar volumen
      dryReverbGainRef.current.gain.setTargetAtTime(1 - (masterReverb * 0.3), audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterReverb]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(masterVolume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume]);

  useEffect(() => {
    const savedState = localStorage.getItem('rhythm_studio_v3');
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
      } catch (e) {}
    }
  }, []);

  const saveStateLocally = () => {
    const state = { grid: drumGrid, tempo, volumes, pitches, patternLength, masterDrive, masterReverb };
    localStorage.setItem('rhythm_studio_v3', JSON.stringify(state));
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

    // Limitador de frecuencia para evitar errores de Web Audio API
    const safeFreq = (f) => Math.min(f, ctx.sampleRate / 2);

    if (inst === 'BD') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(instGain);
      osc.frequency.setValueAtTime(safeFreq(150 * pitch), time);
      osc.frequency.exponentialRampToValueAtTime(safeFreq(45 * pitch), time + 0.1);
      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.start(time);
      osc.stop(time + 0.5);
    } else if (inst === 'SD') {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBufferRef.current;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = safeFreq(1000 * pitch);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(instGain);

      const toneOsc = ctx.createOscillator();
      toneOsc.type = 'triangle';
      toneOsc.frequency.setValueAtTime(safeFreq(180 * pitch), time);
      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(0.5, time);
      toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      toneOsc.connect(toneGain);
      toneGain.connect(instGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.2);
      toneOsc.start(time);
      toneOsc.stop(time + 0.1);
    } else if (inst === 'CP') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = safeFreq(1500 * pitch);
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.setValueAtTime(1, time + 0.01);
      gain.gain.setValueAtTime(0, time + 0.02);
      gain.gain.setValueAtTime(1, time + 0.03);
      gain.gain.setValueAtTime(0, time + 0.04);
      gain.gain.setValueAtTime(1, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBufferRef.current;
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(instGain);
      noiseSource.start(time);
      noiseSource.stop(time + 0.3);
    } else if (inst === 'CH' || inst === 'OH') {
      const source = ctx.createBufferSource();
      source.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(safeFreq(7000 * pitch), time);
      const gain = ctx.createGain();
      const isClosed = inst === 'CH';
      const decay = isClosed ? 0.05 : 0.4;
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(instGain);
      source.start(time);
      source.stop(time + decay);
    } else if (inst === 'TM') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(instGain);
      osc.frequency.setValueAtTime(safeFreq(180 * pitch), time);
      osc.frequency.exponentialRampToValueAtTime(safeFreq(100 * pitch), time + 0.15);
      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      osc.start(time);
      osc.stop(time + 0.4);
    } else if (inst === 'CB') {
      const osc1 = ctx.createOscillator();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(safeFreq(540 * pitch), time);
      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(safeFreq(800 * pitch), time);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(safeFreq(860 * pitch), time);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(instGain);
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.2);
      osc2.stop(time + 0.2);
    }
  };

  const scheduleNextStep = (step, baseTime) => {
    const currentGrid = drumGridRef.current;
    let time = baseTime;
    if (step % 2 !== 0) {
      const secondsPerBeat = 60.0 / tempoRef.current;
      const stepDuration = secondsPerBeat / 4;
      time += stepDuration * swingRef.current;
    }

    Object.keys(currentGrid).forEach(inst => {
      if (currentGrid[inst][step]) {
        playInstrument(inst, time);
      }
    });
  };

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;

    while (nextStepTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNextStep(currentStepRef.current, nextStepTimeRef.current);
      
      const secondsPerBeat = 60.0 / tempoRef.current;
      const stepDuration = secondsPerBeat / 4; 
      
      nextStepTimeRef.current += stepDuration;
      
      const scheduledStep = currentStepRef.current;
      setTimeout(() => setActiveStep(scheduledStep), 0);

      const maxSteps = patternLengthRef.current * 16;
      currentStepRef.current = (currentStepRef.current + 1) % maxSteps;
    }
    
    timerIdRef.current = setTimeout(scheduler, lookahead);
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

  const loadPreset = (presetKey) => {
    setCurrentPreset(presetKey);
    setDrumGrid(PRESETS[presetKey].grid);
    setPatternLength(PRESETS[presetKey].length || 1);
    setCurrentPage(0);
  };

  const clearGrid = () => loadPreset('vacio');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight || 80;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
          const percent = barHeight / 255;
          ctx.fillStyle = `rgba(16, 185, 129, ${percent * 0.5})`;
          ctx.fillRect(x, height - (barHeight * (height / 255)), barWidth - 1, barHeight * (height / 255));
          x += barWidth;
        }
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col select-none antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER GLASSMORPHISM */}
      <header className="border-b border-white/5 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-6xl w-full mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Rhythm Studio <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Pro FX</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => saveStateLocally()} className="p-2.5 flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl border border-white/5 shadow-lg transition-all hover:bg-slate-700" title="Guardar Canción">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Save</span>
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2.5 flex items-center gap-2 rounded-xl border transition-all shadow-lg ${showSettings ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-800/80 border-white/5 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
              <Sliders className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Mixer & FX</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-2 sm:p-5 flex flex-col gap-5">
        
        {/* PANEL SUPERIOR: CONTROLES DE TRANSPORTE Y MIXER */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Transporte y Tempo */}
          <div className="xl:col-span-4 bg-slate-800/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <button
                onClick={togglePlay}
                className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 border border-white/10 ${
                  isPlaying 
                    ? 'bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] shadow-rose-900/50 scale-95' 
                    : 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-emerald-900/50'
                }`}
              >
                {isPlaying ? <Square className="w-6 h-6 fill-white text-white shadow-sm" /> : <Play className="w-7 h-7 fill-white text-white ml-1 shadow-sm" />}
              </button>

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tempo</span>
                  <span className="text-sm font-mono text-white font-bold">{tempo} <span className="text-slate-500 text-[10px]">BPM</span></span>
                </div>
                <input 
                  type="range" min="60" max="200" step="1" value={tempo} 
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-2 mt-2 rounded-full bg-slate-900/80 cursor-pointer shadow-inner border border-white/5"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 relative z-10">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Swing (Groove)</span>
                  <span className="text-[10px] font-mono text-emerald-400">{Math.round(swing * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.5" step="0.05" value={swing} 
                  onChange={(e) => setSwing(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2 mt-1 rounded-full bg-slate-900/80 cursor-pointer shadow-inner border border-white/5"
                />
            </div>
          </div>

          {/* Mixer + Master FX (Visible Condicionalmente) o Visualizador */}
          {showSettings ? (
            <div className="xl:col-span-8 bg-slate-800/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-4 shadow-2xl relative">
              
              {/* Instrument Mixer */}
              <div className="flex-1 grid grid-cols-4 sm:grid-cols-7 gap-2">
                {INSTRUMENTS.map(inst => (
                  <div key={inst.id} className="bg-black/40 p-2 rounded-2xl border border-white/5 flex flex-col items-center gap-2 shadow-inner">
                    <span className={`text-[9px] font-bold font-mono tracking-widest ${inst.text}`}>{inst.id}</span>
                    <button 
                      onClick={() => setMutes(prev => ({...prev, [inst.id]: !prev[inst.id]}))}
                      className={`w-full py-1.5 rounded-lg flex justify-center transition-all border ${mutes[inst.id] ? 'bg-rose-500/20 border-rose-500/30 text-rose-500 shadow-[inset_0_0_8px_rgba(244,63,94,0.3)]' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700'}`}
                    >
                      {mutes[inst.id] ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    
                    {/* Controles de Rueda / Fader */}
                    <div className="flex flex-col items-center w-full gap-2 mt-1">
                      {/* Pitch */}
                      <div className="flex flex-col items-center gap-1 w-full" title="Pitch (Afinación)">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Pitch</span>
                        <input 
                          type="range" min="0.5" max="2" step="0.05" value={pitches[inst.id]} 
                          onChange={(e) => setPitches(prev => ({...prev, [inst.id]: parseFloat(e.target.value)}))}
                          className={`w-full h-1 accent-indigo-400 cursor-pointer bg-slate-800 rounded-full`}
                        />
                      </div>
                      
                      {/* Volumen Vertical */}
                      <div className="flex flex-col items-center gap-1 w-full mt-2" title="Volumen">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Vol</span>
                        <input 
                          type="range" min="0" max="1" step="0.05" value={volumes[inst.id]} 
                          onChange={(e) => setVolumes(prev => ({...prev, [inst.id]: parseFloat(e.target.value)}))}
                          className={`h-12 w-2 accent-${inst.color.replace('bg-', '')} cursor-pointer`}
                          style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Separador */}
              <div className="w-px bg-white/10 hidden md:block"></div>

              {/* Master FX Panel */}
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex md:flex-col gap-4 shadow-inner min-w-[120px] justify-around">
                <div className="text-center w-full">
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">Master FX</span>
                </div>
                
                {/* Drive Knob */}
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className={`p-1.5 rounded-full ${masterDrive > 0 ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Drive</span>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={masterDrive} 
                    onChange={(e) => setMasterDrive(parseFloat(e.target.value))}
                    className="w-full md:w-2 md:h-12 accent-orange-500 mt-1 cursor-pointer"
                    style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                  />
                </div>

                {/* Reverb Knob */}
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className={`p-1.5 rounded-full ${masterReverb > 0 ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reverb</span>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={masterReverb} 
                    onChange={(e) => setMasterReverb(parseFloat(e.target.value))}
                    className="w-full md:w-2 md:h-12 accent-cyan-500 mt-1 cursor-pointer"
                    style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                  />
                </div>
              </div>

            </div>
          ) : (
            <div className="xl:col-span-8 bg-slate-800/40 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col justify-end p-3 shadow-2xl overflow-hidden relative min-h-[100px]">
              <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10 flex items-center gap-2">
                 <Activity className="w-3 h-3" /> Master Output
              </div>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
            </div>
          )}

        </div>

        {/* CONTENEDOR DEL SECUENCIADOR */}
        <div className="bg-slate-800/30 backdrop-blur-md p-3 sm:p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

          {/* Opciones Superiores de Patrón */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-white/5 relative z-10">
            
            {/* Presets */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 w-full xl:w-auto">
              {Object.keys(PRESETS).map(key => (
                <button 
                  key={key}
                  onClick={() => loadPreset(key)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all border shadow-sm ${
                    currentPreset === key 
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 border-indigo-400/50 text-white shadow-indigo-500/20' 
                      : 'bg-black/30 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {PRESETS[key].name}
                </button>
              ))}
              <div className="w-px h-6 bg-white/10 mx-1 shrink-0"></div>
              <button onClick={clearGrid} className="shrink-0 p-2 text-slate-500 hover:text-rose-400 bg-black/30 border border-white/5 rounded-xl hover:bg-slate-800 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Controles de Longitud y Páginas */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              
              {/* Length Selector */}
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Length:</div>
                {[1, 2, 3, 4].map(len => (
                  <button
                    key={len}
                    onClick={() => setPatternLength(len)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      patternLength === len 
                        ? 'bg-slate-700 text-white shadow-sm border border-white/10' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {len} Bar{len > 1 ? 's' : ''}
                  </button>
                ))}
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                {Array.from({ length: patternLength }).map((_, page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all ${
                      currentPage === page 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' 
                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    {page * 16 + 1}-{page * 16 + 16}
                  </button>
                ))}
              </div>

              {/* Auto-Follow Toggle */}
              <button
                onClick={() => setAutoFollow(!autoFollow)}
                className={`p-2 rounded-xl border transition-all ${
                  autoFollow 
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]' 
                    : 'bg-black/40 border-white/5 text-slate-500'
                }`}
                title="Seguir página automáticamente"
              >
                <Repeat className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Cuadrícula Principal (Grid) */}
          <div className="overflow-x-auto pb-4 custom-scrollbar relative z-10">
            <div className="min-w-[700px] flex flex-col gap-2 pt-2">
              {INSTRUMENTS.map((inst) => {
                const pageSteps = drumGrid[inst.id].slice(currentPage * 16, (currentPage + 1) * 16);

                return (
                  <div key={inst.id} className="flex items-center gap-3">
                    
                    {/* Label del Instrumento */}
                    <div 
                      className={`w-16 sm:w-20 shrink-0 h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-[9px] sm:text-[11px] select-none cursor-pointer transition-all ${
                        mutes[inst.id] 
                          ? 'opacity-40 bg-black/50 border-white/5 text-slate-600' 
                          : `bg-gradient-to-b from-slate-800 to-slate-900 border-white/10 ${inst.text} shadow-md hover:brightness-125`
                      }`}
                      onClick={() => { initAudio(); playInstrument(inst.id, audioCtxRef.current?.currentTime || 0); }}
                    >
                      <span className="tracking-widest">{inst.id}</span>
                      <span className="text-[7px] text-slate-500 font-mono hidden sm:block">{inst.name}</span>
                    </div>
                    
                    {/* Fila de Pads */}
                    <div className="grid grid-cols-16 gap-1.5 flex-1 bg-black/20 p-1.5 rounded-xl border border-white/5">
                      {pageSteps.map((val, stepInPage) => {
                        const globalIndex = currentPage * 16 + stepInPage;
                        const isActive = val === 1;
                        const isPlayhead = activeStep === globalIndex;
                        const isBeatStart = stepInPage % 4 === 0;

                        return (
                          <button
                            key={stepInPage}
                            onClick={() => toggleStep(inst.id, stepInPage)}
                            className={`h-10 sm:h-12 rounded-lg transition-all duration-75 relative overflow-hidden ${
                              isActive 
                                ? `${inst.color} border-transparent shadow-[0_0_12px_var(--tw-shadow-color)] ${inst.shadow} z-10 scale-[1.02]` 
                                : `bg-slate-800/80 hover:bg-slate-700 ${isBeatStart ? 'border-b-2 border-b-slate-600' : 'border-b-2 border-b-slate-800/50'}`
                            }`}
                          >
                            {isPlayhead && (
                              <div className="absolute inset-0 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20"></div>
                            )}
                            {isActive && (
                              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Indicadores de Tiempo (Playhead Track) */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-16 sm:w-20 shrink-0" />
                <div className="grid grid-cols-16 gap-1.5 flex-1 px-1.5">
                  {Array.from({ length: 16 }).map((_, stepInPage) => {
                    const globalIndex = currentPage * 16 + stepInPage;
                    const isPlayhead = activeStep === globalIndex;
                    return (
                      <div key={stepInPage} className="flex justify-center items-center h-4">
                        <div className={`transition-all duration-75 rounded-full ${
                          isPlayhead 
                            ? 'w-2 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' 
                            : 'w-1.5 h-1.5 bg-slate-700/50'
                        }`} />
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .grid-cols-16 { grid-template-columns: repeat(16, minmax(0, 1fr)); }
        
        /* Custom Scrollbar Premium */
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: rgba(0,0,0,0.2); 
          border-radius: 8px; 
          border: 1px solid rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255,255,255,0.1); 
          border-radius: 8px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </div>
  );
}
