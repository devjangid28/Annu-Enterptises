import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency } from '../utils/numberToWords';
import './Pages.css';

const StatCard = ({ label, value, icon, accent }) => (
  <div className="stat-card">
    <div className={`stat-icon ${accent}`}>{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const AllOrders = () => {
  const { orders, removeOrder, duplicateOrderAction } = useApp();
  const navigate = useNavigate();

  const totalInvoices = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.grandTotal) || 0), 0);

  const handleDelete = (order) => {
    if (window.confirm(`Are you sure you want to delete Invoice No. ${order.invoiceNumber || 'Untitled'}?`)) {
      removeOrder(order.id);
    }
  };

  const handleDuplicate = (order) => {
    duplicateOrderAction(order);
  };

  const handlePrint = (order) => {
    navigate(`/invoice/${order.id}/print`);
  };

  return (
    <div className="all-orders-page">
      <div className="page-header">
        <div>
          <h1>All Orders</h1>
          <p className="page-subtitle">Manage your invoices and orders</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Invoice
        </button>
      </div>

      <div className="stats-row">
        <StatCard
          label="Total Invoices"
          value={totalInvoices}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          }
          accent="violet"
        />
        <StatCard
          label="Total Revenue"
          value={`₹${formatIndianCurrency(totalRevenue)}`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          }
          accent="green"
        />
        <StatCard
          label="Latest Invoice"
          value={orders[0]?.invoiceNumber || '-'}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4"  rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          }
          accent="amber"
        />
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Create your first invoice to get started.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Create Invoice
          </button>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Order Ref.</th>
                <th>Amount</th>
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
                  <td className="amount-cell">{formatIndianCurrency(order.grandTotal || 0)}</td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        className="btn-action btn-view"
                        onClick={() => navigate(`/invoice/${order.id}`)}
                        title="View"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => navigate(`/invoice/${order.id}/edit`)}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        className="btn-action btn-print"
                        onClick={() => handlePrint(order)}
                        title="Print"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      </button>
                      <button
                        className="btn-action btn-duplicate"
                        onClick={() => handleDuplicate(order)}
                        title="Duplicate"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(order)}
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
