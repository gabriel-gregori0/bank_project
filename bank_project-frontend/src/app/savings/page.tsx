"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavingsPage() {
  const [cpf, setCpf] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [transferValue, setTransferValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.replace("/");
      }
    } catch (err) {
      router.replace("/");
    }
  }, [router]);

  const onlyDigits = (s: string) => s.replace(/\D/g, "");
  const formatCpf = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };

  const validateCpf = (value: string) => {
    const d = onlyDigits(value);
    return d.length === 11;
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateCpf(cpf)) {
      setError("CPF inválido. Informe 11 dígitos.");
      return;
    }
    if (!depositValue || Number(depositValue) <= 0) {
      setError("Informe um valor de depósito maior que 0.");
      return;
    }

    setLoadingDeposit(true);
    try {
      const res = await fetch(`http://localhost:8080/api/savings/${onlyDigits(cpf)}/deposit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(depositValue) }),
      });

      if (!res.ok) throw new Error(await res.text() || `Erro: ${res.status}`);

      setSuccess("Depósito realizado com sucesso.");
      setDepositValue("");
    } catch (err: any) {
      setError(err.message || "Erro no depósito.");
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateCpf(cpf)) {
      setError("CPF inválido. Informe 11 dígitos.");
      return;
    }
    if (!transferValue || Number(transferValue) <= 0) {
      setError("Informe um valor de transferência maior que 0.");
      return;
    }

    setLoadingTransfer(true);
    try {
      const res = await fetch(`http://localhost:8080/api/savings/${onlyDigits(cpf)}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(transferValue) }),
      });

      if (!res.ok) throw new Error(await res.text() || `Erro: ${res.status}`);

      setSuccess("Transferência realizada com sucesso.");
      setTransferValue("");
    } catch (err: any) {
      setError(err.message || "Erro na transferência.");
    } finally {
      setLoadingTransfer(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conta Poupança</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleDeposit} className="space-y-4">
            <h3 className="text-lg font-medium">Depositar</h3>
            <div>
              <label htmlFor="cpf-dep" className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                id="cpf-dep"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                onBlur={(e) => setCpf(formatCpf(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                id="deposit"
                type="number"
                step="0.01"
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingDeposit}
                className="w-full inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loadingDeposit ? "Enviando..." : "Depositar"}
              </button>
            </div>
          </form>

          <form onSubmit={handleTransfer} className="space-y-4">
            <h3 className="text-lg font-medium">Transferência</h3>
            <div>
              <label htmlFor="cpf-trf" className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                id="cpf-trf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                onBlur={(e) => setCpf(formatCpf(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label htmlFor="transfer" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                id="transfer"
                type="number"
                step="0.01"
                value={transferValue}
                onChange={(e) => setTransferValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingTransfer}
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loadingTransfer ? "Enviando..." : "Transferir"}
              </button>
            </div>
          </form>
        </div>

        {error && <div className="mt-6 text-sm text-red-600">{error}</div>}
        {success && <div className="mt-6 text-sm text-green-600">{success}</div>}
      </div>
    </main>
  );
}
