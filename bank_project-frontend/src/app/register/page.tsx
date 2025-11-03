"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  
  // Helpers para CPF
  const onlyDigits = (s: string) => s.replace(/\D/g, "");
  const formatCpf = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };
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
    const cpfDigits = onlyDigits(cpf);
    if (!cpfDigits) {
      setError("Por favor, informe o CPF.");
      return;
    }
    if (cpfDigits.length !== 11) {
      setError("CPF inválido. Deve conter 11 dígitos.");
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
      console.log('Iniciando registro de usuário...');
      const userData = { 
        name, 
        cpf: onlyDigits(cpf), 
        email, 
        password 
      };
      console.log('Dados a serem enviados:', { ...userData, password: '***' });

      const res = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      console.log('Status da resposta:', res.status);
      console.log('Headers da resposta:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        let errorMessage = "Erro ao criar usuário.";
        const contentType = res.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error('Erro detalhado:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await res.text();
          console.error('Resposta de erro:', text);
          errorMessage = text || `Erro ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const created = await res.json();
  setSuccess("Usuário criado com sucesso.");
  // redireciona para a página de login (agora raiz) após curto delay
  setTimeout(() => router.push("/"), 1000);
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
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              onBlur={(e) => setCpf(formatCpf(e.target.value))}
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
