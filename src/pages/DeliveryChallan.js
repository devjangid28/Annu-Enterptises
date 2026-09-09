import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById } from '../utils/storage';
import DeliveryChallanPreview from '../components/Invoice/DeliveryChallanPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Pages.css';

const DeliveryChallan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [challanData, setChallanData] = useState({
    challanNo: '',
    challanDate: '',
    orderRef: '',
    orderDated: ''
  });
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const order = getOrderById(id);
    if (order) {
      setInvoice(order);
      setChallanData({
        challanNo: order.orderDetails?.challanNo || '',
        challanDate: order.orderDetails?.challanDate || order.invoiceDate || '',
        orderRef: order.orderDetails?.orderRef || '',
        orderDated: order.orderDetails?.dated || ''
      });
    } else {
      navigate('/orders');
    }
  }, [id, navigate]);

  const handleChallanFieldChange = (field, value) => {
    setChallanData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const content = previewRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery Challan - ${challanData.challanNo || invoice.invoiceNumber}</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; }
            .dc-page { width: 210mm; min-height: 297mm; margin: 0; }
            .dc-paper {
              width: 210mm; min-height: 297mm;
              padding: 8mm 22mm 12mm 22mm;
              font-family: 'Times New Roman', Times, serif;
              font-size: 11px; line-height: 1.35; color: #000;
              position: relative;
            }
            .dc-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
            .dc-watermark-img { width: 160mm; height: 160mm; object-fit: contain; opacity: 0.04; filter: grayscale(100%); }
            .dc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5mm; position: relative; z-index: 1; min-height: 35mm; }
            .dc-header-left { display: flex; gap: 3mm; flex: 1; }
            .dc-logo-area { width: 24mm; height: 24mm; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 0.3px solid #ccc; }
            .dc-logo-img { max-width: 22mm; max-height: 22mm; object-fit: contain; }
            .dc-logo-placeholder { color: #aaa; font-size: 10px; font-style: italic; }
            .dc-company-info { flex: 1; }
            .dc-company-name { font-size: 16px; font-weight: bold; letter-spacing: 1.5px; margin-bottom: 1mm; }
            .dc-company-underline { width: 100%; height: 0.3px; background: #000; margin-bottom: 1.5mm; }
            .dc-address-line { font-size: 9px; line-height: 1.35; }
            .dc-mobile-line { font-size: 8.5px; line-height: 1.35; margin-top: 0.8mm; }
            .dc-email-web { display: flex; justify-content: space-between; font-size: 8.5px; line-height: 1.35; margin-top: 0.5mm; }
            .dc-website { text-align: right; }
            .dc-header-right { flex-shrink: 0; padding-left: 4mm; padding-top: 0.5mm; }
            .dc-product-item { font-size: 8.5px; line-height: 1.5; display: flex; align-items: center; gap: 1.5mm; }
            .dc-bullet { font-size: 5px; color: #000; }
            .dc-title-section { text-align: center; font-size: 15px; font-weight: bold; letter-spacing: 2.5px; padding: 3mm 0; position: relative; z-index: 1; }
            .dc-info-box { border: 0.4px solid #000; display: flex; min-height: 38mm; position: relative; z-index: 1; margin-bottom: 5px; }
            .dc-info-left { flex: 0 0 53%; padding: 3mm 4mm; display: flex; flex-direction: column; justify-content: space-around; }
            .dc-info-row { position: relative; margin-bottom: 2mm; }
            .dc-info-text { position: relative; z-index: 2; display: block; font-size: 10px; line-height: 1.2; }
            .dc-info-text.dc-bold { font-weight: bold; }
            .dc-info-line { display: block; width: 100%; border-bottom: 0.3px solid #999; margin-top: 4px; }
            .dc-info-right { flex: 1; padding: 3mm 4mm; display: flex; flex-direction: column; justify-content: space-around; }
            .dc-doc-row { display: flex; align-items: baseline; font-size: 10px; margin-bottom: 1mm; flex-wrap: wrap; gap: 1mm; }
            .dc-doc-label { font-weight: bold; white-space: nowrap; }
            .dc-doc-value { border-bottom: 0.3px solid #999; padding: 0 1mm; min-width: 10mm; white-space: nowrap; }
            .dc-table-section { margin-left: 0; margin-right: 0; position: relative; z-index: 1; }
            .dc-table { width: 100%; border-collapse: collapse; border: 0.4px solid #000; min-height: 144mm; table-layout: fixed; }
            .dc-table th, .dc-table td { border: 0.4px solid #000; padding: 2mm 2.5mm; vertical-align: top; }
            .dc-th-sr, .dc-td-sr { width: 8%; text-align: center; }
            .dc-th-particulars, .dc-td-particulars { width: 57%; }
            .dc-th-qty, .dc-td-qty { width: 17%; text-align: center; }
            .dc-th-rate, .dc-td-rate { width: 18%; text-align: center; }
            .dc-table thead tr { height: 12mm; }
            .dc-table th { font-weight: bold; text-align: center; vertical-align: middle; font-size: 10.5px; background: transparent; }
            .dc-th-sr { line-height: 1.1; font-size: 10px; }
            .dc-th-sr span { display: block; }
            .dc-table tbody tr { min-height: 14mm; }
            .dc-table-single tbody tr { height: 130mm; }
            .dc-table td { font-size: 10px; line-height: 1.35; }
            .dc-td-sr { font-size: 10px; }
            .dc-td-qty, .dc-td-rate { white-space: nowrap; }
            .dc-footer-section { display: flex; justify-content: space-between; margin-top: 5mm; min-height: 32mm; position: relative; z-index: 1; }
            .dc-footer-left { flex: 1; }
            .dc-acknowledgement { font-size: 10px; font-weight: bold; margin-bottom: 8mm; }
            .dc-receiver-signature { font-size: 10px; font-weight: bold; margin-top: 6mm; }
            .dc-footer-right { flex: 1; text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
            .dc-authorize-text { font-size: 10px; font-weight: bold; margin-bottom: 2mm; }
            .dc-signature-area { min-height: 12mm; display: flex; align-items: center; justify-content: flex-end; margin-bottom: 2mm; }
            .dc-signature-img { max-height: 12mm; max-width: 35mm; object-fit: contain; }
            .dc-stamp-area { display: flex; align-items: center; justify-content: flex-end; margin-bottom: 1mm; }
            .dc-stamp-img { width: 18mm; height: 18mm; object-fit: contain; opacity: 0.7; }
            .dc-authorized-label { font-size: 9px; font-weight: bold; letter-spacing: 0.5px; margin-top: 1mm; }
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

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledHeight = imgHeight * ratio;

      const totalPages = Math.ceil(scaledHeight / pdfHeight);

      if (totalPages === 1) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();
          const srcY = (i * pdfHeight) / ratio;
          const srcHeight = Math.min(pdfHeight / ratio, imgHeight - srcY);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = srcHeight;
          const ctx = pageCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, srcY, imgWidth, srcHeight, 0, 0, imgWidth, srcHeight);

          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageScaledHeight = srcHeight * ratio;
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight);
        }
      }

      const challanNum = (challanData.challanNo || invoice.invoiceNumber || 'Draft').replace(/[^a-zA-Z0-9]/g, '-');
      pdf.save(`Delivery-Challan-${challanNum}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const mergedInvoice = invoice ? {
    ...invoice,
    orderDetails: {
      ...invoice.orderDetails,
      challanNo: challanData.challanNo,
      challanDate: challanData.challanDate,
      orderRef: challanData.orderRef,
      dated: challanData.orderDated
    }
  } : null;

  if (!invoice) return <div className="loading">Loading...</div>;

  return (
    <div className="delivery-challan-page">
      <div className="page-header">
        <div>
          <h1>Delivery Challan</h1>
          <p className="page-subtitle">
            Invoice #{invoice.invoiceNumber} — {invoice.customer?.name || 'Customer'}
          </p>
        </div>
      </div>

      {editing && (
        <div className="form-section">
          <h3 className="section-title">Edit Challan Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Challan No.</label>
              <input
                type="text"
                value={challanData.challanNo}
                onChange={(e) => handleChallanFieldChange('challanNo', e.target.value)}
                placeholder="Challan Number"
              />
            </div>
            <div className="form-group">
              <label>Challan Date</label>
              <input
                type="text"
                value={challanData.challanDate}
                onChange={(e) => handleChallanFieldChange('challanDate', e.target.value)}
                placeholder="DD.MM.YYYY"
              />
            </div>
            <div className="form-group">
              <label>Your P.O. No. / Order Ref.</label>
              <input
                type="text"
                value={challanData.orderRef}
                onChange={(e) => handleChallanFieldChange('orderRef', e.target.value)}
                placeholder="Order Reference"
              />
            </div>
            <div className="form-group">
              <label>P.O. Date</label>
              <input
                type="text"
                value={challanData.orderDated}
                onChange={(e) => handleChallanFieldChange('orderDated', e.target.value)}
                placeholder="DD.MM.YYYY"
              />
            </div>
          </div>
          <div className="action-buttons" style={{ marginTop: '16px' }}>
            <button className="btn-primary" onClick={() => setEditing(false)}>
              Done Editing
            </button>
            <button className="btn-outline" onClick={() => {
              setChallanData({
                challanNo: invoice.orderDetails?.challanNo || '',
                challanDate: invoice.orderDetails?.challanDate || invoice.invoiceDate || '',
                orderRef: invoice.orderDetails?.orderRef || '',
                orderDated: invoice.orderDetails?.dated || ''
              });
              setEditing(false);
            }}>
              Reset to Invoice
            </button>
          </div>
        </div>
      )}

      <div className="challan-actions">
        <button className="btn-outline" onClick={() => navigate(`/invoice/${invoice.id}`)}>
          Back to Invoice
        </button>
        <button className="btn-secondary" onClick={() => setEditing(!editing)}>
          {editing ? 'Hide Editor' : 'Edit Challan Details'}
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          Print Challan
        </button>
        <button className="btn-success" onClick={handleDownloadPDF} disabled={downloading}>
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div className="invoice-view-container">
        <DeliveryChallanPreview
          ref={previewRef}
          invoice={mergedInvoice}
          printable
          challanData={challanData}
        />
      </div>
    </div>
  );
};

export default DeliveryChallan;
