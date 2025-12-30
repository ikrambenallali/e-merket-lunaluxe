import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Share2 } from "lucide-react";
import API_ENDPOINTS, { api } from "../../config/api";
import { useCart, } from "../../Hooks/useCart";
import Layout from "../../components/Layout";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function ProductDetails() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ONE.replace(':id', id));
        const productData = response.data?.data || response.data;
        console.log('productData :', productData);
        setProduct(productData);
        setQuantity(1);
        setActiveImageIndex(0);
      } catch (error) {
        console.error("Error fetching product", error);
        setError("Impossible de charger ce produit. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    if (id){
      fetchProduct();
    }
  }, [id]);

  // Fetch minimal public seller name if product only has seller_id
  useEffect(() => {
    if (!product) return;
    // if product already contains seller object with fullname, use it
    if (product.seller && (product.seller.fullname || product.seller.name)) {
      setSellerName(product.seller.fullname || product.seller.name);
      return;
    }

    const sellerId = product.seller_id || product.sellerId || null;
    if (!sellerId) return;

    let mounted = true;
    const fetchSellerName = async () => {
      try {
        const res = await api.get(`/users/public/${sellerId}/username`);
        const data = res.data?.data || res.data;
        const name = data?.name || data?.fullname || null;
        if (mounted) setSellerName(name);
      } catch (err) {
        console.error('Failed to fetch public seller name', err);
      }
    };

    fetchSellerName();
    return () => { mounted = false; };
  }, [product]);

  const galleryImages = product
    ? [
        buildImageUrl(product.primaryImage),
        ...(Array.isArray(product.secondaryImages)
          ? product.secondaryImages.map(buildImageUrl)
          : []),
      ].filter(Boolean)
    : [];

  const mainImage = galleryImages[activeImageIndex] || galleryImages[0] || PLACEHOLDER_IMAGE;

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate({ productId: product._id, quantity });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="font-montserrat text-gray-500">Chargement...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
          <p className="font-montserrat text-gray-500 text-center">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat"
          >
            Retour
          </button>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const priceValue = typeof product.price === "number" ? product.price.toFixed(2) : product.price;
  const stockValue = Number(product.stock) || 0;
  const canDecrease = quantity > 1;
  const canIncrease = stockValue ? quantity < stockValue : true;

  const categoryNames = Array.isArray(product.categories) 
  ? product.categories.map((cat) => cat?.name).filter(Boolean) 
  : [product.category?.name || "Non spécifiée"];
  
  console.log('product seller wdakchi... :', product.seller_id); 

  const productDetails = [
    { label: "Catégorie", value: categoryNames.length ? categoryNames.join(", ") : "Non spécifiées" },
    { label: "Vendeur", value: sellerName || product.seller?.fullname || "Non renseigné" },
  ];
  
    
  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-brandWhite min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brandBrown hover:text-brandRed transition-colors duration-300 mb-6 font-montserrat"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-brandSwhite">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                  <div className="absolute top-4 right-4 bg-brandRed text-white px-5 py-1 rounded-md text-sm font-montserrat font-light">
                    -20%
                  </div>
            
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-l_black mb-4">
                  {product.title}
                </h1>

                <p className="font-montserrat text-base text-gray-700 mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-montserrat text-sm text-gray-500 uppercase tracking-widest">
                      Prix
                    </p>
                    <p className="font-playfair text-3xl text-brandRed font-semibold">
                      {priceValue}$
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-brandRed hover:text-brandRed transition-colors"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart size={20} />
                    </button>
                    <button
                      className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-brandRed hover:text-brandRed transition-colors"
                      aria-label="Partager"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {productDetails.map((detail) => (
                    <div key={detail.label} className="rounded-xl bg-white border border-gray-100 px-4 py-3">
                      <p className="font-montserrat text-xs uppercase tracking-wide text-gray-400">
                        {detail.label}
                      </p>
                      <p className="font-montserrat text-sm text-gray-800 mt-1">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Stock Information */}
                <div className="mb-6">
                  <p className="font-montserrat text-sm text-gray-600">
                    Stock disponible:{" "}
                    <span className={`font-semibold ${stockValue ? "text-green-600" : "text-red-500"}`}>
                      {stockValue || "Rupture"}
                    </span>
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                        Quantité:
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => canDecrease && setQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={!canDecrease}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat font-semibold"
                        >
                          -
                        </button>
                        <span className="font-montserrat text-lg font-semibold w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => canIncrease && setQuantity((prev) => prev + 1)}
                          disabled={!canIncrease}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={(e) => e.preventDefault()
                        ? handleAddToCart(product, quantity)
                        : handleAddToCart(product, quantity)
                      }
                      className="w-full lg:w-[50%] mt-2 flex items-center justify-center gap-2 bg-brandRed text-white px-8 py-4 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={20} />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                </div>
                {galleryImages.length > 1 && (
                  <div className="mt-8">
                    <p className="font-montserrat text-sm text-gray-500 mb-3">
                      Images secondaires
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {galleryImages.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative aspect-square overflow-hidden rounded-lg border transition-colors duration-300 ${
                            activeImageIndex === index ? "border-brandRed" : "border-transparent"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>

            </div>
          </div>
        </div>
         <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      </div>
    </Layout>
  );
}
