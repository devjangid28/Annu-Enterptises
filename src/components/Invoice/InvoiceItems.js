import React from 'react';
import { generateId } from '../../utils/storage';
import { formatIndianCurrency } from '../../utils/numberToWords';

const InvoiceItems = ({ items, onChange, gstin }) => {
  const addItem = () => {
    onChange([
      ...items,
      { id: generateId(), particulars: '', hsn: '', qty: '', rate: '', unit: 'P. R. Ft.', netAmount: 0 }
    ]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        const qty = parseFloat(newItem.qty) || 0;
        const rate = parseFloat(newItem.rate) || 0;
        newItem.netAmount = qty * rate;
        return newItem;
      }
      return item;
    });
    onChange(updated);
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Invoice Items</h3>
      <div className="gstin-row">
        <label>Seller GSTIN</label>
        <input
          type="text"
          value={gstin}
          readOnly
          className="gstin-input"
        />
      </div>
      <div className="items-table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th className="col-sr">Sr.</th>
              <th className="col-particulars">Particulars</th>
              <th className="col-hsn">HSN</th>
              <th className="col-qty">Qty.</th>
              <th className="col-rate">Rate</th>
              <th className="col-unit">Unit</th>
              <th className="col-amount">Net Amount</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="col-sr">{String(index + 1).padStart(2, '0')}</td>
                <td className="col-particulars">
                  <textarea
                    value={item.particulars}
                    onChange={(e) => updateItem(item.id, 'particulars', e.target.value)}
                    placeholder="Product description / particulars"
                    rows={3}
                  />
                </td>
                <td className="col-hsn">
                  <input
                    type="text"
                    value={item.hsn}
                    onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                    placeholder="HSN"
                  />
                </td>
                <td className="col-qty">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="col-rate">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="col-unit">
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                  />
                </td>
                <td className="col-amount">
                  {formatIndianCurrency(item.netAmount)}
                </td>
                <td className="col-actions">
                  <div className="item-actions">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      title="Move Up"
                    >&#9650;</button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      title="Move Down"
                    >&#9660;</button>
                    <button
                      type="button"
                      className="btn-icon btn-danger"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      title="Remove"
                    >&#10005;</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-add-item" onClick={addItem}>
        + Add Item
      </button>
    </div>
  );
};

export default InvoiceItems;
