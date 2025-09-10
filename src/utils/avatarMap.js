// This file tells the library how to resolve a textual avatar name to a .riv file.
// Add new entries whenever you drop a new .riv asset into src/avatars/.

export const avatarMap = {
    // key = name the consumer will pass to loadAvatar()
    // value = a function that returns a dynamic import of the .riv file.
    // The default export of the import is the URL string that Vite generates.
    benny: () => import('../avatars/benny.riv'),
    // example: other: () => import('../avatars/other-avatar.riv')
};