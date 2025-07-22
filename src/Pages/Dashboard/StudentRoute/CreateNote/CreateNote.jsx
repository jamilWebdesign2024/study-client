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
  FiLoader
} from 'react-icons/fi';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../Components/Loading';
// ✅ Import your Loading component

const CreateNote = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false); // ✅ local loading

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
      theme: "colored",
      style: {
        background: '#4BB543',
      }
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message || 'Failed to create note',
      icon: 'error',
      confirmButtonColor: '#4F46E5',
      background: '#fff',
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

  // ✅ Show loading screen during submission
  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-indigo-600 px-6 py-4 flex items-center">
            <FiBook className="text-white text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-white">Create New Note</h2>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-gray-600 mb-6 flex items-center">
              <FiEdit2 className="mr-2" />
              Organize your thoughts and learning materials
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* email input */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMail className="mr-2" />
                  Your Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* title input */}
              <div className="relative">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiType className="mr-2" />
                  Note Title <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="title"
                    type="text"
                    {...register('title', { 
                      required: 'Title is required',
                      minLength: {
                        value: 3,
                        message: 'Title must be at least 3 characters'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter note title"
                  />
                  <FiType className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.title && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <FiType className="mr-1" /> {errors.title.message}
                  </motion.p>
                )}
              </div>

              {/* description input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiEdit2 className="mr-2" />
                  Description <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    rows={8}
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Write your note here..."
                  />
                  <FiEdit2 className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <FiEdit2 className="mr-1" /> {errors.description.message}
                  </motion.p>
                )}
              </div>

              {/* action buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => reset()}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 className="mr-2" />
                  Clear
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className={`flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                    loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors`}
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
      </div>
    </motion.div>
  );
};

export default CreateNote;
