import React from 'react';

const metrics = [
  { label: 'Conversion Rate', value: '4.8%', trend: '+0.6%' },
  { label: 'Average Order Value', value: '$86.20', trend: '+$3.40' },
  { label: 'Return Rate', value: '2.1%', trend: '-0.4%' },
];

const exports = [
  { title: 'Monthly Revenue Breakdown', description: 'CSV · Last generated 2h ago' },
  { title: 'Channel Contribution Report', description: 'Excel · Last generated yesterday' },
  { title: 'Cohort Retention Snapshot', description: 'PDF · Last generated 5d ago' },
];

export default function AdminReports() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">
          Reports & Analytics
        </p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">
          Export-ready insights
        </h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">
          Monitor performance KPIs and generate shareable reports for finance, CX, and product.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-montserrat text-gray-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-playfair font-semibold text-gray-900">{metric.value}</p>
            <p className="text-xs font-montserrat text-emerald-600">{metric.trend}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-gray-900">Scheduled Exports</h2>
        <p className="text-sm font-montserrat text-gray-500">
          Stay audit-ready with fresh CSV, Excel, and PDF reports.
        </p>
        <div className="mt-6 space-y-4">
          {exports.map((item) => (
            <article key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-4">
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm font-montserrat text-gray-600">{item.description}</p>
              <button className="mt-3 rounded-full border border-brandRed px-4 py-1 text-xs font-semibold font-montserrat text-brandRed transition hover:bg-brandRed hover:text-white">
                Generate now
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

