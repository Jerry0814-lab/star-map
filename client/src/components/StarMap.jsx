import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 1. 设置 Token (这是公共测试用的，可以直接用)
mapboxgl.accessToken = 'pk.eyJ1IjoiamVycnkwODE0IiwiYSI6ImNtam9mM25xajMwbW8zaHB3M2FyZmk1c3AifQ.rmwFvxv61yOyCMdCEM74Fw';

const StarMap = ({ photos }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 防止地图重复初始化
    if (mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [110, 35],
      zoom: 1.5,
      projection: 'globe'
    });

    // 大气层效果
    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });
    
    map.addControl(new mapboxgl.NavigationControl());
    mapInstanceRef.current = map;

    return () => {
      map.remove();                // 销毁地图实例
      mapInstanceRef.current = null; // ✅ 关键修复：把引用也设为 null！
    };
  }, []);

  // 监听照片数据变化，更新标记点
  useEffect(() => {
    if (!mapInstanceRef.current || !photos) return;
    const map = mapInstanceRef.current;

    // 清除旧点
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // 添加新点
    photos.forEach((photo) => {
      if (!photo.location || photo.location.length !== 2) return;

      const popupHTML = `
        <div>
          <img src="${photo.imageUrl}" class="popup-img" alt="${photo.title}" style="width:100%;border-radius:4px;"/>
          <h3 class="popup-title" style="color:#fbceb1;margin:5px 0;">${photo.title}</h3>
          <p class="popup-desc" style="color:#ccc;font-size:12px;">${photo.description || '暂无描述'}</p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(popupHTML);

      const el = document.createElement('div');
      el.className = 'star-marker'; // 引用 CSS 里的星星样式

      const marker = new mapboxgl.Marker(el)
        .setLngLat(photo.location)
        .setPopup(popup)
        .addTo(map);
      
      markersRef.current.push(marker);
    });
  }, [photos]);

  // 2. 关键：这里必须有 className="map-wrapper"
  return <div ref={mapContainerRef} className="map-wrapper" />;
};

export default StarMap;