"use client";
import OrderTable , {Column} from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";

type OrderItem = {
  id: number;
  name: string;
  qty: number;
  price: number; 
  subtotal: number;
};

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Steak sapi bakar",
    qty: 1,
    price: 25.12,
    subtotal: 25.12,
  },
  {
    id: 2,
    name: "Ayam kentang",
    qty: 1,
    price: 15.4,
    subtotal: 15.4,
  },
  {
    id: 3,
    name: "Mie kuah pedas",
    qty: 1,
    price: 11.21,
    subtotal: 11.21,
  },
];

const columns: Column<OrderItem>[] = [
  {
    key: "name",
    label: "ITEM NAME",
    align: "left",
  },
  
  {
    key: "qty",
    label: "QTY",
    align: "center",
  },
  {
    key: "price",
    label: "PRICE",
    align: "center",
    render: (row) => `LKR ${row.price.toFixed(2)}`,
  },
  {
    key: "subtotal",
    label: "SUBTOTAL",
    align: "right",
    render: (row) => `LKR ${row.subtotal.toFixed(2)}`,
  },
];

export default function OrderConfirmation() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-8">
      
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">Order confirmation</h1>
        <p className="text-slate-500">
          Please confirm the order below to completed payment
        </p>
      </div>


     <OrderTable data={orderItems} columns={columns} emptyMessage="No order items found"/>

      
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
            <span className="text-black">LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>SUBCHARGE</span>
            <span className="text-black">LKR 0</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>ORDER DISCOUNT</span>
            <span className="text-black">LKR 0</span>
          </div>
         

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">BILL AMOUNT</span>
            <span className="text-orange-500">
              LKR {subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      
      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-sm text-slate-500">Payment method</p>
          <div className="flex items-center ">
            <img src="/money.png" alt="Cash" className="w-5 h-5 inline mr-2" />
            <p className="font-medium text-black">Cash</p>
          </div>
          
        </div>

        <div className="flex justify-center gap-4">
          <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
                <Buttons label="Cancel" className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"/>
                <Buttons label="confirm" variant="primary" className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"/>
            </div>
        </div>
      </div>
    </div>
  );
}
