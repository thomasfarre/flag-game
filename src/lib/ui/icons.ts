export type IconName = 'tick' | 'cross' | 'info';

export const icons: Record<IconName, string> = {
  tick: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9.5 17.5 4.8 12.8l1.4-1.4 3.3 3.32 7.3-7.3 1.4 1.4z"/></svg>`,
  cross: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m12 10.586 5.657-5.657 1.414 1.414L13.414 12l5.657 5.657-1.414 1.414L12 13.414l-5.657 5.657-1.414-1.414L10.586 12 4.929 6.343l1.414-1.414z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm1.25 4.5h-2.5v7h2.5z"/></svg>`
};
