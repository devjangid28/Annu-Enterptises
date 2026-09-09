import React from 'react';
import { useApp } from '../../context/AppContext';
import './DeliveryChallanPreview.css';

const STATE_ABBR = {
  'ANDHRA PRADESH': 'A.P.',
  'ARUNACHAL PRADESH': 'A.P.',
  'ASSAM': 'ASM',
  'BIHAR': 'BHR',
  'CHHATTISGARH': 'C.G.',
  'GOA': 'GOA',
  'GUJARAT': 'GJ',
  'HARYANA': 'HRY',
  'HIMACHAL PRADESH': 'H.P.',
  'JAMMU AND KASHMIR': 'J&K',
  'JHARKHAND': 'JHK',
  'KARNATAKA': 'KNT',
  'KERALA': 'KER',
  'MADHYA PRADESH': 'M.P.',
  'MAHARASHTRA': 'M.S.',
  'MANIPUR': 'MNP',
  'MEGHALAYA': 'MEG',
  'MIZORAM': 'MZR',
  'NAGALAND': 'NGL',
  'ODISHA': 'OD',
  'PUNJAB': 'PJB',
  'RAJASTHAN': 'RJ',
  'SIKKIM': 'SKM',
  'TAMIL NADU': 'T.N.',
  'TELANGANA': 'T.S.',
  'TRIPURA': 'TRP',
  'UTTAR PRADESH': 'U.P.',
  'UTTARAKHAND': 'UTK',
  'WEST BENGAL': 'W.B.'
};

const getStateAbbr = (state) => {
  if (!state) return '';
  const abbr = STATE_ABBR[state.trim().toUpperCase()];
  return abbr || state;
};

