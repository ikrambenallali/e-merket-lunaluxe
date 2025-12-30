import React, { Suspense, lazy } from "react";
import { useSellerStats } from "../../Hooks/useUsers";
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line} from "recharts";

const SellerStatsCard = ({ title, value }) => (

  <div className="rounded-xl border border-brandRed/10 bg-white p-6 shadow-sm">  
    <h3 className="text-sm font-montserrat text-gray-600 mb-2">{title}</h3>  
    <p className="text-3xl font-bold font-playfair text-brandRed">{value}</p>  
  </div>  
);  

const SellerTopProducts = ({ topProducts }) => {
if (!topProducts || topProducts.length === 0) return <p>No top products yet.</p>;

return ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{topProducts.map((p) => ( <div key={p.productId} className="rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm flex flex-col items-center">
<img
src={p.primaryImage ? `${import.meta.env.VITE_BASE_URL}${p.primaryImage}` : "/placeholder.png"}
alt={p.title}
className="w-32 h-32 object-cover rounded-lg mb-2"
/> <h4 className="font-semibold text-gray-800">{p.title}</h4> <p className="text-sm text-gray-600">Sold: {p.quantitySold}</p> <p className="text-sm text-gray-600">Revenue: ${p.revenue.toFixed(2)}</p> </div>
))} </div>
);
};

const SellerStatsPage = () => {
const { data, isLoading, isError, error } = useSellerStats();

if (isLoading) return <p className="text-center mt-10">Loading statistics...</p>;
if (isError) return <p className="text-center mt-10 text-red-500">{error.message}</p>;

return ( 
<div className="mx-auto max-w-7xl px-6 py-10 space-y-10"> <h1 className="text-3xl font-semibold font-playfair text-gray-900">Dashboard Statistics</h1>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  
    <SellerStatsCard title="Total Products" value={data.productsCount} />  
    <SellerStatsCard title="Total Orders" value={data.totalOrders} />  
    <SellerStatsCard title="Total Revenue" value={`$${data.totalRevenue}`} />  
    <SellerStatsCard title="Low Stock Products" value={data.lowStockCount} />  
    <SellerStatsCard title="Total Reviews" value={data.totalReviews} />  
    <SellerStatsCard title="Average Rating" value={data.averageRating} />  
  </div>  

  <div className="space-y-4">  
    <h2 className="text-2xl font-semibold font-playfair text-gray-900">Top Products</h2>  
    <SellerTopProducts topProducts={data.topProducts} />  
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

  {/* Bar Chart - Quantity Sold */}
  <div className="rounded-xl border border-brandRed/10 bg-white p-6 shadow-sm">
    <h3 className="text-xl font-playfair font-semibold mb-4 text-gray-800">
      Quantity Sold (Top Products)
    </h3>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.topProducts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantitySold" fill="#e63946" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Line Chart - Revenue */}
  <div className="rounded-xl border border-brandRed/10 bg-white p-6 shadow-sm">
    <h3 className="text-xl font-playfair font-semibold mb-4 text-gray-800">
      Revenue Generated (Top Products)
    </h3>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.topProducts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#d00000" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>

</div>
  
</div>  


);
};

export default SellerStatsPage;
