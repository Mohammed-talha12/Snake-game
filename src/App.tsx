/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden screen-tear">
      <div className="static-noise" />
      <div className="scanlines" />
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-8 mt-8">
        <div className="text-center border-b-4 border-fuchsia-500 pb-4 w-full max-w-2xl">
          <h1 
            className="text-4xl md:text-5xl font-display text-white mb-4 glitch-text uppercase" 
            data-text="SYS.CORE.OVERRIDE"
          >
            SYS.CORE.OVERRIDE
          </h1>
          <p className="text-fuchsia-500 font-mono text-xl tracking-widest uppercase bg-black inline-block px-2">
            STATUS: COMPROMISED // DIRECTIVE: EXECUTE_PROTOCOL
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SnakeGame />
        </div>

        <div className="w-full mt-2">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
