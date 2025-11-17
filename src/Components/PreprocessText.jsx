import './PreprocessText.css';

function PreprocessText({ value, onChange }) {
    return (
        <>
            <textarea className="form-control" rows="15" value={value} onChange={onChange} id="proc"></textarea>
        </>
    );

}

export default PreprocessText;