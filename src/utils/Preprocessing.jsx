export function Preprocess({inputText, volume, instruments}) {

    let outputText = inputText;

    outputText = outputText.replaceAll("{$VOLUME}", volume);
    outputText = outputText.replaceAll("{$MUTE_BASSLINE}", instruments.bassline ? "" : "_"); // Mutes bassline if false
    outputText = outputText.replaceAll("{$MUTE_DRUMS1}", instruments.drums1 ? "" : "_"); // Mutes drums 1 if false
    outputText = outputText.replaceAll("{$MUTE_DRUMS2}", instruments.drums2 ? "" : "_"); // Mutes drums 2 if false

    return outputText;
}