"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Por favor, informe o nome.");
      return;
    }
    if (!cpf.trim()) {
      setError("Por favor, informe o CPF.");
      return;
    }
    if (!email.trim()) {
      setError("Por favor, informe o email.");
      return;
    }
    if (!password.trim()) {
      setError("Por favor, informe a senha.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, cpf, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erro: ${res.status}`);
      }

      const created = await res.json();
      setSuccess("Usuário criado com sucesso.");
      // redireciona para login após curto delay
      setTimeout(() => router.push("/login"), 1000);
      console.log("Usuário criado:", created);
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Criar conta</h2>
        <p className="text-sm text-gray-500 mb-6">Preencha os dados para criar sua conta.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60 focus:outline-none"
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
