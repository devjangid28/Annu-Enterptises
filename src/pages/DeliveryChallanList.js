import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Pages.css';

const DeliveryChallanList = () => {
  const { orders } = useApp();
  const navigate = useNavigate();

  const convertToChallan = (order) => {
    navigate(`/challan/${order.id}`);
  };

  return (
    <div className="all-orders-page">
      <div className="page-header">
        <div>
          <h1>Delivery Challan</h1>
          <p className="page-subtitle">
            Generate a Delivery Challan from any saved invoice. All customer, product and
            order details are taken automatically from the invoice.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Invoice
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No invoices yet</h3>
          <p>Create and save an invoice first, then you can generate its Delivery Challan here.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Create Invoice
          </button>
        </div>
      ) : (
        <>
          <div className="challan-hint">
            <strong>How it works:</strong> Every saved invoice appears below. Click
            &ldquo;Generate &amp; View Challan&rdquo; on an invoice to open it as a Delivery Challan.
            The challan can be edited, printed, or downloaded as PDF.
          </div>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Order Ref.</th>
                  <th>Challan No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.invoiceNumber || '-'}</strong></td>
                    <td>{order.customer?.name || '-'}</td>
                    <td>{order.invoiceDate || '-'}</td>
                    <td>{order.orderDetails?.orderRef || '-'}</td>
                    <td>{order.orderDetails?.challanNo || '-'}</td>
                    <td>
                      <div className="action-buttons-cell">
                        <button
                          className="btn-action btn-success-short"
                          onClick={() => convertToChallan(order)}
                          title="Generate & View Delivery Challan"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                          Generate &amp; View
                        </button>
                        <button
                          className="btn-action btn-view"
                          onClick={() => navigate(`/invoice/${order.id}`)}
                          title="View Invoice"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => navigate(`/invoice/${order.id}/edit`)}
                          title="Edit Invoice"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryChallanList;