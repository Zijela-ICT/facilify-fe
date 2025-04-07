"use client";

import ButtonComponent from "@/components/button-component";
import { MyLoaderFinite } from "@/components/loader-components";
import createAxiosInstance from "@/utils/api";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CompleteTransaction() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const { id } = useParams();

  const [query, setQuery] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("reference"));
    setStatus(params.get("status"));
  }, []);

  const sendMessageToReactNative = (reference: string, status: string) => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: "transaction",
          data: {
            reference_id: reference,
            status: status,
          },
        })
      );
    }
  };

  const verifyTransaction = async () => {
    if (!query) return; // Prevent API call if query is missing
    try {
      await axios.patch(`https://nhwr.zijela.com/facilify/api/v1/payments/verify/${query}`);
      sendMessageToReactNative(query, "success");
    } catch (error) {
      console.error("Transaction verification failed:", error);
      sendMessageToReactNative(query, "cancelled");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      if (status === "success") {
        verifyTransaction();
      } else if (status === "cancelled") {
        setLoading(false);
      }
    }
  }, [query, status]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {!loading ? (
        <div>
          <div className="flex flex-col items-center justify-center space-y-3 mb-4">
            <h2 className="text-2xl font-bold">
              {status === "success"
                ? "Verified Successfully!"
                : "Transaction Failed"}
            </h2>
            <p className="text-center text-md font-lighter w-full">
              {status === "success"
                ? "Your transaction was verified successfully."
                : "Your transaction failed."}
            </p>
          </div>
          <ButtonComponent
            text="Go Home"
            onClick={() => router.push("/dashboard")}
            className="text-white"
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <MyLoaderFinite />
          <div>Verifying transaction...</div>
        </div>
      )}
    </div>
  );
}

export default CompleteTransaction;
