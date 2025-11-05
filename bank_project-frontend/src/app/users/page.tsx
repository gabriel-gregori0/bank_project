"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  cpf: string;
  email: string;
  role?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

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

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('Buscando usuários...');
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao buscar usuários";
        
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
      console.log('Usuários carregados:', data.length);
      setUsers(data);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || "Erro ao carregar usuários. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cpf: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário com CPF ${cpf}?`)) {
      return;
    }

    try {
      console.log('Excluindo usuário:', cpf);
      const response = await fetch(`http://localhost:8080/api/user/${cpf}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      console.log('Status da exclusão:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao excluir usuário";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Atualiza a lista removendo o usuário excluído
      setUsers(users.filter((u) => u.cpf !== cpf));
      alert("Usuário excluído com sucesso!");
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      alert(err.message || "Erro ao excluir usuário. Verifique se o backend está rodando.");
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, password: "" });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
        cpf: editingUser.cpf,
      };

      // Só envia a senha se foi alterada
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      console.log('Atualizando usuário:', editingUser.cpf);
      const response = await fetch(`http://localhost:8080/api/user/${editingUser.cpf}`, {
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
        let errorMessage = "Erro ao atualizar usuário";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      console.log('Usuário atualizado:', updatedUser);
      
      // Atualiza a lista com o usuário editado
      setUsers(users.map((u) => (u.cpf === editingUser.cpf ? updatedUser : u)));
      setEditingUser(null);
      alert("Usuário atualizado com sucesso!");
    } catch (err: any) {
      console.error('Erro ao atualizar:', err);
      alert(err.message || "Erro ao atualizar usuário. Verifique se o backend está rodando.");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", password: "" });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="text-lg text-gray-700">Carregando usuários...</div>
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
              <h1 className="text-3xl font-extrabold text-gray-800">Gerenciamento de Usuários</h1>
              <p className="text-sm text-gray-600 mt-1">Visualize, edite e exclua usuários do sistema</p>
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

        {/* Lista de Usuários */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
          {users.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Função</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.cpf} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                            title="Editar usuário"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.cpf)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                            title="Excluir usuário"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-800">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{user.cpf}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN" 
                            ? "bg-purple-100 text-purple-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.role || "USER"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Edição */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Usuário</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha (deixe em branco para não alterar)
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingUser.cpf}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
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
