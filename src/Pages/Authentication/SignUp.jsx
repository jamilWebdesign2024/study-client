import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SocialLogin from "./SocialLogin/SocialLogin";
import { useForm } from "react-hook-form";
import axios from "axios";
import Lottie from "lottie-react";
import signupAnimation from "../../../public/Register.json"; // ✅ তোমার Lottie ফাইলের path ঠিক করে নিও

const SignUp = () => {
  const { createUser, updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 🔹 Image Upload to imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key
      }`;

    try {
      const res = await axios.post(imageUploadUrl, formData);
      const imageUrl = res.data.data.url;
      setProfilePic(imageUrl);
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  // 🔹 Form Submit
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const result = await createUser(data.email, data.password);
      await updateProfileInfo({
        displayName: data.name,
        photoURL: profilePic,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        role: "student",
        photo: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to StudySphere!",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center w-full max-w-6xl bg-base-100 shadow-xl rounded-xl p-6 md:p-10">

        {/* 🔹 Lottie Animation */}
        <div className="flex justify-center items-center">
          <Lottie animationData={signupAnimation} loop={true} className="w-full max-w-sm md:max-w-md" />
        </div>

        {/* 🔹 Sign Up Form */}
        <div className="w-full max-w-md mx-auto">
          <h2 className="lg:text-4xl text-2xl font-bold text-center mb-6 text-primary">
            Sign Up for <span className="text-secondary">StudySphere</span>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your full name"
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Profile Photo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className="input input-bordered w-full"
              />
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full shadow-md">
              Register
            </button>
          </form>

          {/* Already have account */}
          <div className="text-center mt-4 text-sm">
            <p>
              Already have an account?
              <a href="/login" className="text-secondary font-medium ml-1">
                Login
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

export default SignUp;
