import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Save, X } from "lucide-react";

const schema = yup.object().shape({
  fullname: yup.string().required("Le nom est requis").min(3, "Au moins 3 caractères"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  role: yup.string().oneOf(["user", "seller", "admin"]).required("Le rôle est requis"),
});

export default function UserForm({ onSubmit, defaultValues, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nom complet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
          Nom complet
        </label>
        <input 
          {...register("fullname")} 
          placeholder="Ex: John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandRed focus:border-transparent transition-all duration-200 font-montserrat"
        />
        {errors.fullname && (
          <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.fullname.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
          Email
        </label>
        <input 
          {...register("email")} 
          type="email"
          placeholder="exemple@email.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandRed focus:border-transparent transition-all duration-200 font-montserrat"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.email.message}</p>
        )}
      </div>

      {/* Rôle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
          Rôle
        </label>
        <select 
          {...register("role")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandRed focus:border-transparent transition-all duration-200 font-montserrat bg-white"
        >
          <option value="">Sélectionnez un rôle</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.role.message}</p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 bg-brandRed text-white px-6 py-3 rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-montserrat font-medium"
          >
            <X size={18} />
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
