export default function Download_UploadButton({ songText, onUpload }) {

    const handelDownload = () => {
        const songName = prompt("Enter a name for your song:", "Enter Song Name");
        
        //user cancelled the prompt
        if(songName === null){
            return; 
        }

        //create a json object with song name, timestamp, and song data
        const jsonData = {
            songName: songName,
            timeStamp: new Date().toISOString(),
            songData: songText

        };
        //convert json object to string
        const jsonString = JSON.stringify(jsonData, null, 2);

        ///create a blob from the json string
        const blob = new Blob([jsonString], { type: "application/json" });

        //create a download link
        const downloadUrl = URL.createObjectURL(blob);

        //creates a hidden link and clicks it to start the download
        const downloadLink = document.createElement("a");
        downloadLink.href = downloadUrl;
        downloadLink.download = `${songName}-${Date.now()}.json`;
        downloadLink.click();

        //clean up the URL object
        URL.revokeObjectURL(downloadUrl);

    }

    //function to handle file upload
    const handelUpload = () => {

        //create a file input element
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";

        //when the user selects a file
        fileInput.onchange = (event) => {
            const file = event.target.files[0];

            //only proceed if the file is a json file
            if (file && file.type === "application/json") {
                const reader = new FileReader();

                
                reader.onload = (e) => {
                    try {
                        //parse the json data
                        const json = JSON.parse(e.target.result);
                        //check if the json has the songData field
                        if(json.songData){
                            onUpload(json.songData);
                        } else {
                            // invalid format
                            alert("Invalid file format.");
                        }
                    } catch (error) {
                        //error parsing json
                        alert("Error reading file.");
                    }
                };
                //read the file as text
                reader.readAsText(file);
            }
        };
        //open the file picker
        fileInput.click();
    }

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={handelDownload} >Download</button>
            <button type="button" className="btn btn-primary" onClick={handelUpload} >Upload</button>

        </div>
    )


}
