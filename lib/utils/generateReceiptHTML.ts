export type ReceiptHTMLProps = {
  headerText?: string;
  footerMessage: string;
  showLogo: boolean;
  telephone: string;
  logoUrl?: string | null;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;
  customerDetails?: string;
  storeName: string;
  branchName: string;
  cashierName: string;
  orderId: string;
  date: string;
  time: string;
  items: { name: string; qty: number; price: number }[];
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashPaid?: number;
  cardPaid?: number;
  formatPrice: (value: number) => string;
};

export const generateReceiptHTML = ({
  headerText,
  footerMessage,
  showLogo,
  showTaxNumber,
  taxNumber,
  telephone,
  logoUrl,
  showCustomerDetails,
  customerDetails,
  storeName,
  branchName,
  cashierName,
  orderId,
  date,
  time,
  items,
  discount,
  tax,
  total,
  paymentMethod,
  cashPaid,
  cardPaid,
  formatPrice,
}: ReceiptHTMLProps): string => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = (cashPaid || 0) - total;
  const itemsCount = items.reduce((sum, item) => sum + item.qty, 0);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          line-height: 1.4;
          width: 80mm;
          margin: 0 auto;
          padding: 0;
          background: white;
        }
        .receipt-container {
          width: 100%;
          padding: 10px;
        }
        .section {
          margin-bottom: 8px;
          border-bottom: 1px dashed #333;
          padding-bottom: 8px;
        }
        .section:last-child {
          border-bottom: none;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
        }
        .logo-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .logo-img {
          max-width: 60px;
          max-height: 40px;
          object-fit: contain;
          display: block;
        }
        .store-info h2 {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .store-info p {
          font-size: 10px;
          margin: 1px 0;
        }
        .transaction-info {
          font-size: 10px;
          text-align: center;
        }
        .transaction-info p {
          margin: 2px 0;
        }
        .customer-info {
          text-align: center;
          font-size: 10px;
        }
        .customer-info p {
          margin: 2px 0;
        }
        .items-list {
          width: 100%;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 11px;
        }
        .item-details {
          flex: 1;
        }
        .item-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        .item-qty {
          font-size: 10px;
          color: #555;
        }
        .item-price {
          text-align: right;
          font-weight: bold;
          white-space: nowrap;
          padding-left: 10px;
        }
        .totals-section {
          width: 100%;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
          font-size: 11px;
        }
        .discount {
          color: #228B22;
        }
        .grand-total {
          font-weight: bold;
          font-size: 12px;
          border-top: 1px solid #333;
          padding-top: 4px;
          margin-top: 4px;
        }
        .payment-section {
          font-size: 11px;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .tax-id {
          text-align: center;
          font-size: 10px;
          margin-top: 4px;
        }
        .footer-message {
          text-align: center;
          font-size: 11px;
          margin-top: 4px;
          font-weight: bold;
        }
        .receipt-footer {
          text-align: center;
          font-size: 10px;
          color: #555;
          margin-top: 8px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        ${showLogo || storeName ? `
          <div class="header">
            <div class="logo-header">
              ${showLogo && logoUrl ? `<img src="${logoUrl}" class="logo-img" />` : ''}
              <div class="store-info">
                <h2>${storeName}</h2>
                ${branchName ? `<p>${branchName}</p>` : ''}
                ${headerText ? `<p>${headerText}</p>` : ''}
              </div>
            </div>
            <p style="font-size:10px; margin-top:4px;">Tel: ${telephone}</p>
          </div>
        ` : ''}

        <div class="section transaction-info">
          <p><strong>Order:</strong> ${orderId}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Cashier:</strong> ${cashierName}</p>
          <p>Items: ${itemsCount}</p>
        </div>

        ${showCustomerDetails && customerDetails ? `
          <div class="section customer-info">
            <p><strong>Customer</strong></p>
            ${customerDetails.split('\n').filter(Boolean).map(line => `<p>${line}</p>`).join('')}
          </div>
        ` : ''}

        <div class="section items-list">
          ${items.map(item => `
            <div class="item-row">
              <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-qty">x${item.qty} @ ${formatPrice(item.price)}</div>
              </div>
              <div class="item-price">${formatPrice(item.price * item.qty)}</div>
            </div>
          `).join('')}
          <div class="total-row" style="border-top: 1px solid #333; padding-top: 4px; margin-top: 4px;">
            <span>Subtotal</span>
            <span style="font-weight: bold;">${formatPrice(subtotal)}</span>
          </div>
        </div>

        <div class="section totals-section">
          ${discount > 0 ? `
            <div class="total-row discount">
              <span>Discount</span>
              <span>-${formatPrice(discount)}</span>
            </div>
          ` : ''}
          ${tax > 0 ? `
            <div class="total-row">
              <span>Tax (VAT)</span>
              <span>${formatPrice(tax)}</span>
            </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>TOTAL</span>
            <span>${formatPrice(total)}</span>
          </div>
        </div>

        <div class="section payment-section">
          <div style="font-weight: bold; margin-bottom: 4px;">Payment: ${paymentMethod}</div>
          ${cashPaid !== undefined && cashPaid > 0 ? `
            <div class="payment-row">
              <span>Cash Received</span>
              <span>${formatPrice(cashPaid)}</span>
            </div>
            ${change !== 0 ? `
              <div class="payment-row" style="border-top: 1px solid #333; padding-top: 4px; margin-top: 4px;">
                <span>Change</span>
                <span>${formatPrice(Math.max(change, 0))}</span>
              </div>
            ` : ''}
          ` : ''}
          ${cardPaid !== undefined && cardPaid > 0 ? `
            <div class="payment-row">
              <span>Card Amount</span>
              <span>${formatPrice(cardPaid)}</span>
            </div>
          ` : ''}
        </div>

        ${showTaxNumber && taxNumber ? `
          <div class="section tax-id">
            <p><strong>Tax ID:</strong> ${taxNumber}</p>
          </div>
        ` : ''}

        ${footerMessage ? `
          <div class="section footer-message">
            ${footerMessage}
          </div>
        ` : ''}

        <div class="receipt-footer">
          <p>Thank you for your purchase!</p>
          <p>Please keep this receipt for your records</p>
          <p style="margin-top: 4px;">Receipt printed: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};