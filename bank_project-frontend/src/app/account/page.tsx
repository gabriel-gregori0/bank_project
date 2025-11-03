"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4 text-center">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Escolha sua conta</h2>
            <p className="text-sm text-gray-600">Selecione o tipo de conta para acessar as operações.</p>
          </div>
          <div className="text-sm text-gray-600">{user?.email}</div>
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
        </div>

        <div>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Sair</button>
        </div>
      </div>
    </main>
  );
}
