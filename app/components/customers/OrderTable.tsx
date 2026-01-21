import React from 'react'


type OrderItem = {
  id: number;
  name: string;
  qty: number;
  price: number;
  tax: number;
  subtotal: number;
};

type Heading = {
  label: string;
};
type Props = {
  data: OrderItem[];
  headings: Heading[];
  emptyMessage: String;
};


const OrderTable = ({ data, headings, emptyMessage }: Props) => {
  return (
     <div className="overflow-hidden border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {headings.map((heading, index) => (
                <th key={index} className={`px-6 py-3 ${index === 0? 'text-left' : 'text-right'}`}>
                  {heading.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t last:border-b-0 "
              >
                <td className="px-6 py-4 text-left text-black">{item.name}</td>
                <td className="px-6 py-4 text-right text-black">{item.qty}</td>
                <td className="px-6 py-4 text-right text-black">$ {item.price}</td>
                <td className="px-6 py-4 text-right text-black">$ {item.tax}</td>
                <td className="px-6 py-4 text-right font-medium text-black">
                  $ {item.subtotal}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-6 text-center text-slate-400"
                >
                 {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  )
}

export default OrderTable