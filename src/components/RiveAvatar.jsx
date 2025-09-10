import React, { useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

/**
 * Props:
 *   src          – URL of the .riv file (provided by loadAvatar)
 *   onReady      – callback(controller) called once rive & mouthInput are ready
 *
 * The component itself does **not** expose any UI – it only returns the canvas.
 * The consumer will render the returned `container` element (a <div>) that
 * holds this component.
 */
export default function RiveAvatar({ src, onReady }) {
    const [ready, setReady] = useState(false);
    const { rive, RiveComponent } = useRive({
        src,
        stateMachines: 'State Machine',
        autoplay: true,
    });

    // Grab the mouthMove input (the name you used in the Rive file)
    const mouthInput = useStateMachineInput(rive, 'State Machine', 'mouthMove', 0);

    // When rive and mouthInput are both defined, notify the parent
    useEffect(() => {
        if (rive && mouthInput) {
            setReady(true);
            onReady && onReady({ rive, mouthInput });
        }
    }, [rive, mouthInput, onReady]);

    // Render the canvas as soon as rive is instantiated (prevents flicker)
    return ready ? <RiveComponent style={{ width: 320, height: 320 }} /> : null;
}