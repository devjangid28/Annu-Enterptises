import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOrderById } from '../utils/storage';
import InvoicePreview from '../components/Invoice/InvoicePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Pages.css';

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useApp();
  const [invoice, setInvoice] = useState(null);
  const previewRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const order = getOrderById(id);
    if (order) {
      setInvoice(order);
    } else {
      navigate('/orders');
    }
  }, [id, navigate]);

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
      const scaledWidth = imgWidth * ratio;
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

      const invoiceNum = (invoice.invoiceNumber || 'Draft').replace(/[^a-zA-Z0-9]/g, '-');
      pdf.save(`Tax-Invoice-${invoiceNum}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!invoice) return <div className="loading">Loading...</div>;

  return (
    <div className="invoice-view-page">
      <div className="view-actions">
        <button className="btn-outline" onClick={() => navigate('/orders')}>
          Back to Orders
        </button>
        <button className="btn-secondary" onClick={() => navigate(`/invoice/${invoice.id}/edit`)}>
          Edit
        </button>
        <button className="btn-accent" onClick={() => navigate(`/challan/${invoice.id}`)}>
          Generate Delivery Challan
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          Print Invoice
        </button>
        <button className="btn-success" onClick={handleDownloadPDF} disabled={downloading}>
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div className="invoice-view-container">
        <InvoicePreview ref={previewRef} invoice={invoice} printable />
      </div>
    </div>
  );
};

export default InvoiceView;
