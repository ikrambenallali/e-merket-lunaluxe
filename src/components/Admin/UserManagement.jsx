import { useState } from "react";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../../Hooks/useUsers";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import { UserPlus, X } from "lucide-react";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useUsers(page);
  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (data) => {
    if (editingUser) {
      await updateUser.mutateAsync({ id: editingUser.id, data });
      setEditingUser(null);
    } else {
      await createUser.mutateAsync(data);
    }
    setShowModal(false);
  };

  const handleUpdateRole = ({ id, role }) => {
    updateUser.mutate({ id, data: { role } });
  };
  
  const handleDelete = (id) => deleteUser.mutate(id);

  const openCreateModal = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-montserrat">Erreur : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
            <p className="font-montserrat text-gray-600 mt-2">Gérez les utilisateurs et leurs rôles</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-brandRed text-white px-6 py-3 rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium shadow-lg hover:shadow-xl"
          >
            <UserPlus size={20} />
            Ajouter un utilisateur
          </button>
        </div>

        {/* Table */}
        <UserTable 
          users={users} 
          onUpdate={handleUpdateRole} 
          onDelete={handleDelete} 
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="font-playfair text-2xl font-bold text-gray-800">
                  {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                <UserForm onSubmit={handleSubmit} defaultValues={editingUser} onCancel={closeModal} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
