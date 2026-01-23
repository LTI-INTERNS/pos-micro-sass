'use client'
export default function OrderPanel() {
  return (
    <div className="w-80 h-screen bg-white rounded-xl p-4 border flex flex-col">
      
      
      <div className="border-b">
        <h2 className="font-semibold mb-3 text-black">
          Customer Information
        </h2>

        <button className="w-full bg-orange-100 text-orange-500 py-2 rounded-4xl mb-6">
          Add Customer
        </button>
      </div>

      
      <div className="flex-1 py-4 border-b">
        <h3 className="font-semibold mb-2 text-black">
          Orders details
        </h3>
      </div>

      
      <div className="mt-auto py-4">
        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span className="text-black">LKR 0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span className="text-black">LKR 0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-orange-500">LKR 0.00</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 border rounded-4xl py-2 text-orange-500">
            Cancel
          </button>
          <button className="flex-1 bg-orange-500 text-white rounded-4xl py-2">
            Pay Now
          </button>
        </div>
      </div>

    </div>
  );
}
