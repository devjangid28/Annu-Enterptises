const ORDERS_KEY = 'annu_enterprises_orders';
const SETTINGS_KEY = 'annu_enterprises_settings';

export const defaultSettings = {
  companyName: 'ANNU ENTERPRISES',
  address: 'C-904, Swami Vivekanand Heights - 2,\nLaxmipura Road,\nGorwa, Vadodara, Gujarat - 390 016, India',
  mobile: '+91 9426336187\n+91 9408373621\n+91 8200586282',
  email: 'info@annuenterprises.co.in',
  website: 'www.annuenterprises.co.in',
  products: 'PVC Floor Tiles\nPVC Handrails\nPVC Waterstop\nPVC Canal Joints\nPVC Panel Divider\nPVC Footsteps',
  gstin: '27AAHCN8260F1ZA',
  gstTin: '24190300347',
  cstTin: '24690300347',
  additionalGstTin: '24AADPU6765B1ZO',
  pan: 'AADPU6765B',
  bankName: 'Bank of Baroda, Alkapuri, Vadodara - 390 007',
  accountNumber: '018200000641',
  ifsc: 'BARB0ALKAPU',
  invoiceNotes: [
    'Goods once sold are not returnable.',
    'Interest @18% will be charge if payment is not made on presentation.',
    'No complaint will be entertained regarding this bill after 3 days of receipt of material.',
    'Subject to Baroda Jurisdiction only.'
  ],
  declaration: 'We declared that this invoice shows the actual price of the goods described and all above particulars are true and correct.',
  logo: null,
  signature: null,
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const saveOrder = (order) => {
  const orders = getOrders();
  const existingIndex = orders.findIndex(o => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = { ...orders[existingIndex], ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.push({ ...order, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveOrders(orders);
  return orders;
};

export const deleteOrder = (id) => {
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
  return orders;
};

export const getOrderById = (id) => {
  return getOrders().find(o => o.id === id) || null;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const duplicateOrder = (order) => {
  const newOrder = {
    ...order,
    id: generateId(),
    invoiceNumber: '',
    invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    createdAt: undefined,
    updatedAt: undefined
  };
  delete newOrder.createdAt;
  delete newOrder.updatedAt;
  return saveOrder(newOrder);
};
