import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiBook, 
  FiMail, 
  FiType, 
  FiEdit2, 
  FiTrash2,
  FiSave,
  FiLoader,
  FiPlus
} from 'react-icons/fi';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../Components/Loading';

const CreateNote = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      title: '',
      description: ''
    }
  });

  const showSuccessToast = () => {
    toast.success('Note created successfully!', {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message || 'Failed to create note',
      icon: 'error',
      confirmButtonText: 'Try Again',
      customClass: {
        confirmButton: 'btn btn-error'
      },
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  const onSubmit = async (data) => {
    if (!user) {
      showErrorAlert('Please login to create notes');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post('/notes', {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });

      if (res.data.insertedId) {
        showSuccessToast();
        reset();
      }
    } catch (error) {
      console.error('Error creating note:', error);
      showErrorAlert(error.response?.data?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-300 w-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-content rounded-full mb-4">
            <FiBook className="text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">Create New Note</h1>
          <p className="text-base-content/70 text-lg flex items-center justify-center">
            <FiEdit2 className="mr-2" />
            Organize your thoughts and learning materials
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.002 }}
          className="card bg-accent/3 shadow-xl"
        >
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <FiMail className="mr-2" />
                    Your Email
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="input input-bordered w-full pl-10 bg-accent/1 cursor-not-allowed"
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
              </div>

              {/* Title Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <FiType className="mr-2" />
                    Note Title
                    <span className="text-error ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('title', { 
                      required: 'Title is required',
                      minLength: {
                        value: 3,
                        message: 'Title must be at least 3 characters'
                      }
                    })}
                    className={`input input-bordered bg-accent/1 w-full pl-10 ${
                      errors.title ? 'input-error' : ''
                    }`}
                    placeholder="Enter note title"
                  />
                  <FiType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
                {errors.title && (
                  <label className="label">
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="label-text-alt text-error flex items-center"
                    >
                      <FiType className="mr-1" /> {errors.title.message}
                    </motion.span>
                  </label>
                )}
              </div>

              {/* Description Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <FiEdit2 className="mr-2" />
                    Description
                    <span className="text-error ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    rows={8}
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters'
                      }
                    })}
                    className={`textarea textarea-bordered w-full bg-accent/3 pl-10 resize-none ${
                      errors.description ? 'textarea-error' : ''
                    }`}
                    placeholder="Write your note here..."
                  />
                  <FiEdit2 className="absolute left-3 top-4 text-base-content/50" />
                </div>
                {errors.description && (
                  <label className="label">
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="label-text-alt text-error flex items-center"
                    >
                      <FiEdit2 className="mr-1" /> {errors.description.message}
                    </motion.span>
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="card-actions justify-end pt-6">
                <motion.button
                  type="button"
                  onClick={() => reset()}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline btn-neutral bg-error text-base-content"
                >
                  <FiTrash2 className="mr-2" />
                  Clear Form
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Create Note
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="alert alert-info bg-accent/20 text-base-content">
            <div className="flex items-start">
              <FiBook className="text-xl mr-3 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Tips for effective note-taking:</h3>
                <ul className="text-sm opacity-80 space-y-1">
                  <li>• Use clear, descriptive titles for easy searching</li>
                  <li>• Break down complex topics into manageable sections</li>
                  <li>• Include key concepts, examples, and personal insights</li>
                  <li>• Review and update your notes regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateNote;