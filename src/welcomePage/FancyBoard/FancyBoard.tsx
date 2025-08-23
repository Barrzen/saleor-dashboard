import { useQuery } from "@apollo/client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FancyOrderListQuery } from "./quaries";

const FancyBoard = () => {
  const { data, loading, error } = useQuery(FancyOrderListQuery, {
    variables: { first: 20, sort: { field: "CREATED_AT", direction: "DESC" }, filter: null },
  });

  if (loading) return <p>Loading orders...</p>;

  if (error) return <p>Error loading orders: {error.message}</p>;

  const orders = data?.orders?.edges ?? [];

  const chartData = orders.map(({ node }) => ({
    orderNumber: node.number,
    total: node.total.gross.amount,
    date: new Date(node.created).toLocaleDateString(), // optional
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="orderNumber" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FancyBoard;
