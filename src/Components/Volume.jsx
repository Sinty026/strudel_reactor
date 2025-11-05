export default function Volume({ volume, onVolumeChange }) {
    return (
        <>
            <div>
                <label htmlFor="volumeRange" className="form-label">Volume:</label>
                <input type="range" className="form-range" min="0" max="1" step="0.1" onMouseUp={onVolumeChange} id="volumeRange" />
            </div>
            <div className="form-check form-switch">
                <label htmlFor="volumeRange" className="form-label">Mute</label>
                <input className="form-check-input" type="checkbox" role="switch" id="muteButton" />
            </div>
        </>
    );
}