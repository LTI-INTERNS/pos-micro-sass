"use client";

import { useEffect, useState } from "react";
import CustomersTable from "@/app/components/customers-table";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers"); // your API
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading customers...</p>;
  }

  return (
    <div className="space-y-6">
      <CustomersTable customers={customers} />
    </div>
  );
}
