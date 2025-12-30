import { useState, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../assets/Images/login-image.png";
import LoginHeader from "../../components/LoginHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import API_ENDPOINTS, { api } from "../../config/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";
import store from "../../features/store";


const schema = yup.object({
  fullname: yup.string().required("Le nom complet est requis").min(3, "Au moins 3 caractères"),
  email: yup.string().required("L'email est requis").email("Email invalide"),
  password: yup.string().required("Le mot de passe est requis").min(6, "Au moins 6 caractères"),
}).required();
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });
  // Hide overflow for the signup page
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const onSubmit = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
      fullname: data.fullname,
      email: data.email,
      password: data.password
    });

    toast.success("Compte créé avec succès !");

    dispatch(setCredentials({
      token: response.data.data.token,
      user: response.data.data.user,
    }));

    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    if (response.data?.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    setTimeout(() => navigate("/client"), 1000);

  } catch (error) {
    const msg = error.response?.data?.message || "Erreur lors de l'inscription.";
    toast.error(msg);
  }
};

  return (
    <>
      <LoginHeader />
      <div className="flex lg:flex-row w-full h-screen">
        {/* Form Section - Left side */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-20 bg-[#FAFAFA]">

          <div className="w-full -mt-16 max-w-lg">
            <h1 className="text-center font-playfair font-bold uppercase text-4xl lg:text-5xl mb-12 text-brandRed tracking-wide">
              Inscrivez-vous
            </h1>



            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {/* Full Name */}
              <div className="mb-6">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Nom Et Prénom"
                  {...register("fullname")}
                  className="font-montserrat w-full px-4 py-3 border-2 border-black focus:border-brandRed focus:outline-none transition-colors bg-white text-gray-800"
                />
                {errors.fullname && <p className="text-red-600 text-sm mt-1">{errors.fullname.message}</p>}
              </div>

              {/* Email */}
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  {...register("email")}
                  className="font-montserrat w-full px-4 py-3 border-2 border-black focus:border-brandRed focus:outline-none transition-colors bg-white text-gray-800"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Fields in Row */}
              <div className="flex gap-4 mb-8">
                {/* Password */}
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    {...register("password")}
                    className="font-montserrat w-full px-4 py-3 border-2 border-black focus:border-brandRed focus:outline-none transition-colors bg-white text-gray-800 pr-10"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-brandRed transition-colors"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>


              </div>

              {/* Register Button with decorative lines */}
              <div className="flex items-center mb-8">
                <div className="flex-1 h-px bg-gray-300"></div>
                <button
                  type="submit"
                  className="font-montserrat mx-6 px-8 py-3 text-brandWhite bg-[#6B4C3C] hover:bg-[#5a3d2f] transition-colors duration-300 uppercase tracking-wide"
                >
                  Créer Un Compte
                </button>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="font-montserrat text-gray-800">
                  Vous Avez Déjà Un Compte ?{" "}
                  <Link
                    to="/login"
                    className="text-brandRed hover:underline transition-all duration-300"
                  >
                    Se Connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section - Right side */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={LoginImage}
            alt="Cosmetologist"
            className="h-full w-full object-cover"
          />
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
        toastStyle={{ zIndex: 9999 }}
      />
    </>
  );
}