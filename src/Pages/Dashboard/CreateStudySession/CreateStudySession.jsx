import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../Components/Loading';

// ✅ Category List same file export
export const categoriesList = [
  "Art & Design",
  "Development",
  "Communication",
  "Videography",
  "Photography",
  "Marketing",
  "Content Writing",
  "Finance",
  "Science",
  "Network",
];

const CreateStudySession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [sessionImage, setSessionImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ✅ imgbb image upload
  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    
    const res = await fetch(imageUploadUrl, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let imageURL = "";

      if (sessionImage) {
        imageURL = await handleImageUpload(sessionImage);
      }

      const sessionData = {
        ...data,
        tutorName: user?.displayName,
        tutorEmail: user?.email,
        image: imageURL,
        registrationFee: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post('/sessions', sessionData);
      if (res.data.insertedId) {
        toast.success('Study session created successfully!');
        reset();
        setSessionImage(null);
      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      className="w-full mx-auto p-6 shadow-xl rounded-xl bg-base-300 mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-extrabold text-center text-primary mb-2">
        Create Study Session
      </h2>
      <p className="text-center mb-6 text-base-content">
        Fill out the form below to schedule a new study session.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Session Title */}
        <div>
          <label className="block mb-1 font-medium">Session Title</label>
          <input
            type="text"
            {...register('sessionTitle', { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter session title"
          />
          {errors.sessionTitle && <span className="text-error">Required</span>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            {...register('category', { required: true })}
            className="select select-bordered w-full"
          >
            <option disabled selected>Choose category</option>
            {categoriesList.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className="text-error">Required</span>}
        </div>

        {/* Session Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Session Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSessionImage(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Tutor Name */}
        <div>
          <label className="block mb-1 font-medium">Tutor Name</label>
          <input
            type="text"
            value={user?.displayName || ''}
            readOnly
            className="input input-bordered w-full input-disabled"
          />
        </div>

        {/* Tutor Email */}
        <div>
          <label className="block mb-1 font-medium">Tutor Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="input input-bordered w-full input-disabled"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register('description', { required: true })}
            rows="4"
            className="textarea textarea-bordered w-full"
          ></textarea>
          {errors.description && <span className="text-error">Required</span>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["registrationStartDate", "registrationEndDate", "classStartDate", "classEndDate"].map(key => (
            <div key={key}>
              <label className="block mb-1 font-medium">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="date"
                {...register(key, { required: true })}
                className="input input-bordered w-full"
              />
            </div>
          ))}
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-1 font-medium">Session Duration (weeks)</label>
          <input
            type="number"
            {...register('sessionDuration', { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., 4"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary px-10 flex items-center gap-2">
            <FaChalkboardTeacher /> Create Session
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateStudySession;
