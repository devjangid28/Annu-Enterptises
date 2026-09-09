import React, { useRef } from 'react';
import './Common.css';

const SignatureUploader = ({ signature, onSignatureChange }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert('Signature file must be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => onSignatureChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onSignatureChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="uploader">
      <label className="uploader-label">Authorized Signatory</label>
      <div className="uploader-area">
        {signature ? (
          <div className="uploader-preview">
            <img src={signature} alt="Signature" className="signature-preview-img" />
            <button type="button" className="btn-remove" onClick={handleRemove}>Remove</button>
          </div>
        ) : (
          <div className="uploader-placeholder sig" onClick={() => inputRef.current.click()}>
            <span>Click to upload signature</span>
            <span className="uploader-hint">PNG, JPG up to 1MB</span>
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

export default SignatureUploader;
