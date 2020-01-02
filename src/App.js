import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clock from './Clock';

function App() {
  return (
    <div className="App d-flex flex-column m-auto" style={{width: '30%'}}>
      <Clock />
    </div>
  );
}

export default App;
