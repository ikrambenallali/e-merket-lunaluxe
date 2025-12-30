import { useState } from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import { useEffect } from "react";
import { api } from "../../config/api";

export default function UserTable({ users, onUpdate, onDelete, page, setPage, totalPages }) {
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await api.get("/users/roles");
        console.log("les role", res.data);
        setRoles(res.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles :", error);
      }
    }
    fetchRoles();
  }, []);

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setSelectedRole(user.role);
  };

  const handleSave = (userId) => {
    onUpdate({ id: userId, role: selectedRole });
    setEditingId(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-brandRed';
      case 'seller':
        return 'bg-hoverBrandRed';
      default:
        return 'bg-brandBrown';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-brandRed/10 text-brandRed';
      case 'seller':
        return 'bg-hoverBrandRed/10 text-hoverBrandRed';
      default:
        return 'bg-brandBrown/10 text-brandBrown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      user.avatar
                        ? `${import.meta.env.VITE_BASE_URL}${user.avatar}`
                        : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                    }
                    alt={user.fullname || "Avatar"}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-brandRed/20"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getRoleColor(user.role)}`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-1 truncate">
                    {user.fullname}
                  </h3>
                  <p className="font-montserrat text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {editingId === user._id ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="font-montserrat bg-brandWhite border-2 border-brandRed/20 text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent"
                    >
                     {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                    </select>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getRoleBadge(user.role)}`}>
                      <div className={`w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></div>
                      <span className="font-montserrat text-xs font-semibold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {editingId === user._id ? (
                  <>
                    <button
                      onClick={() => handleSave(user._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-montserrat font-medium transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <Save size={16} />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-montserrat font-medium transition-all duration-200"
                    >
                      <X size={16} />
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-3 bg-brandRed/10 hover:bg-brandRed/20 text-brandRed rounded-xl transition-all duration-200"
                      title="Modifier le rôle"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-3xl border border-brandRed/10 bg-white p-5 shadow-sm">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-2 px-6 py-3 bg-brandRed hover:bg-hoverBrandRed text-white rounded-xl font-montserrat font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </button>
        
        <div className="flex items-center gap-3">
          <span className="font-montserrat text-sm text-gray-500">Page</span>
          <span className="px-5 py-2.5 bg-brandRed text-white font-playfair font-semibold rounded-xl shadow-sm min-w-[3.5rem] text-center">
            {page}
          </span>
          <span className="font-montserrat text-gray-400">/</span>
          <span className="px-5 py-2.5 bg-gray-100 text-gray-700 font-montserrat font-semibold rounded-xl min-w-[3.5rem] text-center">
            {totalPages}
          </span>
        </div>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-6 py-3 bg-brandRed hover:bg-hoverBrandRed text-white rounded-xl font-montserrat font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        >
          Suivant
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}