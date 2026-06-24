import React from "react";

export default function PaymentsTransactions() {
  const wallet = {
    balance: 1450,
    earnings: 3200,
    payouts: 1750,
  };

  const transactions = [
    {
      id: 1,
      title: "Sold HP Laptop",
      amount: "+₹28,000",
      date: "28 Nov 2025",
      type: "credit",
    },
    {
      id: 2,
      title: "CampusCard Payout",
      amount: "-₹20,000",
      date: "25 Nov 2025",
      type: "debit",
    },
    {
      id: 3,
      title: "Sold Study Table",
      amount: "+₹3,200",
      date: "22 Nov 2025",
      type: "credit",
    },
  ];

  // -------------------- STYLES --------------------
  const container = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const title = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "18px",
  };

  const walletBox = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    marginBottom: "28px",
  };

  const walletCard = {
    padding: "16px",
    background: "#f1f5f9",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  };

  const value = {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "6px",
  };

  const label = {
    fontSize: "14px",
    color: "#475569",
  };

  const transactionCard = {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    marginBottom: "12px",
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const txTitle = {
    fontSize: "15px",
    fontWeight: "600",
  };

  const small = {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  };

  const amountStyle = (type) => ({
    fontSize: "15px",
    fontWeight: "600",
    color: type === "credit" ? "#16a34a" : "#dc2626",
  });

  return (
    <div style={container}>
      {/* PAGE TITLE */}
      <h2 style={title}>Payments & Transactions</h2>

      {/* WALLET OVERVIEW */}
      <div style={walletBox}>
        <div style={walletCard}>
          <div style={value}>₹{wallet.balance}</div>
          <div style={label}>Wallet Balance</div>
        </div>

        <div style={walletCard}>
          <div style={value}>₹{wallet.earnings}</div>
          <div style={label}>Total Earnings</div>
        </div>

        <div style={walletCard}>
          <div style={value}>₹{wallet.payouts}</div>
          <div style={label}>Total Payouts</div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "14px",
        }}
      >
        Transaction History
      </h3>

      {transactions.map((tx) => (
        <div key={tx.id} style={transactionCard}>
          <div style={row}>
            <div>
              <div style={txTitle}>{tx.title}</div>
              <div style={small}>{tx.date}</div>
            </div>

            <div style={amountStyle(tx.type)}>{tx.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
