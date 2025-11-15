function DJControls({ instaments, onInstramentToggle }) {
    return (
        <>
            <div>
                <select class="form-select" aria-label="Default select example">
                <option value="1">Select a song</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                </select>
            </div>


            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="bassline" checked={instaments} onChange={() => onInstramentToggle("bassline")}/>
                <label className="form-check-label" htmlFor="bassline">
                        Bassline
                    </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="d1" />
                <label className="form-check-label" htmlFor="d1">
                        d1
                    </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="d2"  />
                <label className="form-check-label" htmlFor="d2">
                    d2
                </label>
            </div>
        </>
    );
}

export default DJControls;