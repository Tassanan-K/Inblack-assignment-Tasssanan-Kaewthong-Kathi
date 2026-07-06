"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Load initial mock data
  useEffect(() => {
    // Start with a mock user logged in by default for testing ease, or let them log in
    setIsLoggedIn(true);
    setUser({
      name: "สมศักดิ์ รักเรียน",
      email: "somsak.dev@gmail.com",
      balance: 750, // Baht
      uid: "TH-984218",
      avatar: "🧙‍♂️",
    });

    setTransactions([
      {
        id: "TX-948102",
        gameName: "Garena RoV",
        gameId: "rov",
        uid: "58291048",
        zoneId: "",
        packageName: "420 คูปอง (+40 โบนัส)",
        amount: 299,
        paymentMethod: "PromptPay",
        status: "Success",
        date: "2026-07-05 14:22",
      },
      {
        id: "TX-948011",
        gameName: "Genshin Impact",
        gameId: "genshin",
        uid: "812048591",
        zoneId: "Asia",
        packageName: "300 Genesis Crystals",
        amount: 149,
        paymentMethod: "TrueMoney Wallet",
        status: "Success",
        date: "2026-07-03 09:15",
      },
    ]);
  }, []);

  const login = (email, password) => {
    setIsLoggedIn(true);
    setUser({
      name: "สมศักดิ์ รักเรียน",
      email: email || "somsak.dev@gmail.com",
      balance: 750,
      uid: "TH-984218",
      avatar: "🧙‍♂️",
    });
    return true;
  };

  const register = (email, password, name) => {
    setIsLoggedIn(true);
    setUser({
      name: name || "ผู้เล่นใหม่",
      email: email,
      balance: 0,
      uid: `TH-${Math.floor(100000 + Math.random() * 900000)}`,
      avatar: "🤖",
    });
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addTransaction = (tx) => {
    const newTx = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "Success", // Simulate instant success
      date: new Date().toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      ...tx,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // If payment method is "Wallet", deduct balance
    if (tx.paymentMethod === "Wallet" && user) {
      setUser((prevUser) => ({
        ...prevUser,
        balance: Math.max(0, prevUser.balance - tx.amount),
      }));
    }
    return newTx;
  };

  const addBalance = (amount) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + Number(amount),
    }));
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        transactions,
        login,
        register,
        logout,
        addTransaction,
        addBalance,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
