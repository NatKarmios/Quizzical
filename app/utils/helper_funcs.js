import { remote, BrowserWindow } from 'electron';

export function delay(t: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

export function getWindow(): BrowserWindow {
  return remote.getCurrentWindow();
}
