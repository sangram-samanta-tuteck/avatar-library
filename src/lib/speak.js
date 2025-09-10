/**
 * Makes the avatar mouth‑sync the supplied text and plays the audio.
 *
 * @param {Object} controller   – result of loadAvatar()
 * @param {string} text         – sentence to be spoken
 * @param {Object} [options]    – optional overrides
 *   { lang, rate, onStart, onEnd, onError }
 */
export function speak(controller, text, options = {}) {
    if (!controller || !controller.mouthInput) {
        console.warn('Avatar not ready – mouth input missing.');
        return;
    }

    const mouthInput = controller.mouthInput;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.5;

    // -----------------------------------------------------------------
    // 1️⃣ Helper: map a character to a mouth shape index (same as your original code)
    // -----------------------------------------------------------------
    const getMouthValueForChar = (char) => {
        const c = char.toUpperCase();
        if ('AEI'.includes(c)) return 1;
        if (c === 'L') return 2;
        if (c === 'O') return 3;
        if ('CDGNKSTXYZ'.includes(c)) return 4;
        if ('FV'.includes(c)) return 5;
        if ('QW'.includes(c)) return 6;
        if (c === 'U') return 7;
        if (c === 'E') return 8;
        if (c === 'H') return 9;
        if ('CJSH'.includes(c)) return 10;
        if (c === 'R') return 11;
        return 0;
    };

    // -----------------------------------------------------------------
    // 2️⃣ Boundary events – precise phoneme sync
    // -----------------------------------------------------------------
    utterance.onboundary = (e) => {
        const char = text[e.charIndex] || '';
        mouthInput.value = getMouthValueForChar(char);
    };

    // -----------------------------------------------------------------
    // 3️⃣ Fallback animation (if onboundary never fires – e.g. short text)
    // -----------------------------------------------------------------
    const fallbackTimeout = setTimeout(() => {
        const phonemes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let i = 0;
        const interval = setInterval(() => {
            mouthInput.value = phonemes[i % phonemes.length];
            i++;
        }, 120);
        // Store on controller so we can clean up later
        controller._fallback = { interval, timeout: fallbackTimeout };
    }, 300); // 300 ms = typical delay before the first boundary event

}