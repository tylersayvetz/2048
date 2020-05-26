import React from 'react';
import './App.css';
import Twenty48 from './2048';




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Use the Arrow Keys to Play!</h1>
        <Twenty48/>
        <a id="github-link" href="https://github.com/tylersayvetz/2048">GitHub</a>
        <a href="http://tylersayvetz.com">Creator</a>
      </header>
    </div>
  );
}

export default App;
