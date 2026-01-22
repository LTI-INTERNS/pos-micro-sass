"use client";

import CommonTable from "@/app/components/Dashboard/common/CommonTable";
import { cashierColumns, Cashier } from "@/app/components/Dashboard/common/tableColumns";

type Props = {
  cashiers: Cashier[];
};

export default function CashiersTable({ cashiers }: Props) {
  return (
    <CommonTable
      title="Cashiers"
      data={cashiers}
      columns={cashierColumns}
      emptyMessage="No cashiers found"
    />
  );
}
