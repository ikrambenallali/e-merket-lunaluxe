import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../assets/Images/login-image.png";
import LoginHeader from "../../components/LoginHeader"
import { useEffect, useState } from "react";
import API_ENDPOINTS, { api } from "../../config/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";


const schema = yup.object({
  email: yup.string().required("L'email est requis").email("Email invalide"),
  password: yup.string().required("Le mot de passe est requis").min(6, "Au moins 6 caractères"),
}).required();

export default function Login() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { register: loginField, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });
const onSubmit = async (data) => {

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: data.email,
        password: data.password,
      });

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

      toast.success("Connexion réussie !");

      // Navigate based on user role
      if (response.data?.data?.user?.role === "admin") {
        navigate('/admin', { replace: true });
      } else if (response.data?.data?.user?.role === "seller") {
        navigate("/seller", { replace: true });
      } else if (response.data?.data?.user?.role === "user") {
        navigate('/client', { replace: true });
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  // this use effect for hide the overflow for the login page!
  useEffect(() => {
    // add styles when component mounts
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';

    // cleanup function to remove styles when component unmounts
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      <LoginHeader />
      <div className="flex lg:flex-row w-full h-screen ">

        <div className="hidden lg:block lg:w-[45%] relative">
          <img
            src={LoginImage}
            alt="Cosmetologist"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full lg:w-[55%] flex flex-col justify-center mb-20 items-center px-4 sm:px-8 bg-[#FAFAFA]">

          <h1 className="text-center font-playfair font-bold uppercase text-4xl lg:text-5xl mb-[57px] text-brandRed">
            Content de te revoir !
          </h1>

          {/* Success Message */}
          {/* {success && (
          <div className="w-full max-w-md mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )} */}

          {/* Error Message */}
          {/* {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )} */}

          <form className="w-full max-w-md font-montserrat" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-[34px]">
              <input
                type="email"
                placeholder="EMAIL"
                 {...loginField("email")}
                className=" placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white text-brandBrown"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-[67px]">
              <input
                type="password"
                placeholder="PASSWORD"
                {...loginField("password")}
                className=" placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white text-brandBrown"
              />
               {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Login Button */}
            <div className="flex items-center mb-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <button
                type="submit"
                className="font-montserrat font-normal px-6 uppercase py-2 mx-4 text-lg text-brandWhite bg-brandRed hover:bg-brandBrown disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-md transition-colors duration-300 whitespace-nowrap w-[320px]"
              >
                Login
              </button>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>


            {/* Sign Up Link */}
            <div className="text-center">
              <p className=" text-brandBrown">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/signup"
                  className="text-brandRed hover:text-brandRed transition-colors duration-300"
                >
                  Inscrivez-vous
                </Link>
              </p>
            </div>
          </form>
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
      />
      </div>
    </>
  );
}