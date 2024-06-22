import { writable } from "svelte/store"

export const saving = writable<boolean>(false);