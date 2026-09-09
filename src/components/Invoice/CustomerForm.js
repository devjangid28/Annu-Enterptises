import React from 'react';

const CustomerForm = ({ customer, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...customer, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Customer Information</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Customer / Client Name *</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="M/s. Customer Name"
          />
        </div>
        <div className="form-group full-width">
          <label>Address Line 1</label>
          <input
            type="text"
            value={customer.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Address Line 1"
          />
        </div>
        <div className="form-group full-width">
          <label>Address Line 2</label>
          <input
            type="text"
            value={customer.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            placeholder="Address Line 2"
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={customer.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={customer.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State"
          />
        </div>
        <div className="form-group">
          <label>PIN</label>
          <input
            type="text"
            value={customer.pin}
            onChange={(e) => handleChange('pin', e.target.value)}
            placeholder="PIN Code"
          />
        </div>
        <div className="form-group">
          <label>GSTIN</label>
          <input
            type="text"
            value={customer.gstin}
            onChange={(e) => handleChange('gstin', e.target.value)}
            placeholder="GSTIN"
          />
        </div>
        <div className="form-group">
          <label>PAN (Optional)</label>
          <input
            type="text"
            value={customer.pan}
            onChange={(e) => handleChange('pan', e.target.value)}
            placeholder="PAN Number"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
