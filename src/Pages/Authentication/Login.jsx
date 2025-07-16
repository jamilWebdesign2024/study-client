import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SocialLogin from './SocialLogin/SocialLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const loggedUser = result.user;


      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${loggedUser.displayName || 'User'}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      navigate(from, { replace: true });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Login to <span className="text-secondary">StudySphere</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email Field */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-neutral">Email</span>
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
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-neutral">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters required" },
                })}
                className="input input-bordered w-full pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        {/* Forgot Password & Signup Redirect */}
        <div className="text-center mt-4 text-sm">
          <p className="text-neutral">
            Don’t have an account?
            <a href="/signup" className="text-secondary font-medium ml-1">Sign Up</a>
          </p>
          <p className="text-neutral mt-1">
            <a href="/forgot-password" className="text-primary text-sm underline">Forgot Password?</a>
          </p>
        </div>

        {/* Social Login */}
        
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
