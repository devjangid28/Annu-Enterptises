const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const convertBelow1000 = (num) => {
  if (num === 0) return '';
  if (num < 20) return ones[num];
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  }
  return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + convertBelow1000(num % 100) : '');
};

export const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(-num);

  const parts = num.toString().split('.');
  const intPart = parseInt(parts[0]);
  const decPart = parts.length > 1 ? parseInt(parts[1].padEnd(2, '0').substring(0, 2)) : 0;

  let result = '';
  let remaining = intPart;

  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000);
    result += convertBelow1000(crores) + ' Crore ';
    remaining %= 10000000;
  }
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000);
    result += convertBelow1000(lakhs) + ' Lakh ';
    remaining %= 100000;
  }
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    result += convertBelow1000(thousands) + ' Thousand ';
    remaining %= 1000;
  }
  if (remaining > 0) {
    result += convertBelow1000(remaining);
  }

  result = result.trim();

  if (decPart > 0) {
    result += ' and ' + convertBelow1000(decPart) + ' Paise';
  }

  return result;
};

export const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
  const num = parseFloat(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  let [intPart, decPart] = absNum.toFixed(2).split('.');
  
  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return (isNegative ? '-' : '') + formatted + '.' + decPart;
};
