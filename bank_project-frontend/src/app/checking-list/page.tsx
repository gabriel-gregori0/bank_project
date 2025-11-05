"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CheckingAccount {
  id: number;
  accountNumber: string;
  balance: number;
  user?: {
    cpf: string;
    name: string;
    email: string;
  };
}

export default function CheckingListPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<CheckingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAccount, setEditingAccount] = useState<CheckingAccount | null>(null);
  const [editForm, setEditForm] = useState({ balance: "" });

  useEffect(() => {
    // Verifica se o usuário está logado e é admin
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.replace("/");
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed.role !== "ADMIN") {
        router.replace("/account");
        return;
      }
    } catch (err) {
      router.replace("/");
      return;
    }

    fetchAccounts();
  }, [router]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('Buscando contas correntes...');
      const response = await fetch("http://localhost:8080/api/checking", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao buscar contas correntes";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error('Erro detalhado:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('Resposta de erro:', text);
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Contas carregadas:', data.length);
      setAccounts(data);
    } catch (err: any) {
      console.error('Erro ao buscar contas:', err);
      setError(err.message || "Erro ao carregar contas. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cpf: string) => {
    if (!confirm(`Tem certeza que deseja excluir a conta corrente do CPF ${cpf}?`)) {
      return;
    }

    try {
      console.log('Excluindo conta:', cpf);
      const response = await fetch(`http://localhost:8080/api/checking/${cpf}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      console.log('Status da exclusão:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao excluir conta";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setAccounts(accounts.filter((a) => a.user?.cpf !== cpf));
      alert("Conta excluída com sucesso!");
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      alert(err.message || "Erro ao excluir conta. Verifique se o backend está rodando.");
    }
  };

  const handleEditClick = (account: CheckingAccount) => {
    setEditingAccount(account);
    setEditForm({ balance: account.balance.toString() });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount || !editingAccount.user?.cpf) return;

    try {
      const updateData = {
        cpf: editingAccount.user.cpf,
        accountNumber: editingAccount.accountNumber,
        balance: parseFloat(editForm.balance),
      };

      console.log('Atualizando conta:', editingAccount.user.cpf);
      const response = await fetch(`http://localhost:8080/api/checking/${editingAccount.user.cpf}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updateData),
      });

      console.log('Status da atualização:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao atualizar conta";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedAccount = await response.json();
      console.log('Conta atualizada:', updatedAccount);
      
      setAccounts(accounts.map((a) => (a.user?.cpf === editingAccount.user?.cpf ? updatedAccount : a)));
      setEditingAccount(null);
      alert("Conta atualizada com sucesso!");
    } catch (err: any) {
      console.error('Erro ao atualizar:', err);
      alert(err.message || "Erro ao atualizar conta. Verifique se o backend está rodando.");
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditForm({ balance: "" });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="text-lg text-gray-700">Carregando contas correntes...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 ring-1 ring-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">Gerenciamento de Contas Correntes</h1>
              <p className="text-sm text-gray-600 mt-1">Visualize, edite e exclua contas correntes do sistema</p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Voltar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista de Contas */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
          {accounts.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              Nenhuma conta corrente encontrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nº da Conta</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Saldo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome do Titular</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(account)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                            title="Editar conta"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(account.user?.cpf || '')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                            title="Excluir conta"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-mono">{account.user?.cpf || '-'}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{account.id}</td>
                      <td className="py-3 px-4 text-gray-800 font-semibold">
                        R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{account.user?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Edição */}
        {editingAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Conta Corrente</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingAccount.user?.cpf || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID da Conta</label>
                  <input
                    type="text"
                    value={editingAccount.id}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saldo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.balance}
                    onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
