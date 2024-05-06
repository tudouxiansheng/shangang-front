const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = AudioContext ? new AudioContext() : '';
const soundBuffer = {
  getBuffer(link) {
    return new Promise((resolve, reject) => {
      if (audioCtx) {
        const request = new XMLHttpRequest();
        request.open('GET', link, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
          audioCtx.decodeAudioData(
            request.response,
            (buffer) => {
              resolve(buffer);
            },
            (e) => {
              console.log('reject');
              reject(e);
            },
          );
        };
        request.send();
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('not support AudioContext');
      }
    });
  },
  createSound(buffer) {
    // const analyser = audioCtx.createAnalyser();
    // const gainNode = audioCtx.createGain();
    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    // source.connect(analyser);
    // analyser.connect(gainNode);
    // gainNode.connect(audioCtx.destination);
    return source;
  },
};
export default soundBuffer;
