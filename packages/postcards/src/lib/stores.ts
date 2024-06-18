import { writable } from "svelte/store"

export const button1 = writable<boolean>(false);
export const button2 = writable<boolean>(false);
export const button3 = writable<boolean>(false);
export const processing = writable<boolean>(false);
export const recording = writable<boolean>(false);
export const message = writable<string>('');
