export default function Volume({ volume, onVolumeChange, isMuted, onMuteToggle }) {
    return (
        <>
            <div>
                <label htmlFor="volumeRange" className="form-label">Volume:</label>
                <input type="range" className="form-range" min="0" max="1" step="0.1" onChange={onVolumeChange} disabled={isMuted} id="volumeRange" />
            </div>
            <div className="form-check form-switch">
                <label htmlFor="muteButton" className="form-label">Mute</label>
                <input className="form-check-input" type="checkbox" role="switch" id="muteButton" checked={isMuted} onChange={onMuteToggle}/>
            </div>
        </>
    );
}