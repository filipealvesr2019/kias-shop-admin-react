import { atom } from 'jotai';

// Atoms for authentication
export const tokenAtom = atom(null);
export const roleAtom = atom(null);
export const loggedInAtom = atom(false);
export const isAdminAtom = atom(false);

// Other atoms for your application state can be added here
// ...

// Example of creating an atom for another state
// export const exampleAtom = atom(initialValue);
