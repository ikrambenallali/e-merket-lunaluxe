import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../config/api";
import API_ENDPOINTS from "../../config/api";
import { Link } from "react-router-dom";
import { useCart, } from "../../Hooks/useCart";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";
const ITEMS_PER_PAGE = 8;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;
  const { addToCart } = useCart(user.id);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://emarketlunaluxe6.vercel.app  ';

  // Helper function to build image URL
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}` : path;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
        console.log('response :', response);
        const productsData = response.data?.data || [];
        console.log('productsData :', productsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || "Erreur lors du chargement des produits");
      }
    };

    fetchProducts();
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(product => {
        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        switch (priceFilter) {
          case "under-25":
            return price < 25;
          case "25-50":
            return price >= 25 && price <= 50;
          case "50-100":
            return price > 50 && price <= 100;
          case "over-100":
            return price > 100;
          default:
            return true;
        }
      });
    }

    // Sort products
    if (sortBy !== "default") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;

        switch (sortBy) {
          case "price-low":
            return priceA - priceB;
          case "price-high":
            return priceB - priceA;
          case "name-asc":
            return (a.title || "").localeCompare(b.title || "");
          case "name-desc":
            return (b.title || "").localeCompare(a.title || "");
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, searchQuery, priceFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceFilter, sortBy]);

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-brandWhite min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-montserrat text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-brandRed text-white rounded-md hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8 py-16 bg-brandWhite min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-brandBrown" />
              <span className="font-montserrat text-sm font-medium text-gray-700">Filtres:</span>
            </div>

            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat text-sm"
            >
              <option value="all">Tous les prix</option>
              <option value="under-25">Moins de 25$</option>
              <option value="25-50">25$ - 50$</option>
              <option value="50-100">50$ - 100$</option>
              <option value="over-100">Plus de 100$</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat text-sm"
            >
              <option value="default">Trier par</option>
              <option value="price-low">Prix: Croissant</option>
              <option value="price-high">Prix: Décroissant</option>
              <option value="name-asc">Nom: A-Z</option>
              <option value="name-desc">Nom: Z-A</option>
            </select>

            {/* Results Count */}
            <div className="ml-auto font-montserrat text-sm text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => {
                // Get image URL with priority: primaryImage > image > secondaryImages[0] > placeholder
                const imagePath = product.primaryImage ||
                  product.image ||
                  (product.secondaryImages && product.secondaryImages.length > 0
                    ? product.secondaryImages[0]
                    : null);
                const imageUrl = imagePath ? buildImageUrl(imagePath) : PLACEHOLDER_IMAGE;

                return (
                  <Link to={`/products/${product._id}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                    <div className="relative w-full h-80 overflow-hidden bg-brandSwhite">
                      <img
                        src={imageUrl}
                        alt={product.title || 'Product image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-brandRed text-white px-5 py-1 rounded-md text-sm font-montserrat font-light">
                        -20%
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between bg-white flex-1">
                      <div>
                        <h3 className="font-playfair text-xl font-bold text-l_black mb-2">
                          {product.title}
                        </h3>

                        <p className="font-montserrat text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-montserrat text-xl font-bold text-brandRed">
                          {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}$
                        </span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart.mutate({ productId: product._id, quantity: 1 });
                          }}
                          className="flex items-center cursor-pointer gap-2 bg-brandRed text-white px-6 py-2 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium"
                        >
                          <ShoppingCart size={18} />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat text-sm"
                >
                  <ChevronLeft size={18} />
                  <span>Précédent</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-montserrat text-sm transition-colors duration-300 ${currentPage === page
                            ? 'bg-brandRed text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat text-sm"
                >
                  <span>Suivant</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center mt-4 font-montserrat text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-montserrat text-lg text-gray-600">
              {searchQuery || priceFilter !== "all"
                ? "Aucun produit ne correspond à vos critères de recherche."
                : "Aucun produit disponible pour le moment."}
            </p>
            {(searchQuery || priceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter("all");
                  setSortBy("default");
                }}
                className="mt-4 px-6 py-2 bg-brandRed text-white rounded-md hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}