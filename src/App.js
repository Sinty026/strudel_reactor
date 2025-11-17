import './App.css';
import { use, useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope, set } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DJControls from './Components/DJControls';
import PlayButton from './Components/PlayButton';
import PreprocessText from './Components/PreprocessText'
import  Volume from './Components/Volume';
import { Preprocess } from './utils/Preprocessing';
import { preconnect } from 'react-dom';
import Download_UploadButton from './Components/Download_UploadButton';


let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false);

    //Function for the playback
    const handlePlay = () => {
        let outputText = Preprocess({ inputText: procText, volume: volume, instruments: instruments });
        globalEditor.setCode(outputText);
        globalEditor.evaluate();
    } 

    //stops the playback
    const handleStop = () => {
        globalEditor.stop();
    }

    const [procText, setProcText] = useState(stranger_tune); //stores the current songs text
    const [volume, setVolume] = useState(1); //stores the current volume
    const [state, setState] = useState("stop"); //tracks if strudle is playing or stopped
    const [isMuted, setIsMuted] = useState(false); // whether the audio is muted
    const [lastVolume, setLastVolume] = useState(1); // stores the volume before muting
    const [instruments, setInstruments] = useState({ //stores which instruments are active
        bassline: true,
        drums1: true,
        drums2: true,
    }); // tracks which instraments are active

    //toggles instraments on and off
    const handleinstrumentsChange = (e) => {
        setInstruments(prev => ({...prev, [e]: !prev[e] }))};

    //adjusts the volume slider
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setLastVolume(newVolume);
    }

    //toggles mute on and off
    const handleMuteToggle = () => {
        if (!isMuted) {
            setLastVolume(volume);
            setVolume(0);
            setIsMuted(true);
        } else {
            setVolume(lastVolume);
            setIsMuted(false);
        }
    }

    useEffect(() => {
        if(state === "play"){
            handlePlay();
        }
    }, [volume])


    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
                
            document.getElementById('proc').value = stranger_tune
            globalEditor.setCode(procText);
        }
    }, [procText]);


    return (
        <div className='app'>
            <h2>Strudel Studio</h2>
            <div className='controls'>
                <div className='controls-section'>
                    <PlayButton onPlay={() => {setState("play"); handlePlay()}} onStop={() => {setState("stop"); handleStop()}} />
                    <Volume volumeChange={volume} onVolumeChange={handleVolumeChange} isMuted={isMuted} onMuteToggle={handleMuteToggle} />
                </div>
                <div className='controls-section'>
                    <DJControls  instruments={instruments} onInstrumentsoggle={handleinstrumentsChange}/>
                </div>
                <div className='downloadButton'>
                    <Download_UploadButton songText={procText}/>
                </div>
            </div>
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <h4>Text to preprocess:</h4>
                        <div className="col-md-6" style={{ height: '60vh', overflowY: 'auto' }}>
                            <PreprocessText defaultValue={procText} onChange={(e) => setProcText(e.target.value)}/>
                        </div>
                        <div className="col-md-6" style={{ height: '60vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );


}