"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckingPage() {
  const [deposit, setDeposit] = useState("");
  const [cpf, setCpf] = useState("");
  
  const onlyDigits = (s: string) => s.replace(/\D/g, "");
  const formatCpf = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.replace("/login");
      }
    } catch (err) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cpfDigits = onlyDigits(cpf);
    if (!cpfDigits) {
      setError("Por favor, informe o CPF do usuário.");
      return;
    }
    if (cpfDigits.length !== 11) {
      setError("CPF inválido. Deve conter 11 dígitos.");
      return;
    }

    if (!deposit || Number(deposit) <= 0) {
      setError("Informe um valor de depósito maior que 0.");
      return;
    }

    setLoading(true);
    try {
      // Envia o depósito como saldo inicial (balance)
      const payload: any = {
        user: { cpf: onlyDigits(cpf) },
        balance: Number(deposit),
      };

      const res = await fetch("/api/checking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erro: ${res.status}`);
      }

      const created = await res.json();
      setSuccess("Conta corrente criada com sucesso.");
      console.log("CheckingAccount criado:", created);
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta corrente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Criar Conta Corrente</h2>
        <p className="text-sm text-gray-500 mb-6">conta corrente.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF do usuário</label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              onBlur={(e) => setCpf(formatCpf(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">Depósito inicial (R$)</label>
            <input
              id="deposit"
              type="number"
              step="0.01"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none"
            >
              {loading ? "Criando..." : "Criar conta corrente"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
