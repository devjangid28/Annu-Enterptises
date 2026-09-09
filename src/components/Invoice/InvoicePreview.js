import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../utils/numberToWords';
import { numberToWords } from '../../utils/numberToWords';
import './InvoicePreview.css';

const InvoicePreview = React.forwardRef(({ invoice, printable = false }, ref) => {
  const { settings } = useApp();

  const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.netAmount) || 0), 0);
  const grandTotal = invoice.grandTotal || 0;
  const amountInWords = numberToWords(Math.floor(grandTotal));

  const addressLines = (settings.address || '').split('\n').filter(Boolean);
  const mobileLines = (settings.mobile || '').split('\n').filter(Boolean);
  const productLines = (settings.products || '').split('\n').filter(Boolean);

  const custAddress = [
    invoice.customer.address,
    invoice.customer.addressLine2,
    `${invoice.customer.city}${invoice.customer.pin ? ' - ' + invoice.customer.pin : ''}${invoice.customer.state ? ', ' + invoice.customer.state : ''}`
  ].filter(Boolean);

  return (
    <div className={`invoice-page ${printable ? 'printable' : ''}`} ref={ref}>
      <div className="invoice-paper">
        {/* HEADER */}
        <div className="inv-header">
          <div className="inv-header-left">
            <div className="inv-logo-area">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="inv-logo-img" />
              ) : (
                <div className="inv-logo-placeholder">LOGO</div>
              )}
            </div>
            <div className="inv-company-details">
              <div className="inv-company-name">{settings.companyName || 'ANNU ENTERPRISES'}</div>
              {addressLines.map((line, i) => (
                <div key={i} className="inv-address-line">{line}</div>
              ))}
              <div className="inv-contact">
                {mobileLines.map((m, i) => (
                  <span key={i}>{i > 0 ? ' / ' : 'Mobile: '}{m}</span>
                ))}
              </div>
              <div className="inv-contact">Email: {settings.email}</div>
              <div className="inv-contact">Website: {settings.website}</div>
            </div>
          </div>
          <div className="inv-header-right">
            <div className="inv-products-label">Products:</div>
            {productLines.map((p, i) => (
              <div key={i} className="inv-product-item">{p}</div>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div className="inv-title-section">
          <div className="inv-title">TAX INVOICE</div>
          <div className="inv-subtitle">(Tax Invoice for Goods Supply As Per Rule 7 &amp; Section 31 of GST Act-2017)</div>
        </div>

        {/* CUSTOMER & ORDER INFO */}
        <div className="inv-info-section">
          <div className="inv-info-left">
            <div className="inv-customer-block">
              <div className="inv-label-bold">To,</div>
              <div className="inv-customer-name">M/s. {invoice.customer.name}</div>
              {custAddress.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {invoice.customer.gstin && (
                <div className="inv-gstin">GSTIN: {invoice.customer.gstin}</div>
              )}
            </div>
            <div className="inv-invoice-no-section">
              <span className="inv-label-bold">Invoice No.:</span> {invoice.invoiceNumber}
              <span style={{ marginLeft: 24 }} className="inv-label-bold">Dated:</span> {invoice.invoiceDate}
            </div>
          </div>
          <div className="inv-info-right">
            <div className="inv-order-row">
              <span className="inv-order-label">Order Ref. No.</span>
              <span className="inv-order-line">{invoice.orderDetails.orderRef}</span>
            </div>
            <div className="inv-order-row">
              <span className="inv-order-label">Dated</span>
              <span className="inv-order-line">{invoice.orderDetails.dated}</span>
            </div>
            <div className="inv-order-row">
              <span className="inv-order-label">Challan No.</span>
              <span className="inv-order-line short">{invoice.orderDetails.challanNo}</span>
              <span className="inv-order-label" style={{ marginLeft: 8 }}>Dated</span>
              <span className="inv-order-line">{invoice.orderDetails.challanDate}</span>
            </div>
            <div className="inv-order-row">
              <span className="inv-order-label">Dispatch Thru</span>
              <span className="inv-order-line">{invoice.orderDetails.dispatchThru}</span>
            </div>
            <div className="inv-order-row">
              <span className="inv-order-label">RR / GR No.</span>
              <span className="inv-order-line short">{invoice.orderDetails.rrGrNo}</span>
              <span className="inv-order-label" style={{ marginLeft: 8 }}>Dated</span>
              <span className="inv-order-line">{invoice.orderDetails.rrGrDate}</span>
            </div>
            <div className="inv-order-row">
              <span className="inv-order-label">Document Thru</span>
              <span className="inv-order-line">{invoice.orderDetails.documentThru}</span>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="inv-table-section">
          <table className="inv-table">
            <thead>
              <tr>
                <th className="inv-th-sr">Sr.No.</th>
                <th className="inv-th-particulars">PARTICULARS</th>
                <th className="inv-th-hsn">HSN</th>
                <th className="inv-th-qty">QTY.</th>
                <th className="inv-th-rate">RATE</th>
                <th className="inv-th-unit">UNIT</th>
                <th className="inv-th-amount">NET AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="inv-td-sr">{String(index + 1).padStart(2, '0')}</td>
                  <td className="inv-td-particulars">
                    {item.particulars}
                    {index === invoice.items.length - 1 && (
                      <div className="inv-gstin-in-items">
                        <strong>GSTIN: {settings.gstin || '27AAHCN8260F1ZA'}</strong>
                      </div>
                    )}
                  </td>
                  <td className="inv-td-hsn">{item.hsn}</td>
                  <td className="inv-td-qty">{item.qty}</td>
                  <td className="inv-td-rate">{item.rate ? 'Rs.' + item.rate + '/-' : ''}</td>
                  <td className="inv-td-unit">{item.unit}</td>
                  <td className="inv-td-amount">{item.netAmount ? 'Rs.' + formatIndianCurrency(item.netAmount) : ''}</td>
                </tr>
              ))}
              {/* Fill empty rows to maintain minimum table height */}
              {invoice.items.length < 5 && Array.from({ length: 5 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="inv-empty-row">
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TAX & TOTAL */}
        <div className="inv-tax-total-section">
          <div className="inv-tax-rows">
            <div className="inv-tax-row">
              <span className="inv-tax-label">Subtotal</span>
              <span className="inv-tax-value">{formatIndianCurrency(subtotal)}</span>
            </div>
            {invoice.taxType === 'cgst_sgst' ? (
              <>
                <div className="inv-tax-row">
                  <span className="inv-tax-label">CGST @ {invoice.cgstRate}%</span>
                  <span className="inv-tax-value">{formatIndianCurrency(invoice.cgstAmount)}</span>
                </div>
                <div className="inv-tax-row">
                  <span className="inv-tax-label">SGST @ {invoice.sgstRate}%</span>
                  <span className="inv-tax-value">{formatIndianCurrency(invoice.sgstAmount)}</span>
                </div>
              </>
            ) : (
              <div className="inv-tax-row">
                <span className="inv-tax-label">IGST @ {invoice.igstRate}%</span>
                <span className="inv-tax-value">{formatIndianCurrency(invoice.igstAmount)}</span>
              </div>
            )}
            <div className="inv-tax-row inv-grand-total">
              <span className="inv-tax-label">TOTAL</span>
              <span className="inv-tax-value">{formatIndianCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* AMOUNT IN WORDS */}
        <div className="inv-amount-words">
          <strong>Total:- Rs. {amountInWords} only.</strong>
        </div>

        {/* BOTTOM SECTION */}
        <div className="inv-bottom-section">
          <div className="inv-bottom-left">
            <div className="inv-tax-info">
              <div>GST TIN No. {settings.gstTin} dtd.01.07.2002</div>
              <div>CST TIN No.{settings.cstTin} dtd.25.07.1995</div>
              <div>GST TIN NO.{settings.additionalGstTin} dtd. 25.06.2017</div>
              <div>PAN No. {settings.pan}</div>
            </div>
            <div className="inv-bank-details">
              <div><strong>Our Bank A/c. details:-</strong></div>
              <div>{settings.bankName}</div>
              <div>C. A/c. No. {settings.accountNumber}</div>
              <div>IFSC Code. {settings.ifsc}</div>
            </div>
            <div className="inv-notes">
              <div><strong>NOTE:</strong></div>
              {(invoice.notes ? invoice.notes.split('\n').filter(Boolean) : settings.invoiceNotes || []).map((note, i) => (
                <div key={i}>{i + 1}. {note}</div>
              ))}
            </div>
          </div>
          <div className="inv-bottom-right">
            <div className="inv-oe">E. &amp; O.E.</div>
            <div className="inv-declaration">
              <div><strong>Declaration :-</strong></div>
              <div>{settings.declaration}</div>
            </div>
            <div className="inv-signatory">
              <div>For {settings.companyName}</div>
              <div className="inv-signature-area">
                {settings.signature ? (
                  <img src={settings.signature} alt="Signature" className="inv-signature-img" />
                ) : (
                  <div className="inv-signature-line">&nbsp;</div>
                )}
              </div>
              <div className="inv-signatory-label">(AUTHORISED SIGNATORY)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
