import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../config/api';

// -------------------
// Hooks
// -------------------
const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get(`/products/`);
      return res.data.data; // array of products
    },
  });

const useProductFeedback = (productId) =>
  useQuery({
    queryKey: ['feedbacks', productId],
    queryFn: async () => {
      const res = await api.get(`/reviews/product/${productId}`);
      return res.data.data || []; // array of feedbacks
    },
    enabled: !!productId, // only fetch when productId exists
  });

const useDeleteFeedback = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackId) => {
      await api.delete(`/reviews/admin/${feedbackId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks', productId] });
    },
  });
};

// -------------------
// Component
// -------------------
export default function FeedbackPage() {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?._id ?? null);

  const { data: feedbacks = [], isLoading: loadingFeedbacks } = useProductFeedback(selectedProductId);

  const deleteFeedback = useDeleteFeedback(selectedProductId);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [products, searchTerm]);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const handleDeleteFeedback = (feedbackId) => {
    deleteFeedback.mutate(feedbackId);
  };

  if (loadingProducts) return <p>Chargement...</p>;
  if (!products.length) return <p>No products available</p>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">
          Feedback Control Center
        </p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">
          Product Sentiment & Quality Signals
        </h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">
          Track product health, surface urgent feedback, and triage responses with one click.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_minmax(0,1fr)]">
        {/* Products Table */}
        <div className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold font-playfair text-gray-900">
                Product Feedback Streams
              </h2>
              <p className="text-sm font-montserrat text-gray-500">
                Click a row to inspect detailed feedback threads.
              </p>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product or SKU"
              className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm font-montserrat text-gray-700 placeholder:text-gray-400 focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed sm:w-64"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-sm font-montserrat">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Product</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">Product ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const isActive = product._id === selectedProductId;
                  return (
                    <tr
                      key={product._id}
                      className={`cursor-pointer transition ${isActive ? 'bg-brandRed/5 text-brandRed' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setSelectedProductId(product._id)}
                    >
                      <td className="px-4 py-3 font-semibold">
                        <span className="text-xs uppercase tracking-wide text-gray-400">{product.sku}</span>
                        <p className="text-sm text-gray-900">{product.title}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{product._id}</td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm font-montserrat text-gray-400">
                      No products match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedbacks */}
        <div className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
          {selectedProduct ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-montserrat uppercase tracking-wide text-brandRed">Selected Product</p>
                  <h2 className="text-2xl font-playfair font-semibold text-gray-900">{selectedProduct.title}</h2>
                </div>
                <span className="rounded-full bg-brandRed/10 px-3 py-1 text-xs font-semibold font-montserrat text-brandRed">
                  {feedbacks.length} feedback{feedbacks.length !== 1 && 's'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {loadingFeedbacks && <p>Loading feedbacks...</p>}
                {!loadingFeedbacks && feedbacks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center">
                    <p className="text-sm font-montserrat text-gray-500">No feedback entries remain for this product.</p>
                  </div>
                )}

                {!loadingFeedbacks &&
                  feedbacks.map((feedback) => (
                    <article
                      key={feedback._id || feedback.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{feedback.title}</p>
                          <p className="text-xs font-montserrat text-gray-500">
                            {feedback.customer || 'Anonymous'} · {feedback.channel || '-'}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">{feedback.rating}★</span>
                      </div>
                      <p className="mt-2 text-sm font-montserrat text-gray-600">{feedback.comment}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs font-montserrat text-gray-400">{feedback.createdAt}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeedback(feedback._id || feedback.id)}
                          className="rounded-full border border-brandRed px-4 py-1 text-xs font-semibold font-montserrat text-brandRed transition hover:bg-brandRed hover:text-white"
                        >
                          Delete feedback
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-montserrat text-gray-500">
                Select a product from the table to load its feedback details.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
