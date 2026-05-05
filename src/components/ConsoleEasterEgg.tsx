/** ConsoleEasterEgg - ASCII art branding in browser dev tools */
'use client';

import { useEffect } from 'react';

export default function ConsoleEasterEgg() {
  useEffect(() => {
    const font = 'font-family: monospace; font-size: 12px;';
    const cyan = `color: #22d3ee; ${font}`;
    const pink = `color: #f472b6; ${font}`;
    const purple = `color: #c084fc; ${font}`;
    const blue = `color: #60a5fa; ${font}`;
    const teal = `color: #2dd4bf; ${font}`;
    const green = `color: #4ade80; ${font}`;
    const yellow = `color: #facc15; ${font}`;
    const white = `color: rgba(255,255,255,0.8); ${font}`;
    const dim = `color: rgba(255,255,255,0.6); ${font}`;

    console.log(
      '%c╔═══════════════════════════════════════════════════════════════╗\n' +
      '║                                                               ║\n' +
      '%c║   █████╗  ██████╗ ███╗   ██╗███████╗██╗██╗     ██╗            ║\n' +
      '%c║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║██║     ██║            ║\n' +
      '%c║  ███████║██║   ██║██╔██╗ ██║█████╗  ██║██║     ██║            ║\n' +
      '%c║  ██╔══██║██║   ██║██║╚██╗██║██╔══╝  ██║██║     ██║            ║\n' +
      '%c║  ██║  ██║╚██████╔╝██║ ╚████║███████╗██║███████╗███████╗       ║\n' +
      '%c║  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝╚══════╝       ║\n' +
      '%c║                                                               ║\n' +
      '%c║                 A. O N E I L L                                ║\n' +
      '%c║                                                               ║\n' +
      '╠═══════════════════════════════════════════════════════════════╣\n' +
      '║                                                               ║\n' +
      '%c║  AI & ML Developer | Software Engineer                        ║\n' +
      '║  Manchester, UK                                               ║\n' +
      '%c║                                                               ║\n' +
      '%c║  Built with: Next.js · Python · TypeScript · ML               ║\n' +
      '║  Focus: AI · Data · Performance · Systems                     ║\n' +
      '%c║                                                               ║\n' +
      '%c║  github.com/W17ANT                                            ║\n' +
      '%c║                                                               ║\n' +
      '╚═══════════════════════════════════════════════════════════════╝\n\n' +
      '%c  Looking to hire? Let\'s talk: Antony@aoneill.co.uk\n',
      cyan, pink, purple, blue, cyan, teal, green, cyan, yellow, cyan, white, cyan, dim, cyan, blue, cyan, green
    );

    console.log('%c👋 Thanks for checking out the console!', 'color: #60a5fa; font-weight: bold;');
  }, []);

  return null;
}
