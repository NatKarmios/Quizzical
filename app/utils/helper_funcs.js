import { remote, BrowserWindow } from 'electron';

export const delay = (t: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};

// eslint-disable-next-line arrow-body-style
export const getWindow = (): BrowserWindow => {
  return remote.getCurrentWindow();
};
