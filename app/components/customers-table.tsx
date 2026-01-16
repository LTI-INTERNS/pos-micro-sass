"use client";
type Customer= {
    id: number;
    name: string;
    phone: string;
    promoCard: string;
    points: number;
    email: string;
    outstanding: number;

};

type Props = {
    customers: Customer[];
};

export default function CustomersTable({ customers }: Props) {
    return {


  }
       