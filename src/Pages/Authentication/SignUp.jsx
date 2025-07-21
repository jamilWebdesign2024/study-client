import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SocialLogin from './SocialLogin/SocialLogin';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { CgLayoutGrid } from 'react-icons/cg';
import axios from 'axios';


const SignUp = () => {
  const { createUser, updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const axiosSecure = useAxiosSecure();


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  // imagbb uploading
const handleImageUpload = async (e) => {
  const image = e.target.files[0];
  console.log(image);
  

  const formData = new FormData();
  formData.append("image", image);

  const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

  try {
    const res = await axios.post(imageUploadUrl, formData);
    const imageUrl = res.data.data.url;
    setProfilePic(imageUrl);
    console.log("Uploaded image URL:", imageUrl);
  } catch (error) {
    console.error("Image upload failed", error);
  }
};



// full form submit
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    try {
      const result = await createUser(data.email, data.password);
      await updateProfileInfo({
        displayName: data.name,
        photoURL: profilePic
      })

      // ✅ Optional: Save user to DB

      const userInfo = {
        name: data.name,
        email: data.email,
        role: 'student', // default role
        photo: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      console.log(userInfo);
      
      await axios.post('https://studys-phere-server.vercel.app/users', userInfo);


      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome to StudySphere!',
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message || 'Something went wrong!',
      });
    }
  };



  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Sign Up for <span className="text-secondary">StudySphere</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-neutral">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Photo URL */}
          {/* Profile Photo Upload */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-neutral">Profile Photo</span>
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
              <span className="label-text font-medium text-neutral">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address"
                }
              })}
              className="input input-bordered w-full"
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-neutral">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", { required: "Please confirm your password" })}
              className="input input-bordered w-full"
            />
            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>

        {/* Already have account */}
        <div className="text-center mt-4 text-sm">
          <p className="text-neutral">
            Already have an account?
            <a href="/login" className="text-secondary font-medium ml-1">Login</a>
          </p>
        </div>

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
};

export default SignUp;
