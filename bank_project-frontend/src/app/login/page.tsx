"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    setSuccess("Login bem-sucedido (simulação).");
    console.log("Login submit", { email, password });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Entrar</h2>
        <p className="text-sm text-gray-500 mb-6">Acesse sua conta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
              <span className="ml-2">Lembrar-me</span>
            </label>

            <Link href="#" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</Link>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">Criar conta</Link>
        </p>
      </div>
    </main>
  );
}
