"use client";

import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { convertUSDToSOL } from "../utils/priceConverter";

interface Product {
  id: string;
  name: string;
  price: number;
}

const InvoicePayment: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [solAmount, setSolAmount] = useState<number | null>(null);
  const [product, setProduct] = useState<Product>({
    id: "PROD-001",
    name: "Sample Product",
    price: 50, // USD
  });
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const fetchSOLPrice = async () => {
      try {
        const convertedAmount = await convertUSDToSOL(product.price);
        setSolAmount(convertedAmount);
      } catch (error) {
        console.error("Conversion error", error);
      }
    };
    fetchSOLPrice();
  }, [product.price]);

  const handlePayInvoice = async () => {
    if (!publicKey || !solAmount) return;

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "9uNS6HLhFWCXRkCCRVyiv98mDFZQZfR6KBhtpwrX3wxk"
          ), // Replace with actual address
          lamports: Math.ceil(solAmount * LAMPORTS_PER_SOL),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      // Confirm transaction and retrieve transaction hash
      await connection.confirmTransaction(signature);

      // if (confirmation.value.err) {
      //   alert("Transaction failed");
      //   return null;
      // }

      // Return transaction signature (hash)
      alert(`Payment successful: ${signature}`);
      setSignature(signature);
      return signature;
    } catch (error: any) {
      alert(`Payment failed: ${error.message}`);
      return null;
    }
  };

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ${product.price} USD</p>
      {solAmount && <p>SOL Equivalent: {solAmount} SOL</p>}

      <WalletMultiButton />

      {publicKey && solAmount && (
        <button onClick={handlePayInvoice}>Pay Now</button>
      )}

      {signature && (
        <p>
          Transaction Signature:{" "}
          <a
            href={`https://solscan.io/tx/${signature}?cluster=devnet`}
            target="_blank"
          >
            {signature}
          </a>
        </p>
      )}
    </div>
  );
};

export default InvoicePayment;
