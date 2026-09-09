import React from 'react';

const OrderDetailsForm = ({ orderDetails, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...orderDetails, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Order / Transport Information</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Order Ref. No.</label>
          <input
            type="text"
            value={orderDetails.orderRef}
            onChange={(e) => handleChange('orderRef', e.target.value)}
            placeholder="Order Reference"
          />
        </div>
        <div className="form-group">
          <label>Dated</label>
          <input
            type="text"
            value={orderDetails.dated}
            onChange={(e) => handleChange('dated', e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </div>
        <div className="form-group">
          <label>Challan No.</label>
          <input
            type="text"
            value={orderDetails.challanNo}
            onChange={(e) => handleChange('challanNo', e.target.value)}
            placeholder="Challan Number"
          />
        </div>
        <div className="form-group">
          <label>Challan Date</label>
          <input
            type="text"
            value={orderDetails.challanDate}
            onChange={(e) => handleChange('challanDate', e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </div>
        <div className="form-group full-width">
          <label>Dispatch Thru</label>
          <input
            type="text"
            value={orderDetails.dispatchThru}
            onChange={(e) => handleChange('dispatchThru', e.target.value)}
            placeholder="Dispatch Through"
          />
        </div>
        <div className="form-group">
          <label>RR / GR No.</label>
          <input
            type="text"
            value={orderDetails.rrGrNo}
            onChange={(e) => handleChange('rrGrNo', e.target.value)}
            placeholder="RR/GR Number"
          />
        </div>
        <div className="form-group">
          <label>RR / GR Date</label>
          <input
            type="text"
            value={orderDetails.rrGrDate}
            onChange={(e) => handleChange('rrGrDate', e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </div>
        <div className="form-group full-width">
          <label>Document Thru</label>
          <input
            type="text"
            value={orderDetails.documentThru}
            onChange={(e) => handleChange('documentThru', e.target.value)}
            placeholder="Document Through"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsForm;
