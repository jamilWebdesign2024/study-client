import React from 'react';
import { useForm } from 'react-hook-form';
import { FaChalkboardTeacher, FaCalendarAlt, FaRegClock } from 'react-icons/fa';


import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const CreateStudySession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const sessionData = {
      ...data,
      tutorName: user?.displayName,
      tutorEmail: user?.email,
      registrationFee: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log(sessionData);
    

    try {
      const res = await axiosSecure.post('/sessions', sessionData);
      if (res.data.insertedId) {
        toast.success('Study session created successfully!');
        // reset();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create session');
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-2xl rounded-xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Create Study Session</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Fill out the form below to schedule a new study session.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Session Title */}
        <div>
          <label className="block mb-1 font-medium">Session Title</label>
          <input
            type="text"
            {...register('sessionTitle', { required: true })}
            placeholder="Enter session title"
            className="input input-bordered w-full"
          />
          {errors.sessionTitle && <span className="text-red-500">Session title is required</span>}
        </div>

        {/* Tutor Name */}
        <div>
          <label className="block mb-1 font-medium">Tutor Name</label>
          <input
            type="text"
            value={user?.displayName || ''}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Tutor Email */}
        <div>
          <label className="block mb-1 font-medium">Tutor Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Session Description</label>
          <textarea
            {...register('description', { required: true })}
            placeholder="Write about the session..."
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
          {errors.description && <span className="text-red-500">Description is required</span>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Registration Start Date</label>
            <input
              type="date"
              {...register('registrationStartDate', { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Registration End Date</label>
            <input
              type="date"
              {...register('registrationEndDate', { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Class Start Date</label>
            <input
              type="date"
              {...register('classStartDate', { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Class End Date</label>
            <input
              type="date"
              {...register('classEndDate', { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Session Duration */}
        <div>
          <label className="block mb-1 font-medium">Session Duration (in weeks)</label>
          <input
            type="number"
            {...register('sessionDuration', { required: true, min: 1 })}
            placeholder="e.g., 4"
            className="input input-bordered w-full"
          />
          {errors.sessionDuration && (
            <span className="text-red-500">Valid duration is required</span>
          )}
        </div>

        {/* Registration Fee - readonly */}
        <div>
          <label className="block mb-1 font-medium">Registration Fee</label>
          <input
            type="number"
            value={0}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Status - default */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <input
            type="text"
            value="pending"
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary px-10 mt-4 flex items-center gap-2"
          >
            <FaChalkboardTeacher /> Create Session
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateStudySession;
