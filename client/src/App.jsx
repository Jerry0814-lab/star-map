import React, { useState, useEffect } from 'react';
import StarMap from './components/StarMap';
import UploadForm from './components/UploadForm';
import './App.css'; // 这里引用了样式文件

function App() {
  const [view, setView] = useState('map');
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('连接后端失败:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUploadSuccess = (shouldSwitchToMap = false) => {
    fetchPhotos();
    if (shouldSwitchToMap) {
        setView('map');
    }
  };

  return (
    <div className="app-container">
      <div className="nav-bar">
        <button 
          className={`nav-btn ${view === 'map' ? 'active' : ''}`} 
          onClick={() => setView('map')}
        >
          🌏 全球星空图
        </button>
        <button 
          className={`nav-btn ${view === 'upload' ? 'active' : ''}`} 
          onClick={() => setView('upload')}
        >
          📷 上传作品
        </button>
      </div>

      {view === 'map' && <StarMap photos={photos} />}
      {view === 'upload' && <UploadForm onUploadSuccess={handleUploadSuccess} />}
    </div>
  );
}

export default App;