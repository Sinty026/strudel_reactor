import "./DJcontrols.css";

function DJControls({ instruments, onInstrumentsoggle, speed, onSpeedChange }) {
    return (
        <>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="bassline" checked={instruments.bassline} onChange={() => onInstrumentsoggle("bassline")}/>
                <label className="form-check-label" htmlFor="bassline">
                        Bassline
                    </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="drums1" checked={instruments.drums1} onChange={() => onInstrumentsoggle("drums1")}/>
                <label className="form-check-label" htmlFor="drums1">
                        Drums 1
                    </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="drums2" checked={instruments.drums2} onChange={() => onInstrumentsoggle("drums2")} />
                <label className="form-check-label" htmlFor="drums2">
                    Drums 2
                </label>
            </div>

            <div className="speed-control">
                <div class="mb-2" style={{ display:"flex", alignItems:"center", gap:"8px", paddingTop:"15px"}}>
                    <label htmlFor="speed" className="form-label">Speed: </label>
                    <input type="number" className="form-control" id="speed" placeholder="Speed" min="0.1" max="4" step="0.1" value={speed} onChange={(e) => onSpeedChange(e.target.value)}/>
                </div>
            </div>  
        </>
    );
}

export default DJControls;