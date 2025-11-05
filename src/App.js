import './App.css';
import { use, useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
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



let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false);

    const handlePlay = () => {
        let outputText = Preprocess({ inputText: procText, volume: volume});
        globalEditor.setCode(outputText);
        globalEditor.evaluate();
    } 

    const handleStop = () => {
        globalEditor.stop();
    }

    const [procText, setProcText] = useState(stranger_tune);

    const [volume, setVolume] = useState(1);

    const [state, setState] = useState("stop");

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
            <h2>Strudel Demo</h2>
            <div className='controls'>
                <div className='controls-section'>
                    <PlayButton onPlay={() => {setState("play"); handlePlay()}} onStop={() => {setState("stop"); handleStop()}} />
                    <Volume volumeChange={volume} onVolumeChange={(e) => setVolume(e.target.value)}/>
                </div>
                <div className='controls-section'>
                    <DJControls  />
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