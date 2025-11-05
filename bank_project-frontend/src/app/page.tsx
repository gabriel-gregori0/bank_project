"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Por favor, informe o email.");
      return;
    }
    if (!password) {
      setError("Por favor, informe a senha.");
      return;
    }
    
    // Credenciais mock do admin
    const ADMIN_EMAIL = "adm@fiap.com.br";
    const ADMIN_PASSWORD = "fiap2025";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // salva usuário mock no localStorage como admin (mesma forma do backend)
      try { localStorage.setItem("user", JSON.stringify({ email, role: "ADMIN" })); } catch {}
      setSuccess("Login como admin bem-sucedido.");
      console.log("Admin login", { email });
      router.push("/admin");
      return;
    }

    // Se não for admin, tenta autenticar com o backend
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Email ou senha incorretos");
        } else {
          setError("Erro ao tentar fazer login. Por favor, tente novamente.");
        }
        return;
      }

      const user = await response.json();
      if (!user || !user.email) {
        setError("Resposta inválida do servidor");
        return;
      }

      try { 
        localStorage.setItem("user", JSON.stringify(user)); 
        setSuccess("Login bem-sucedido!");
        console.log("User login", { email });
        router.push("/account");
      } catch (error) {
        console.error("LocalStorage error:", error);
        setError("Erro ao salvar dados do usuário");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Erro ao tentar fazer login. Por favor, tente novamente.");
    }
  };

  const fillAdmin = () => {
    setEmail("adm@fiap.com.br");
    setPassword("fiap2025");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 ring-1 ring-gray-200">
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center text-red-600 font-extrabold text-lg mb-4 ring-1 ring-black/10" role="img" aria-label="Logo FIAP">FIAP</div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">FIAP BANK</h2>
          <p className="text-sm text-gray-600 mb-6">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </div>

          {/* Removido: lembrar-me e esqueceu a senha (conforme solicitado) */}

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-white font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-between gap-2">
          <button onClick={fillAdmin} className="flex-1 inline-flex items-center justify-center rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Usar credenciais admin</button>
          <Link href="/register" className="flex-1 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-green-200">Criar conta</Link>
        </div>
      </div>
    </main>
  );
}
