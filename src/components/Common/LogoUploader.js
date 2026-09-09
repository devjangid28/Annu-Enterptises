import React, { useRef } from 'react';
import './Common.css';

const LogoUploader = ({ logo, onLogoChange }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => onLogoChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="uploader">
      <label className="uploader-label">Company Logo</label>
      <div className="uploader-area">
        {logo ? (
          <div className="uploader-preview">
            <img src={logo} alt="Company Logo" className="logo-preview-img" />
            <button type="button" className="btn-remove" onClick={handleRemove}>Remove</button>
          </div>
        ) : (
          <div className="uploader-placeholder" onClick={() => inputRef.current.click()}>
            <span>Click to upload logo</span>
            <span className="uploader-hint">PNG, JPG up to 2MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default LogoUploader;
