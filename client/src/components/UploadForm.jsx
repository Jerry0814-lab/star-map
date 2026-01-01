import React, { useState } from 'react';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  // 默认坐标：北京附近
  const [lng, setLng] = useState('116.40');
  const [lat, setLat] = useState('39.90');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
        setFile(e.target.files[0]);
        // 注意：这里省略了自动读取 EXIF GPS 的功能以降低复杂度。
        // 实际项目中可使用 'exif-js' 库在此处自动填充经纬度。
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('⚠️ 请选择一张图片');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    // 使用 FormData 构建用于上传文件的数据对象
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('lng', lng);
    formData.append('lat', lat);

    try {
      const response = await fetch('https://star-map.onrender.com/api/photos', {
        method: 'POST',
        body: formData,
        // 注意：fetch 会自动设置 content-type 为 multipart/form-data，无需手动设置
      });

      if (response.ok) {
        setMessage('✅ 发布成功！');
        // 清空表单
        setTitle(''); setDesc(''); setFile(null);
        // 通知父组件刷新数据
        if (onUploadSuccess) onUploadSuccess();
        // 2秒后自动切换回地图
        setTimeout(() => {
            onUploadSuccess(true); 
        }, 2000)

      } else {
        const errData = await response.json();
        setMessage(`❌ 失败: ${errData.error}`);
      }
    } catch (error) {
      setMessage('❌ 网络错误，请检查后端是否启动');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', color: '#fbceb1' }}>上传星空照片</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">选择图片 (必填)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">标题 (必填)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="例如：珠峰下的银河" required />
        </div>

        <div className="form-group">
          <label className="form-label">文案/故事</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="form-textarea" placeholder="讲述照片背后的故事..." />
        </div>

        <div className="form-group">
           <label className="form-label">拍摄位置 (经度, 纬度)</label>
           <div className="coords-group">
             <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className="form-input" placeholder="经度 (Lng)" required />
             <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className="form-input" placeholder="纬度 (Lat)" required />
           </div>
           <small style={{color: '#aaa', fontSize: '12px'}}>* 可以在地图网站(如Google Maps)上右键获取经纬度。</small>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '正在发布...' : '发布星空'}
        </button>
        {message && <p className="success-msg">{message}</p>}
      </form>
    </div>
  );
};

export default UploadForm;