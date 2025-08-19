import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../Components/Loading';

const CreateStudySession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const sessionData = {
      ...data,
      tutorName: user?.displayName,
      tutorEmail: user?.email,
      registrationFee: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post('/sessions', sessionData);
      if (res.data.insertedId) {
        toast.success('Study session created successfully!');
        reset();
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
            placeholder="Enter session title"
            className="input input-bordered w-full"
          />
          {errors.sessionTitle && (
            <span className="text-error">Session title is required</span>
          )}
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
          <label className="block mb-1 font-medium">Session Description</label>
          <textarea
            {...register('description', { required: true })}
            placeholder="Write about the session..."
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
          {errors.description && (
            <span className="text-error">Description is required</span>
          )}
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
            <span className="text-error">Valid duration is required</span>
          )}
        </div>

        {/* Registration Fee */}
        <div>
          <label className="block mb-1 font-medium">Registration Fee</label>
          <input
            type="number"
            value={0}
            readOnly
            className="input input-bordered w-full input-disabled"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <input
            type="text"
            value="pending"
            readOnly
            className="input input-bordered w-full input-disabled"
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
