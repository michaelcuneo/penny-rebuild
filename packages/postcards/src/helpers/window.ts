import { browser } from "$app/environment"

if (!browser) {
  globalThis.Buffer = Buffer;
  globalThis.window = {} as Window & typeof globalThis;
} else {
  globalThis.window = window;
}

export default globalThis;
