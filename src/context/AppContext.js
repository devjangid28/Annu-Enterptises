import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getOrders, saveOrder, deleteOrder, getSettings, saveSettings, saveOrders, duplicateOrder as duplicateOrderUtil } from '../utils/storage';
import { createEmptyInvoice } from '../utils/invoiceDefaults';
import { createSampleInvoice } from '../utils/invoiceDefaults';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    const existing = getOrders();
    if (existing.length === 0) {
      const sample = createSampleInvoice();
      saveOrders([sample]);
      setOrders([sample]);
    } else {
      setOrders(existing);
    }
  }, []);

  const addOrder = useCallback((order) => {
    const updated = saveOrder(order);
    setOrders([...updated]);
    return order;
  }, []);

  const removeOrder = useCallback((id) => {
    const updated = deleteOrder(id);
    setOrders([...updated]);
  }, []);

  const duplicateOrderAction = useCallback((order) => {
    const updated = duplicateOrderUtil(order);
    setOrders([...updated]);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings };
    saveSettings(merged);
    setSettings(merged);
  }, [settings]);

  const getNewInvoice = useCallback(() => createEmptyInvoice(), []);

  return (
    <AppContext.Provider value={{
      orders,
      settings,
      addOrder,
      removeOrder,
      duplicateOrderAction,
      updateSettings,
      getNewInvoice
    }}>
      {children}
    </AppContext.Provider>
  );
};
