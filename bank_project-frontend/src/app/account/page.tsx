"use client";

import React from "react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mx-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Escolha sua conta</h2>
        <p className="text-sm text-gray-600 mb-6">Selecione o tipo de conta para acessar as operações.</p>

        <div className="grid grid-cols-1 gap-4">
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
      </div>
    </main>
  );
}
