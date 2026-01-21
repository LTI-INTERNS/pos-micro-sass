"use client";
import OrderTable from "./OrderTable";
import Buttons from "./Button";

type OrderItem = {
  id: number;
  name: string;
  qty: number;
  price: number;
  tax: number;
  subtotal: number;
};

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Steak sapi bakar",
    qty: 1,
    price: 25.12,
    tax: 0.33,
    subtotal: 25.12,
  },
  {
    id: 2,
    name: "Ayam kentang",
    qty: 1,
    price: 15.4,
    tax: 0.32,
    subtotal: 15.4,
  },
  {
    id: 3,
    name: "Mie kuah pedas",
    qty: 1,
    price: 11.21,
    tax: 0.42,
    subtotal: 11.21,
  },
];

export default function OrderConfirmationPage() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-8">
      
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">Order confirmation</h1>
        <p className="text-slate-500">
          Please confirm the order below to completed payment
        </p>
      </div>


      <OrderTable data={orderItems} headings={[{ label: "ITEM NAME" }, { label: "QTY" }, { label: "PRICE" },{ label: "TAX" },{ label: "SUBTOTAL" },]} emptyMessage="No order items found"/>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="border rounded-xl p-4 bg-slate-50">
          <h3 className="font-semibold mb-2 text-black">NOTES</h3>
          <p className="text-sm text-slate-500">
            Lorem Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled it
            to make a type specimen book.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>SUBTOTAL</span>
            <span className="text-black">$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>SUBCHARGE</span>
            <span className="text-black">$ 0</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>ORDER DISCOUNT</span>
            <span className="text-black">$ 0</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>TAX</span>
            <span className="text-black">$ 0</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">BILL AMOUNT</span>
            <span className="text-orange-500">
              $ {subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      
      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-sm text-slate-500">Payment method</p>
          <div className="flex items-center ">
            <img src="/money.png" alt="Cash" className="w-6 h-6 inline mr-2" />
            <p className="font-medium text-black">Cash</p>
          </div>
          
        </div>

        <div className="flex justify-center gap-4">
          <Buttons cancelLabel="Cancel" otherLabel="Confirm" />
        </div>
      </div>
    </div>
  );
}
