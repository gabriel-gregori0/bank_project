"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string; role?: string; cpf?: string } | null>(null);
  const [expenses, setExpenses] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);

  // Função para calcular cor baseada no percentual
  const getExpenseColor = () => {
    if (totalDeposits === 0) return "text-gray-600";
    
    const percentage = (expenses / totalDeposits) * 100;
    
    if (percentage >= 30) return "text-[#c44e4e] font-bold"; // Vermelho fosco/opaco
    if (percentage >= 10) return "text-yellow-500 font-semibold"; // Amarelo
    
    return "text-green-600";
  };

  // Função para obter a classe de animação
  const getExpenseAnimation = () => {
    if (totalDeposits === 0) return "";
    
    const percentage = (expenses / totalDeposits) * 100;
    
    if (percentage >= 30) return "animate-pulse"; // Pulsa quando >= 30%
    if (percentage >= 10) return ""; // Sem animação entre 10-30%
    
    return "";
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.replace("/");
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      
      // Carregar dados financeiros se o usuário tiver CPF
      if (parsed.cpf) {
        const expensesKey = `expenses_${parsed.cpf}`;
        const depositsKey = `deposits_${parsed.cpf}`;
        
        const savedExpenses = localStorage.getItem(expensesKey);
        const savedDeposits = localStorage.getItem(depositsKey);
        
        setExpenses(savedExpenses ? parseFloat(savedExpenses) : 0);
        setTotalDeposits(savedDeposits ? parseFloat(savedDeposits) : 0);
      }
    } catch (err) {
      router.replace("/");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    try { localStorage.removeItem("user"); } catch {}
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4 text-center">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Escolha o tipo da conta</h2>
          
          {/* Indicador de Despesas */}
          {user?.cpf && (
            <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4 transition-all duration-500">
              <p className="text-sm text-gray-600">Despesa Total:</p>
              <p className={`text-2xl font-bold transition-colors duration-500 ${getExpenseColor()} ${getExpenseAnimation()}`}>
                R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Inclui saques e transferências de ambas as contas
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <Link
            href="/checking"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700"
          >
            Corrente
          </Link>

          <Link
            href="/savings"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700"
          >
            Poupança
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/users"
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-white font-semibold hover:bg-purple-700"
            >
              Gerenciar Usuários
            </Link>
          )}
        </div>

        <div>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Sair</button>
        </div>
      </div>
    </main>
  );
}
