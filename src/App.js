import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import CreateInvoice from './pages/CreateInvoice';
import AllOrders from './pages/AllOrders';
import EditInvoice from './pages/EditInvoice';
import InvoiceView from './pages/InvoiceView';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateInvoice />} />
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/invoice/:id" element={<InvoiceView />} />
            <Route path="/invoice/:id/edit" element={<EditInvoice />} />
            <Route path="/invoice/:id/print" element={<InvoiceView />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
