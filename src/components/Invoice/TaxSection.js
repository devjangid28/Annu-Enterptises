import React from 'react';
import { formatIndianCurrency } from '../../utils/numberToWords';

const TaxSection = ({ invoice, onChange, settings }) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.netAmount) || 0), 0);

  const handleTaxTypeChange = (type) => {
    const cgstRate = settings.cgstRate || 9;
    const sgstRate = settings.sgstRate || 9;
    const igstRate = settings.igstRate || 18;

    let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

    if (type === 'cgst_sgst') {
      cgstAmount = subtotal * cgstRate / 100;
      sgstAmount = subtotal * sgstRate / 100;
    } else {
      igstAmount = subtotal * igstRate / 100;
    }

    onChange({
      taxType: type,
      cgstRate, sgstRate, igstRate,
      cgstAmount, sgstAmount, igstAmount,
      subtotal,
      grandTotal: subtotal + cgstAmount + sgstAmount + igstAmount
    });
  };

  const handleRateChange = (field, value) => {
    const rate = parseFloat(value) || 0;
    const updated = { ...invoice, [field]: rate };
    const st = updated.taxType;
    let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

    if (st === 'cgst_sgst') {
      cgstAmount = subtotal * updated.cgstRate / 100;
      sgstAmount = subtotal * updated.sgstRate / 100;
    } else {
      igstAmount = subtotal * updated.igstRate / 100;
    }

    onChange({
      ...updated,
      cgstAmount, sgstAmount, igstAmount,
      subtotal,
      grandTotal: subtotal + cgstAmount + sgstAmount + igstAmount
    });
  };

  const handleOverrideTotal = (value) => {
    const val = parseFloat(value) || 0;
    onChange({ ...invoice, grandTotal: val });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Tax Section</h3>
      <div className="tax-info-row">
        <span className="tax-subtotal">Subtotal: <strong>{formatIndianCurrency(subtotal)}</strong></span>
      </div>
      <div className="tax-type-selector">
        <label>Tax Type:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="taxType"
              value="cgst_sgst"
              checked={invoice.taxType === 'cgst_sgst'}
              onChange={() => handleTaxTypeChange('cgst_sgst')}
            />
            CGST + SGST (Intra-State)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="taxType"
              value="igst"
              checked={invoice.taxType === 'igst'}
              onChange={() => handleTaxTypeChange('igst')}
            />
            IGST (Inter-State)
          </label>
        </div>
      </div>

      {invoice.taxType === 'cgst_sgst' ? (
        <div className="tax-rate-grid">
          <div className="form-group">
            <label>CGST Rate (%)</label>
            <input
              type="number"
              value={invoice.cgstRate}
              onChange={(e) => handleRateChange('cgstRate', e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>CGST Amount</label>
            <input type="text" value={formatIndianCurrency(invoice.cgstAmount)} readOnly />
          </div>
          <div className="form-group">
            <label>SGST Rate (%)</label>
            <input
              type="number"
              value={invoice.sgstRate}
              onChange={(e) => handleRateChange('sgstRate', e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>SGST Amount</label>
            <input type="text" value={formatIndianCurrency(invoice.sgstAmount)} readOnly />
          </div>
        </div>
      ) : (
        <div className="tax-rate-grid">
          <div className="form-group">
            <label>IGST Rate (%)</label>
            <input
              type="number"
              value={invoice.igstRate}
              onChange={(e) => handleRateChange('igstRate', e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>IGST Amount</label>
            <input type="text" value={formatIndianCurrency(invoice.igstAmount)} readOnly />
          </div>
        </div>
      )}

      <div className="grand-total-row">
        <span>Grand Total: <strong>{formatIndianCurrency(invoice.grandTotal)}</strong></span>
        <div className="override-total">
          <label>Override Total (optional):</label>
          <input
            type="number"
            value={invoice.grandTotal}
            onChange={(e) => handleOverrideTotal(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default TaxSection;
