import React from 'react';

const quickStats = [
  { label: 'Active Clients', value: '18.4k', change: '+6.2%' },
  { label: 'Monthly Revenue', value: '$243k', change: '+12.7%' },
  { label: 'Pending Approvals', value: '32', change: '-4 this week' },
];

const actionItems = [
  {
    title: 'Launch holiday merchandising campaign',
    description: 'Prep curated bundles and promo codes before Friday.',
  },
  {
    title: 'Review top seller inventory gaps',
    description: 'Flag SKUs below 15 days cover for replenishment.',
  },
  {
    title: 'Publish Q4 onboarding guide',
    description: 'Update documentation for new professional partners.',
  },
];

export default function AdminOverview() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">
          Admin Control Center
        </p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">
          Stay on top of community activity, catalogue health, and growth-driving initiatives.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-montserrat text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-playfair font-semibold text-gray-900">{stat.value}</p>
            <p className="text-xs font-montserrat text-emerald-600">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-gray-900">Priority Actions</h2>
        <p className="text-sm font-montserrat text-gray-500">
          Align stakeholders and keep execution moving with curated to-dos.
        </p>
        <div className="mt-6 space-y-4">
          {actionItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-4"
            >
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm font-montserrat text-gray-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

