import { writable } from "svelte/store"

export const processing = writable<boolean>(false);
export const recording = writable<boolean>(false);
export const saving = writable<boolean>(false);