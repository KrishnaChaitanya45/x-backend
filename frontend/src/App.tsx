import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState<string>('');
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/auth/test')
      .then(console.log)
      .then((data) => {
        // setVideoSrc(data.videoSrc);
        console.log(data);
      });
  }, []);
  return (
    <div className="App">
      <h1>VIDEO STREAMING</h1>
      <video
        src={'http://localhost:5000/api/v1/auth/test'}
        style={{
          width: '600px',
          height: '400px',
          margin: '20px',
          border: '1px solid black',
          borderRadius: '10px',
        }}
        controls
      ></video>
    </div>
  );
}

export default App;
