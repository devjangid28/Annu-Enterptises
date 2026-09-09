import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOrderById } from '../utils/storage';
import CustomerForm from '../components/Invoice/CustomerForm';
import OrderDetailsForm from '../components/Invoice/OrderDetailsForm';
import InvoiceItems from '../components/Invoice/InvoiceItems';
import TaxSection from '../components/Invoice/TaxSection';
import InvoicePreview from '../components/Invoice/InvoicePreview';
import './Pages.css';

const EditInvoice = () => {
  const { id } = useParams();
  const { addOrder, settings } = useApp();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const order = getOrderById(id);
    if (order) {
      setInvoice({ ...order });
    } else {
      navigate('/orders');
    }
  }, [id, navigate]);

  const updateInvoice = useCallback((updates) => {
    setInvoice(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  const validate = () => {
    if (!invoice) return false;
    const newErrors = {};
    if (!invoice.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!invoice.invoiceDate.trim()) newErrors.invoiceDate = 'Invoice date is required';
    if (!invoice.customer.name.trim()) newErrors.customerName = 'Customer name is required';
    const hasValidItem = invoice.items.some(item => item.particulars.trim() && item.qty && item.rate);
    if (!hasValidItem) newErrors.items = 'At least one item with description, quantity and rate is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    addOrder(invoice);
    navigate('/orders');
  };

  const handlePrint = () => {
    const content = previewRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tax Invoice - ${invoice.invoiceNumber}</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; }
            .invoice-page { width: 210mm; min-height: 297mm; }
            .invoice-paper { padding: 10mm; font-family: 'Times New Roman', Times, serif; font-size: 11px; line-height: 1.4; color: #000; }
            .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 4px; }
            .inv-header-left { display: flex; gap: 12px; flex: 1; }
            .inv-logo-area { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #ccc; }
            .inv-logo-img { max-width: 76px; max-height: 76px; object-fit: contain; }
            .inv-logo-placeholder { color: #aaa; font-size: 12px; font-style: italic; }
            .inv-company-name { font-size: 20px; font-weight: bold; letter-spacing: 2px; margin-bottom: 2px; }
            .inv-address-line { font-size: 10px; line-height: 1.3; }
            .inv-contact { font-size: 9.5px; line-height: 1.3; }
            .inv-header-right { text-align: right; flex-shrink: 0; padding-left: 12px; font-size: 10px; }
            .inv-products-label { font-weight: bold; margin-bottom: 2px; font-size: 11px; }
            .inv-product-item { font-size: 10px; line-height: 1.3; }
            .inv-title-section { text-align: center; padding: 6px 0; border-bottom: 2px solid #000; margin-bottom: 4px; }
            .inv-title { font-size: 18px; font-weight: bold; letter-spacing: 3px; }
            .inv-subtitle { font-size: 9px; font-style: italic; margin-top: 2px; }
            .inv-info-section { display: flex; border-bottom: 1px solid #000; margin-bottom: 4px; min-height: 80px; }
            .inv-info-left { flex: 1; padding: 6px 8px 6px 0; border-right: 1px solid #000; }
            .inv-info-right { flex: 1; padding: 6px 0 6px 8px; }
            .inv-label-bold { font-weight: bold; }
            .inv-customer-block { margin-bottom: 10px; }
            .inv-customer-name { font-weight: bold; font-size: 12px; margin: 2px 0; }
            .inv-gstin { font-weight: bold; margin-top: 2px; }
            .inv-invoice-no-section { font-size: 12px; padding-top: 6px; border-top: 1px solid #999; margin-top: 4px; }
            .inv-order-row { display: flex; align-items: baseline; margin-bottom: 3px; font-size: 10.5px; }
            .inv-order-label { font-weight: bold; white-space: nowrap; margin-right: 8px; min-width: 100px; }
            .inv-order-line { border-bottom: 1px solid #999; flex: 1; min-height: 14px; padding: 0 2px; font-size: 10.5px; }
            .inv-order-line.short { flex: 0; min-width: 80px; }
            .inv-table-section { flex: 1; margin-bottom: 2px; }
            .inv-table { width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 10px; min-height: 200px; }
            .inv-table th, .inv-table td { border: 1px solid #000; padding: 3px 4px; vertical-align: top; }
            .inv-table th { background: #f0f0f0; font-weight: bold; text-align: center; font-size: 10px; letter-spacing: 0.5px; padding: 4px; }
            .inv-th-sr, .inv-td-sr { width: 30px; text-align: center; }
            .inv-th-particulars { width: auto; text-align: left; }
            .inv-th-hsn, .inv-td-hsn { width: 45px; text-align: center; }
            .inv-th-qty, .inv-td-qty { width: 50px; text-align: center; }
            .inv-th-rate, .inv-td-rate { width: 70px; text-align: right; }
            .inv-th-unit, .inv-td-unit { width: 55px; text-align: center; }
            .inv-th-amount, .inv-td-amount { width: 90px; text-align: right; }
            .inv-td-rate, .inv-td-amount { font-family: monospace, 'Times New Roman'; white-space: nowrap; }
            .inv-gstin-in-items { margin-top: 6px; font-size: 10px; text-decoration: underline; }
            .inv-empty-row { height: 20px; }
            .inv-tax-total-section { display: flex; justify-content: flex-end; margin-bottom: 2px; }
            .inv-tax-rows { width: 280px; border: 1px solid #000; }
            .inv-tax-row { display: flex; justify-content: space-between; padding: 3px 8px; border-bottom: 1px solid #ccc; font-size: 10.5px; }
            .inv-tax-row:last-child { border-bottom: none; }
            .inv-tax-label { font-weight: bold; }
            .inv-tax-value { font-family: monospace, 'Times New Roman'; }
            .inv-grand-total { border-top: 2px solid #000; font-size: 12px; font-weight: bold; background: #f9f9f9; }
            .inv-amount-words { padding: 6px 0; font-size: 11px; border-top: 1px solid #000; border-bottom: 1px solid #000; margin-bottom: 6px; }
            .inv-bottom-section { display: flex; gap: 12px; font-size: 10px; margin-top: auto; }
            .inv-bottom-left { flex: 1; }
            .inv-bottom-right { flex: 1; text-align: right; }
            .inv-tax-info { margin-bottom: 8px; line-height: 1.5; }
            .inv-bank-details { margin-bottom: 8px; line-height: 1.5; }
            .inv-notes { line-height: 1.5; }
            .inv-oe { font-weight: bold; font-size: 11px; margin-bottom: 8px; }
            .inv-declaration { margin-bottom: 16px; line-height: 1.5; text-align: left; }
            .inv-signatory { text-align: center; }
            .inv-signature-area { height: 40px; display: flex; align-items: center; justify-content: center; margin: 4px 0; }
            .inv-signature-img { max-height: 40px; max-width: 150px; object-fit: contain; }
            .inv-signature-line { border-bottom: 1px solid #000; width: 150px; display: inline-block; }
            .inv-signatory-label { font-size: 9px; font-weight: bold; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="edit-invoice-page">
      {!showPreview ? (
        <>
          <div className="page-header">
            <h1>Edit Invoice #{invoice.invoiceNumber || 'Untitled'}</h1>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="validation-errors">
              <strong>Please fix the following errors:</strong>
              <ul>
                {errors.invoiceNumber && <li>{errors.invoiceNumber}</li>}
                {errors.invoiceDate && <li>{errors.invoiceDate}</li>}
                {errors.customerName && <li>{errors.customerName}</li>}
                {errors.items && <li>{errors.items}</li>}
              </ul>
            </div>
          )}

          <div className="form-section">
            <h3 className="section-title">Invoice Number & Date</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Invoice No. *</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Invoice Date *</label>
                <input
                  type="text"
                  value={invoice.invoiceDate}
                  onChange={(e) => updateInvoice({ invoiceDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <CustomerForm
            customer={invoice.customer}
            onChange={(customer) => updateInvoice({ customer })}
          />

          <OrderDetailsForm
            orderDetails={invoice.orderDetails}
            onChange={(orderDetails) => updateInvoice({ orderDetails })}
          />

          <InvoiceItems
            items={invoice.items}
            onChange={(items) => {
              const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.netAmount) || 0), 0);
              const taxType = invoice.taxType;
              let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
              if (taxType === 'cgst_sgst') {
                cgstAmount = subtotal * invoice.cgstRate / 100;
                sgstAmount = subtotal * invoice.sgstRate / 100;
              } else {
                igstAmount = subtotal * invoice.igstRate / 100;
              }
              updateInvoice({
                items,
                subtotal,
                cgstAmount, sgstAmount, igstAmount,
                grandTotal: subtotal + cgstAmount + sgstAmount + igstAmount
              });
            }}
            gstin={settings.gstin || '27AAHCN8260F1ZA'}
          />

          <TaxSection
            invoice={invoice}
            onChange={(taxData) => updateInvoice(taxData)}
            settings={settings}
          />

          <div className="form-section">
            <h3 className="section-title">Notes (Optional)</h3>
            <div className="form-group full-width">
              <textarea
                value={invoice.notes || ''}
                onChange={(e) => updateInvoice({ notes: e.target.value })}
                placeholder="Leave blank to use default company notes"
                rows={4}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={handleUpdate}>
              Update Order
            </button>
            <button className="btn-secondary" onClick={() => setShowPreview(true)}>
              Preview
            </button>
            <button className="btn-outline" onClick={() => navigate('/orders')}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="preview-mode">
          <div className="preview-actions">
            <button className="btn-secondary" onClick={() => setShowPreview(false)}>
              Back to Edit
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              Print
            </button>
          </div>
          <InvoicePreview ref={previewRef} invoice={invoice} printable />
        </div>
      )}
    </div>
  );
};

export default EditInvoice;
