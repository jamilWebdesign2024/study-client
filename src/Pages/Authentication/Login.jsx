import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin/SocialLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginAnimation from "../../../public/Login.json"; // লটি ফাইল path চেক করে নেবেন

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const loggedUser = result.user;

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${loggedUser.displayName || "User"}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-base-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full max-w-5xl bg-base-100 shadow-xl rounded-xl p-6 md:p-10">

        {/* Lottie Animation */}
        <div className="flex justify-center items-center">
          <Lottie
            animationData={loginAnimation}
            loop={true}
            className="w-3/4 md:w-full max-w-sm md:max-w-md"
          />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md mx-auto">
          <h2 className="lg:text-4xl text-2xl font-bold text-center mb-6 text-primary">
            Login to <span className="text-secondary">StudySphere</span>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  className="input input-bordered w-full pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-base-content/70 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full shadow-md"
            >
              Login
            </button>
          </form>

          {/* Forgot Password & Signup Redirect */}
          <div className="text-center mt-4 text-sm">
            <p>
              Don’t have an account?
              <a href="/signup" className="text-secondary font-medium ml-1">
                Sign Up
              </a>
            </p>
            <p className="mt-1">
              <a href="/forgot-password" className="text-primary underline">
                Forgot Password?
              </a>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
