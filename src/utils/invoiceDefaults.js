import { generateId } from './storage';

export const createEmptyInvoice = () => ({
  id: generateId(),
  invoiceNumber: '',
  invoiceDate: '',
  customer: {
    name: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    pin: '',
    gstin: '',
    pan: ''
  },
  orderDetails: {
    orderRef: '',
    dated: '',
    challanNo: '',
    challanDate: '',
    dispatchThru: '',
    rrGrNo: '',
    rrGrDate: '',
    documentThru: ''
  },
  items: [
    { id: generateId(), particulars: '', hsn: '', qty: '', rate: '', unit: 'P. R. Ft.', netAmount: 0 }
  ],
  taxType: 'igst',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  subtotal: 0,
  grandTotal: 0,
  notes: '',
  createdAt: null,
  updatedAt: null
});

export const createSampleInvoice = () => ({
  id: generateId(),
  invoiceNumber: '001',
  invoiceDate: '05.09.2026',
  customer: {
    name: 'Naveen Infraspace Pvt. Ltd.',
    address: '1st Floor, Jaual Manzil, Near SBI,',
    addressLine2: 'Chhaoni Katol Road,',
    city: 'NAGPUR',
    state: 'MAHARASHTRA',
    pin: '440 013',
    gstin: '',
    pan: ''
  },
  orderDetails: {
    orderRef: 'Thru telephonic order',
    dated: '04.09.2026',
    challanNo: '001',
    challanDate: '05.09.2026',
    dispatchThru: 'Associated Road Carriers Ltd.',
    rrGrNo: '135863',
    rrGrDate: '05.09.2026',
    documentThru: 'Thru transporter'
  },
  items: [
    {
      id: generateId(),
      particulars: 'PVC Panel divider 35mm depth 3mm uniform thickness top to bottom, two ribs on either side for strong gripping purpose in cement concrete',
      hsn: '3925',
      qty: '600',
      rate: '16',
      unit: 'P. R. Ft.',
      netAmount: 9600
    }
  ],
  taxType: 'igst',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 1728,
  subtotal: 9600,
  grandTotal: 11328,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
