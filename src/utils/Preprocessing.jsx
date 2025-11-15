export function Preprocess({inputText, volume, instraments}) {

    let outputText = inputText;

    outputText = outputText.replaceAll("{$VOLUME}", volume);
    outputText = outputText.replaceAll("{$MUTE_BASSLINE}", instraments.bassline ? "" : "_"); // Mutes bassline if false

    return outputText;
}