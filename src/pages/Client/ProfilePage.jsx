
import { useEffect, useState } from "react";
import { User, Mail, Lock, Edit2, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_ENDPOINTS from "../../config/api";
import { api } from "../../config/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.PROFILE.MYPROFILE);
        console.log(response);
        const userData = response.data?.user;
        setUser(userData);
        setFormData({
          fullname: userData?.fullname || userData?.name || "",
          email: userData?.email || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.response?.data?.message || "Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      fullname: user?.fullname || user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullname: user?.fullname || user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setFormError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setFormError(null);

      // Validate password if provided
      if (formData.password && formData.password.length < 6) {
        setFormError("Le mot de passe doit contenir au moins 6 caractères");
        setIsSaving(false);
        return;
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        setFormError("Les mots de passe ne correspondent pas");
        setIsSaving(false);
        return;
      }

      // Prepare update data
      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE_PROFILE, updateData);
      const updatedUser = response.data?.user || response.data?.data?.user;
      
      setUser(updatedUser);
      setIsEditing(false);
      setFormData({
        fullname: updatedUser?.fullname || updatedUser?.name || "",
        email: updatedUser?.email || "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour du profil";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-brandWhite min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mb-4"></div>
          <p className="font-montserrat text-lg text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

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
    <div className="px-4 sm:px-6 lg:px-8 mt-5 py-16 bg-brandWhite min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-brandRed mb-2">
            Mon Profil
          </h1>
          <p className="font-montserrat text-gray-600">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex justify-center flex-1">
                <div className="w-32 h-32 rounded-full bg-brandRed/10 flex items-center justify-center">
                  <User size={64} className="text-brandRed" />
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-md hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat"
                >
                  <Edit2 size={18} />
                  Modifier
                </button>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="font-montserrat text-sm text-red-600">{formError}</p>
              </div>
            )}

            {/* User Information */}
            <div className="space-y-6">
              {/* Fullname */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brandBrown/10 flex items-center justify-center">
                  <User size={24} className="text-brandBrown" />
                </div>
                <div className="flex-1">
                  <label className="block font-montserrat text-sm font-medium text-gray-500 mb-1">
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat"
                      placeholder="Entrez votre nom complet"
                    />
                  ) : (
                    <p className="font-playfair text-xl font-semibold text-l_black">
                      {user?.fullname || user?.name || "Non spécifié"}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brandBrown/10 flex items-center justify-center">
                  <Mail size={24} className="text-brandBrown" />
                </div>
                <div className="flex-1">
                  <label className="block font-montserrat text-sm font-medium text-gray-500 mb-1">
                    Adresse e-mail
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat"
                      placeholder="Entrez votre adresse e-mail"
                    />
                  ) : (
                    <p className="font-montserrat text-lg text-l_black">
                      {user?.email || "Non spécifié"}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              {isEditing && (
                <>
                  <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-brandBrown/10 flex items-center justify-center">
                      <Lock size={24} className="text-brandBrown" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-montserrat text-sm font-medium text-gray-500 mb-1">
                        Nouveau mot de passe (laisser vide pour ne pas changer)
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat"
                        placeholder="Entrez un nouveau mot de passe"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-brandBrown/10 flex items-center justify-center">
                      <Lock size={24} className="text-brandBrown" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-montserrat text-sm font-medium text-gray-500 mb-1">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent font-montserrat"
                        placeholder="Confirmez le mot de passe"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-brandRed text-white rounded-md hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={18} />
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