const DeliveryChallanPreview = React.forwardRef(({ invoice, printable = false, challanData = null }, ref) => {
  const { settings } = useApp();

  const addressLines = (settings.address || '').split('\n').filter(Boolean);
  const mobileLine = (settings.mobile || '').split('\n').filter(Boolean).join(' / ');
  const productLines = (settings.products || '').split('\n').filter(Boolean);

  const cd = challanData || {};

  return (
    <div className={`dc-page ${printable ? 'printable' : ''}`} ref={ref}>
      <div className="dc-paper">

        {/* WATERMARK */}
        {settings.logo && (
          <div className="dc-watermark">
            <img src={settings.logo} alt="" className="dc-watermark-img" />
          </div>
        )}

        {/* ZONE 1: HEADER */}
        <div className="dc-header">
          <div className="dc-header-left">
            <div className="dc-logo-area">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="dc-logo-img" />
              ) : (
                <div className="dc-logo-placeholder">LOGO</div>
              )}
            </div>
            <div className="dc-company-info">
              <div className="dc-company-name">{settings.companyName || 'ANNU ENTERPRISES'}</div>
              <div className="dc-company-underline" />
              {addressLines.map((line, i) => (
                <div key={i} className="dc-address-line">{line}</div>
              ))}
              <div className="dc-mobile-line">Mobile: {mobileLine}</div>
              <div className="dc-email-web">
                <span>E-Mail: {settings.email}</span>
                <span className="dc-website">Website: {settings.website}</span>
              </div>
            </div>
          </div>
          <div className="dc-header-right">
            {productLines.map((p, i) => (
              <div key={i} className="dc-product-item">
                <span className="dc-bullet">&#9679;</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ZONE 2: TITLE */}
        <div className="dc-title-section">
          DELIVERY CHALLAN
        </div>

        {/* ZONE 3: CUSTOMER / DOCUMENT INFO BOX */}
        <div className="dc-info-box">
          <div className="dc-info-left">
            <div className="dc-info-row">
              <span className="dc-info-text">{invoice.customer.name}</span>
              <span className="dc-info-line" />
            </div>
            {invoice.customer.address && (
              <div className="dc-info-row">
                <span className="dc-info-text">{invoice.customer.address}</span>
                <span className="dc-info-line" />
              </div>
            )}
            {invoice.customer.addressLine2 && (
              <div className="dc-info-row">
                <span className="dc-info-text">{invoice.customer.addressLine2}</span>
                <span className="dc-info-line" />
              </div>
            )}
            <div className="dc-info-row">
              <span className="dc-info-text dc-bold">
                {[
                  invoice.customer.city,
                  invoice.customer.pin ? invoice.customer.pin : '',
                  invoice.customer.state ? '(' + getStateAbbr(invoice.customer.state) + ')' : ''
                ].filter(Boolean).join(' - ')}
              </span>
              <span className="dc-info-line" />
            </div>
          </div>
          <div className="dc-info-right">
            <div className="dc-doc-row">
              <span className="dc-doc-label">Challan No.</span>
              <span className="dc-doc-value">{cd.challanNo || invoice.orderDetails.challanNo || ''}</span>
              <span className="dc-doc-label" style={{ marginLeft: '4mm' }}>Dated</span>
              <span className="dc-doc-value">{cd.challanDate || invoice.orderDetails.challanDate || invoice.invoiceDate || ''}</span>
            </div>
            <div className="dc-doc-row">
              <span className="dc-doc-label">Invoice No.</span>
              <span className="dc-doc-value">{invoice.invoiceNumber || ''}</span>
              <span className="dc-doc-label" style={{ marginLeft: '4mm' }}>Dated</span>
              <span className="dc-doc-value">{invoice.invoiceDate || ''}</span>
            </div>
            <div className="dc-doc-row">
              <span className="dc-doc-label">Your P.O. No.</span>
              <span className="dc-doc-value">{invoice.orderDetails.orderRef || 'Telephonic Order'}</span>
            </div>
            <div className="dc-doc-row">
              <span className="dc-doc-label">Dated</span>
              <span className="dc-doc-value">{invoice.orderDetails.dated || ''}</span>
            </div>
          </div>
        </div>

        {/* ZONE 4: MAIN TABLE */}
        <div className="dc-table-section">
          <table className={`dc-table ${invoice.items.length === 1 ? 'dc-table-single' : ''}`}>
            <thead>
              <tr>
                <th className="dc-th-sr">
                  <span>Sr.</span>
                  <span>No.</span>
                </th>
                <th className="dc-th-particulars">Particulars</th>
                <th className="dc-th-qty">Qty.</th>
                <th className="dc-th-rate">Rate</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="dc-td-sr">{String(index + 1).padStart(2, '0')}</td>
                  <td className="dc-td-particulars">{item.particulars}</td>
                  <td className="dc-td-qty">{item.qty} {item.unit}</td>
                  <td className="dc-td-rate">{item.rate ? 'Rs.' + item.rate + '/-' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ZONE 5: ACKNOWLEDGEMENT + SIGNATURES */}
        <div className="dc-footer-section">
          <div className="dc-footer-left">
            <div className="dc-acknowledgement">
              Received the above material in good condition.
            </div>
            <div className="dc-receiver-signature">
              (Receiver Signature)
            </div>
          </div>
          <div className="dc-footer-right">
            <div className="dc-authorize-text">For {settings.companyName || 'ANNU ENTERPRISES'}</div>
            <div className="dc-signature-area">
              {settings.signature ? (
                <img src={settings.signature} alt="Signature" className="dc-signature-img" />
              ) : (
                <div className="dc-signature-placeholder">&nbsp;</div>
              )}
            </div>
            <div className="dc-stamp-area">
              {settings.logo && (
                <img src={settings.logo} alt="Stamp" className="dc-stamp-img" />
              )}
            </div>
            <div className="dc-authorized-label">(Authorized Signature)</div>
          </div>
        </div>

      </div>
    </div>
  );
});

DeliveryChallanPreview.displayName = 'DeliveryChallanPreview';

export default DeliveryChallanPreview;
