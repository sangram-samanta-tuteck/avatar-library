import React from 'react';
import ReactDOM from 'react-dom/client';
import RiveAvatar from '../components/RiveAvatar.jsx';
import { avatarMap } from '../utils/avatarMap.js';
import { speak } from './speak.js';

/**
 * Loads an avatar by name and returns a **controller** object.
 *
 * The controller shape:
 *   {
 *     container: HTMLElement   // a <div> that already contains the rendered avatar
 *     rive: Rive | undefined   // the raw Rive instance (null until ready)
 *     mouthInput: StateMachineInput | undefined
 *   }
 *
 * @param {string} name  – avatar identifier (e.g. "benny")
 * @returns {Promise<Object>} controller
 */
export async function loadAvatar(name) {
    const loader = avatarMap[name.toLowerCase()];
    if (!loader) {
        throw new Error(
            `Avatar "${name}" not found. Available avatars: ${Object.keys(avatarMap).join(
                ', '
            )}`
        );
    }

    // Dynamically import the .riv asset – Vite gives us a URL string.
    const { default: src } = await loader();

    // Create a container element that the consumer can attach anywhere.
    const container = document.createElement('div');

    // Render the tiny RiveAvatar component into that container.
    const root = ReactDOM.createRoot(container);
    let controller = {
        container, // <-- consumer will append this to the DOM
        rive: undefined,
        mouthInput: undefined,
    };

    root.render(
        <RiveAvatar
            src={src}
            onReady={({ rive, mouthInput }) => {
                controller.rive = rive;
                controller.mouthInput = mouthInput;
            }}
        />
    );

    // Give the consumer a tiny pause so the component mounts before we resolve.
    // In practice the consumer can start calling `speak` as soon as they want;
    // the library guards against missing mouthInput.
    await new Promise((res) => setTimeout(res, 0));

    return controller;
}

/**
 * Re‑export the speak helper so consumers can do:
 *   import { loadAvatar, speak } from 'my-avatar-tts';
 */
export { speak };