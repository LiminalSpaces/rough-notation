// The draw animation's keyframes, put once into each document that shows an
// annotation. An element in a popout window (another document) needs them in
// that document's own head: the opener's styles do not apply there.
const KEYFRAMES_ID = 'rough-notation-keyframes';
export function ensureKeyframes(doc) {
    if (!doc.getElementById(KEYFRAMES_ID)) {
        const style = doc.createElement('style');
        style.id = KEYFRAMES_ID;
        style.textContent = `@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }`;
        doc.head.appendChild(style);
    }
}
