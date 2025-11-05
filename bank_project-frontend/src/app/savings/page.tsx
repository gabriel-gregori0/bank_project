"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ViewMode = "menu" | "create" | "deposit" | "withdraw";

export default function SavingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("menu");
  const [hasAccount, setHasAccount] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.replace("/");
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      
      if (parsed.cpf) {
        checkExistingAccount(parsed.cpf);
      } else {
        setLoading(false);
      }
    } catch (err) {
      router.replace("/");
    }
  }, [router]);

  const checkExistingAccount = async (userCpf: string) => {
    try {
      console.log('Verificando conta poupança para CPF:', userCpf);
      const response = await fetch(`http://localhost:8080/api/savings/${userCpf}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Conta poupança encontrada:', data);
        setAccount(data);
        setHasAccount(true);
      } else {
        console.log('Conta poupança não encontrada');
        setHasAccount(false);
      }
    } catch (err) {
      console.error('Erro ao verificar conta:', err);
      setHasAccount(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      setError("Informe um depósito inicial maior que 0.");
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        user: { cpf: user.cpf },
        balance: Number(amount),
      };

      const response = await fetch("http://localhost:8080/api/savings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao criar conta poupança";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const created = await response.json();
      console.log("Conta poupança criada:", created);
      setSuccess("Conta poupança criada com sucesso!");
      setAccount(created);
      setHasAccount(true);
      setAmount("");
      setTimeout(() => setViewMode("menu"), 1500);
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setError(err.message || "Erro ao criar conta poupança.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      setError("Informe um valor maior que 0.");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/savings/${user.cpf}/deposit`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ value: Number(amount) }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao realizar depósito";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.text();
      console.log("Depósito realizado:", result);
      setSuccess("Depósito realizado com sucesso!");
      if (user.cpf) {
        await checkExistingAccount(user.cpf);
      }
      setAmount("");
      setTimeout(() => setViewMode("menu"), 1500);
    } catch (err: any) {
      console.error('Erro ao depositar:', err);
      setError(err.message || "Erro ao realizar depósito.");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      setError("Informe um valor maior que 0.");
      return;
    }

    if (account && Number(amount) > account.balance) {
      setError("Saldo insuficiente.");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/savings/${user.cpf}/withdraw`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ value: Number(amount) }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao realizar saque";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.text();
      console.log("Saque realizado:", result);
      setSuccess("Saque realizado com sucesso!");
      if (user.cpf) {
        await checkExistingAccount(user.cpf);
      }
      setAmount("");
      setTimeout(() => setViewMode("menu"), 1500);
    } catch (err: any) {
      console.error('Erro ao sacar:', err);
      setError(err.message || "Erro ao realizar saque.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="text-lg text-gray-700">Carregando...</div>
        </div>
      </main>
    );
  }

  if (viewMode === "menu") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 text-center ring-1 ring-gray-200">
          <div className="flex flex-col items-center mb-6">
            <div className="h-14 w-14 rounded-full bg-green-600 flex items-center justify-center text-white font-extrabold text-lg mb-4 ring-2 ring-green-200">
              CP
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Conta Poupança</h2>
            {hasAccount && account && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg w-full">
                <p className="text-sm text-gray-600">Saldo atual:</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Conta: {account.accountNumber}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {!hasAccount && (
              <button
                onClick={() => setViewMode("create")}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 transition"
              >
                Criar Conta Poupança
              </button>
            )}

            {hasAccount && (
              <>
                <button
                  onClick={() => setViewMode("deposit")}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 transition"
                >
                  Depositar
                </button>

                <button
                  onClick={() => setViewMode("withdraw")}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 transition"
                >
                  Sacar
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => router.push("/account")}
            className="text-sm text-gray-600 hover:underline"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  if (viewMode === "create") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 ring-1 ring-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Criar Conta Poupança</h2>
          <p className="text-sm text-gray-500 mb-6">Informe o depósito inicial para criar sua conta</p>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Depósito Inicial (R$)</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="0.00"
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-60"
              >
                {processing ? "Criando..." : "Criar Conta"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("menu");
                  setAmount("");
                  setError("");
                  setSuccess("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  if (viewMode === "deposit") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 ring-1 ring-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Depositar</h2>
          <p className="text-sm text-gray-500 mb-6">Informe o valor que deseja depositar</p>

          {account && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Saldo atual:</p>
              <p className="text-xl font-bold text-green-600">
                R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="0.00"
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-60"
              >
                {processing ? "Depositando..." : "Depositar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("menu");
                  setAmount("");
                  setError("");
                  setSuccess("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  if (viewMode === "withdraw") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 ring-1 ring-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sacar</h2>
          <p className="text-sm text-gray-500 mb-6">Informe o valor que deseja sacar</p>

          {account && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Saldo disponível:</p>
              <p className="text-xl font-bold text-green-600">
                R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="0.00"
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-60"
              >
                {processing ? "Sacando..." : "Sacar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("menu");
                  setAmount("");
                  setError("");
                  setSuccess("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return null;
}
