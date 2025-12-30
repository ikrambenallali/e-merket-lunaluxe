import React from 'react';

const segments = [
  { name: 'Clients', count: '12.9k', trend: '+4.3%' },
  { name: 'Professionals', count: '2.1k', trend: '+1.1%' },
  { name: 'Sellers', count: '640', trend: '+0.8%' },
];

const approvalQueue = [
  { name: 'Océane Atelier', type: 'Professional', submitted: '2h ago' },
  { name: 'Glow Cartel', type: 'Seller', submitted: '5h ago' },
  { name: 'Maven Beauty Lab', type: 'Professional', submitted: 'Yesterday' },
];

export default function AdminUsers() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">
          User Management
        </p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">
          Govern access & trust
        </h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">
          Review approvals, monitor growth, and support every segment from a single console.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.name} className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-montserrat text-gray-500">{segment.name}</p>
            <p className="mt-2 text-3xl font-playfair font-semibold text-gray-900">{segment.count}</p>
            <p className="text-xs font-montserrat text-emerald-600">{segment.trend}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-gray-900">Approval Queue</h2>
        <div className="mt-6 space-y-4">
          {approvalQueue.map((entry) => (
            <article
              key={entry.name}
              className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{entry.name}</p>
                <p className="text-xs font-montserrat text-gray-500">{entry.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-montserrat text-gray-400">{entry.submitted}</p>
                <div className="flex gap-2">
                  <button className="rounded-full border border-emerald-500 px-4 py-1 text-xs font-semibold font-montserrat text-emerald-600 transition hover:bg-emerald-500 hover:text-white">
                    Approve
                  </button>
                  <button className="rounded-full border border-brandRed px-4 py-1 text-xs font-semibold font-montserrat text-brandRed transition hover:bg-brandRed hover:text-white">
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

