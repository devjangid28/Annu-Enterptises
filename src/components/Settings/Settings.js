import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LogoUploader from '../Common/LogoUploader';
import SignatureUploader from '../Common/SignatureUploader';
import './Settings.css';

const Settings = () => {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleNotesChange = (index, value) => {
    const newNotes = [...(form.invoiceNotes || [])];
    newNotes[index] = value;
    handleChange('invoiceNotes', newNotes);
  };

  const addNote = () => {
    handleChange('invoiceNotes', [...(form.invoiceNotes || []), '']);
  };

  const removeNote = (index) => {
    const newNotes = (form.invoiceNotes || []).filter((_, i) => i !== index);
    handleChange('invoiceNotes', newNotes);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Company Settings</h1>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-grid">
          {/* Company Info */}
          <div className="form-section">
            <h3 className="section-title">Company Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Company Name</label>
                <input type="text" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label>Address (use line breaks for multiple lines)</label>
                <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} />
              </div>
              <div className="form-group full-width">
                <label>Mobile Numbers (one per line)</label>
                <textarea value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)} rows={3} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="text" value={form.website} onChange={(e) => handleChange('website', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label>Products/Services (one per line)</label>
                <textarea value={form.products} onChange={(e) => handleChange('products', e.target.value)} rows={4} />
              </div>
            </div>
          </div>

          {/* Tax Info */}
          <div className="form-section">
            <h3 className="section-title">Tax Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>GSTIN (Seller)</label>
                <input type="text" value={form.gstin} onChange={(e) => handleChange('gstin', e.target.value)} />
              </div>
              <div className="form-group">
                <label>GST TIN No.</label>
                <input type="text" value={form.gstTin} onChange={(e) => handleChange('gstTin', e.target.value)} />
              </div>
              <div className="form-group">
                <label>CST TIN No.</label>
                <input type="text" value={form.cstTin} onChange={(e) => handleChange('cstTin', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Additional GST TIN No.</label>
                <input type="text" value={form.additionalGstTin} onChange={(e) => handleChange('additionalGstTin', e.target.value)} />
              </div>
              <div className="form-group">
                <label>PAN No.</label>
                <input type="text" value={form.pan} onChange={(e) => handleChange('pan', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="form-section">
            <h3 className="section-title">Bank Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Bank Name & Address</label>
                <input type="text" value={form.bankName} onChange={(e) => handleChange('bankName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input type="text" value={form.accountNumber} onChange={(e) => handleChange('accountNumber', e.target.value)} />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input type="text" value={form.ifsc} onChange={(e) => handleChange('ifsc', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Default Tax Rates */}
          <div className="form-section">
            <h3 className="section-title">Default Tax Rates</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>CGST Rate (%)</label>
                <input type="number" value={form.cgstRate} onChange={(e) => handleChange('cgstRate', parseFloat(e.target.value) || 0)} min="0" max="100" step="0.1" />
              </div>
              <div className="form-group">
                <label>SGST Rate (%)</label>
                <input type="number" value={form.sgstRate} onChange={(e) => handleChange('sgstRate', parseFloat(e.target.value) || 0)} min="0" max="100" step="0.1" />
              </div>
              <div className="form-group">
                <label>IGST Rate (%)</label>
                <input type="number" value={form.igstRate} onChange={(e) => handleChange('igstRate', parseFloat(e.target.value) || 0)} min="0" max="100" step="0.1" />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="form-section">
            <h3 className="section-title">Declaration</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Declaration Text</label>
                <textarea value={form.declaration} onChange={(e) => handleChange('declaration', e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3 className="section-title">Invoice Notes</h3>
            {(form.invoiceNotes || []).map((note, i) => (
              <div key={i} className="note-row">
                <span className="note-num">{i + 1}.</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => handleNotesChange(i, e.target.value)}
                  className="note-input"
                />
                <button type="button" className="btn-remove-note" onClick={() => removeNote(i)}>&#10005;</button>
              </div>
            ))}
            <button type="button" className="btn-add-note" onClick={addNote}>+ Add Note</button>
          </div>

          {/* Logo & Signature */}
          <div className="form-section">
            <h3 className="section-title">Logo & Signature</h3>
            <div className="form-grid">
              <div className="form-group">
                <LogoUploader
                  logo={form.logo}
                  onLogoChange={(val) => handleChange('logo', val)}
                />
              </div>
              <div className="form-group">
                <SignatureUploader
                  signature={form.signature}
                  onSignatureChange={(val) => handleChange('signature', val)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn-primary">
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
