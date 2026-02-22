export type PreviousOrderItem = {
  id: number | string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

export type PreviousOrderDetails = {
  orderId: number;
  currencyCode: string;

  items: PreviousOrderItem[];

  discountValue: number;
  cardTax: number;

  grandTotal: number;

  paymentMethod: string;
  cashPaid: number;
  cardPaid: number;

  // optional (controls whether Email button appears)
  email?: string | null;

  //  NEW: optional notes for previous orders
  note?: string | null;
};

export const previousOrderDetailsMap: Record<number, PreviousOrderDetails> = {
  1: {
    orderId: 1,
    currencyCode: "LKR",
    items: [
      { id: "A1", name: "Chicken Burger", qty: 2, price: 650, subtotal: 1300 },
      { id: "A2", name: "French Fries", qty: 1, price: 450, subtotal: 450 },
      { id: "A3", name: "Coke", qty: 1, price: 700, subtotal: 700 },
    ],
    discountValue: 0,
    cardTax: 0,
    grandTotal: 2450,
    paymentMethod: "Cash",
    cashPaid: 2450,
    cardPaid: 0,
    email: null,
    note: "Customer requested extra ketchup packets.",
  },

  2: {
    orderId: 2,
    currencyCode: "LKR",
    items: [
      { id: "B1", name: "Vegetable Pizza", qty: 1, price: 1600, subtotal: 1600 },
      { id: "B2", name: "Iced Tea", qty: 1, price: 220, subtotal: 220 },
    ],
    discountValue: 100,
    cardTax: 45.6,
    grandTotal: 1765.6,
    paymentMethod: "Visa",
    cashPaid: 0,
    cardPaid: 1765.6,
    email: "customer2@mail.com",
    note: null, // no notes
  },

  3: {
    orderId: 3,
    currencyCode: "LKR",
    items: [
      { id: "C1", name: "Rice & Curry", qty: 2, price: 850, subtotal: 1700 },
      { id: "C2", name: "Water", qty: 2, price: 120, subtotal: 240 },
      { id: "C3", name: "Vegetable Pizza with Cheeese", qty: 1, price: 1660, subtotal: 1660 },
    ],
    discountValue: 0,
    cardTax: 0,
    grandTotal: 3600,
    paymentMethod: "QR",
    cashPaid: 0,
    cardPaid: 3600,
    email: null,
    note: "No onions in curry (special request).",
  },

  4: {
    orderId: 4,
    currencyCode: "LKR",
    items: [{ id: "D1", name: "Coffee", qty: 2, price: 490, subtotal: 980 }],
    discountValue: 0,
    cardTax: 0,
    grandTotal: 980,
    paymentMethod: "Cash",
    cashPaid: 980,
    cardPaid: 0,
    email: null,
    note: null,
  },

  5: {
    orderId: 5,
    currencyCode: "LKR",
    items: [{ id: "E1", name: "Family Meal Pack", qty: 1, price: 5250, subtotal: 5250 }],
    discountValue: 0,
    cardTax: 0,
    grandTotal: 5250,
    paymentMethod: "Master",
    cashPaid: 0,
    cardPaid: 5250,
    email: "family@mail.com",
    note: "Deliver to reception desk (building A).",
  },
};