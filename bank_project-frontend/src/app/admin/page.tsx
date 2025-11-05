"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);

  useEffect(() => {
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
      setUser(parsed);
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-4 text-center ring-1 ring-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-extrabold text-lg mb-4 ring-2 ring-purple-200" role="img" aria-label="Admin">
            ADM
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Painel Administrativo</h2>
          <p className="text-sm text-gray-600 mt-1">Escolha uma área para gerenciar</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Link
            href="/users"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gerenciar Usuários
          </Link>

          <Link
            href="/checking-list"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Contas Correntes
          </Link>

          <Link
            href="/savings-list"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contas Poupança
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-2">Logado como: <span className="font-semibold">{user?.email}</span></p>
          <button onClick={logout} className="text-sm text-red-600 hover:underline font-medium">
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
