import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaLink, FaImage, FaSpinner, FaYoutube, FaFileAlt, FaTable } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const UploadMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    imageFile: null, 
    resourceLinks: [{ url: '', type: 'other' }] 
  });
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { 
    data: sessions = [], 
    isLoading: sessionsLoading, 
    error: sessionsError 
  } = useQuery({
    queryKey: ['approved-sessions', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
        return res.data.filter(session => session.status === 'approved');
      } catch (error) {
        toast.error('Failed to load sessions');
        throw error;
      }
    },
  });

  const getLinkType = (url) => {
    if (!url) return 'other';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('docs.google.com/document')) return 'doc';
    if (url.includes('docs.google.com/spreadsheets')) return 'spreadsheet';
    if (url.includes('drive.google.com')) return 'drive';
    return 'other';
  };

  const validateForm = () => {
    const errors = {};
    
    if (!selectedSession) {
      errors.session = 'Please select a session';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.imageFile) {
      errors.image = 'Image is required';
    }
    
    formData.resourceLinks.forEach((link, index) => {
      if (!link.url.trim()) {
        errors[`resourceLink${index}`] = 'Link is required';
      } else if (!/^https?:\/\/.+/i.test(link.url)) {
        errors[`resourceLink${index}`] = 'Must be a valid URL';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) {
      throw new Error('No image file selected');
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(imageFile.type)) {
      throw new Error('Only JPG, PNG or GIF images are allowed');
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    try {
      const res = await axiosSecure.post(imageUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (!res.data?.data?.url) {
        throw new Error('Image upload failed - no URL returned');
      }
      
      return res.data.data.url;
    } catch (error) {
      console.error("Image upload failed", error);
      let errorMessage = "Image upload failed!";
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);
      toast.info('Uploading materials...', { autoClose: false });

      const imageUrl = await handleImageUpload(formData.imageFile);

      const materialData = {
        title: formData.title,
        sessionId: selectedSession._id,
        tutorEmail: user.email,
        imageUrl,
        resourceLinks: formData.resourceLinks
          .filter(link => link.url.trim())
          .map(link => ({
            url: link.url,
            type: getLinkType(link.url)
          })),
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post('/materials', materialData);
      
      if (!res.data.insertedId) {
        throw new Error('Database save failed - no ID returned');
      }

      toast.dismiss();
      toast.success('Material uploaded successfully!');
      setFormData({ title: '', imageFile: null, resourceLinks: [{ url: '', type: 'other' }] });
      setSelectedSession(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.dismiss();
      
      let errorMessage = 'Upload failed. Please try again.';
      if (err.message.includes('Image size must be')) {
        errorMessage = err.message;
      } else if (err.message.includes('Only JPG, PNG or GIF')) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const getLinkIcon = (type) => {
    switch(type) {
      case 'youtube': return <FaYoutube className="text-red-500" />;
      case 'doc': return <FaFileAlt className="text-blue-500" />;
      case 'spreadsheet': return <FaTable className="text-green-500" />;
      case 'drive': return <FaLink className="text-yellow-500" />;
      default: return <FaLink className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold flex justify-center items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <FaCloudUploadAlt /> Upload Study Materials
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload images and multiple resource links (YouTube, Google Docs, Drive, etc.)
        </p>
      </div>

      {sessionsError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading sessions: {sessionsError.message}
          </p>
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
          Select Approved Session
        </label>
        <select
          onChange={(e) => {
            const session = sessions.find(s => s._id === e.target.value);
            setSelectedSession(session);
            setValidationErrors(prev => ({ ...prev, session: undefined }));
          }}
          className={`w-full border ${
            validationErrors.session ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
          } p-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-400`}
          value={selectedSession?._id || ''}
        >
          <option value="">-- Select a Session --</option>
          {sessionsLoading ? (
            <option disabled>Loading sessions...</option>
          ) : (
            sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.sessionTitle}
              </option>
            ))
          )}
        </select>
        {validationErrors.session && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationErrors.session}
          </p>
        )}
      </div>

      {selectedSession && (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setValidationErrors(prev => ({ ...prev, title: undefined }));
              }}
              className={`mt-1 block w-full p-2 border ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
              } rounded-md focus:ring focus:ring-indigo-300`}
              placeholder="Enter material title"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Session ID
              </label>
              <input
                type="text"
                value={selectedSession._id}
                readOnly
                className="mt-1 block w-full p-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-700 rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Tutor Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="mt-1 block w-full p-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-700 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FaImage /> Upload Image (Max 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => {
                setFormData({ ...formData, imageFile: e.target.files[0] });
                setValidationErrors(prev => ({ ...prev, image: undefined }));
              }}
              className={`mt-1 block w-full border ${
                validationErrors.image ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
              } p-2 rounded-md`}
            />
            {validationErrors.image && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.image}
              </p>
            )}
            {formData.imageFile && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Selected: {formData.imageFile.name} (
                {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FaLink /> Resource Links (YouTube, Docs, Drive, etc.)
            </label>
            {formData.resourceLinks.map((link, index) => (
              <div key={index} className="mt-2">
                <div className="flex gap-2 items-center">
                  {getLinkIcon(getLinkType(link.url))}
                  <input
                    type="url"
                    placeholder={`https://... (Link ${index + 1})`}
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...formData.resourceLinks];
                      newLinks[index] = {
                        ...newLinks[index],
                        url: e.target.value,
                        type: getLinkType(e.target.value)
                      };
                      setFormData({ ...formData, resourceLinks: newLinks });
                      setValidationErrors(prev => ({ ...prev, [`resourceLink${index}`]: undefined }));
                    }}
                    className={`flex-grow p-2 border ${
                      validationErrors[`resourceLink${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                    } rounded-md`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedLinks = formData.resourceLinks.filter((_, i) => i !== index);
                        setFormData({ ...formData, resourceLinks: updatedLinks });
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded transition"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {validationErrors[`resourceLink${index}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors[`resourceLink${index}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({ 
                  ...formData, 
                  resourceLinks: [...formData.resourceLinks, { url: '', type: 'other' }] 
                })
              }
              className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              + Add another resource link
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Upload Material
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default UploadMaterials;