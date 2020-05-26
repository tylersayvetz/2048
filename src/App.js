import React from 'react';
import './App.css';
import Twenty48 from './2048';




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>2048</h1>
        <h3>Arrow keys to play.</h3>
        <Twenty48/>
        <a id="github-link" href="https://github.com/tylersayvetz/2048">GitHub</a>
        <a href="http://tylersayvetz.com">Creator</a>
      </header>
    </div>
  );
}

export default App;
