import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  FaTrash, 
  FaEdit, 
  FaLink, 
  FaYoutube, 
  FaFileAlt, 
  FaTable, 
  FaSearch,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../Components/Loading';
import Swal from 'sweetalert2';

const ViewAllMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    resourceLinks: []
  });

  // Fetch all materials for the current tutor
  const { 
    data: materials = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['materials', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  // Delete material mutation
  const deleteMaterial = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/materials/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Material deleted successfully');
      queryClient.invalidateQueries(['materials']);
    },
    onError: (error) => {
      toast.error('Failed to delete material');
      console.error(error);
    }
  });

  // Update material mutation
  const updateMaterial = useMutation({
    mutationFn: async (updatedMaterial) => {
      const res = await axiosSecure.patch(
        `/materials/${updatedMaterial._id}`,
        updatedMaterial
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Material updated successfully');
      queryClient.invalidateQueries(['materials']);
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update material');
      console.error(error);
    }
  });

  // Filter materials based on search term
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon based on link type
  const getLinkIcon = (type) => {
    switch(type) {
      case 'youtube': return <FaYoutube className="text-red-500" />;
      case 'doc': return <FaFileAlt className="text-blue-500" />;
      case 'spreadsheet': return <FaTable className="text-green-500" />;
      case 'drive': return <FaLink className="text-yellow-500" />;
      default: return <FaLink className="text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteMaterial.mutate(id);
      Swal.fire(
        'Deleted!',
        'The material has been deleted.',
        'success'
      );
    }
  });
};

  // Handle update click
  const handleUpdateClick = (material) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      resourceLinks: [...material.resourceLinks]
    });
    setIsModalOpen(true);
  };

  // Handle link type detection
  const getLinkType = (url) => {
    if (!url) return 'other';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('docs.google.com/document')) return 'doc';
    if (url.includes('docs.google.com/spreadsheets')) return 'spreadsheet';
    if (url.includes('drive.google.com')) return 'drive';
    return 'other';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMaterial.mutate({
      _id: selectedMaterial._id,
      title: formData.title,
      resourceLinks: formData.resourceLinks
        .filter(link => link.url.trim())
        .map(link => ({
          url: link.url,
          type: getLinkType(link.url)
        }))
    });
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">
          My Uploaded Materials
        </h2>
        <p className="text-gray-600">
          View, edit or delete your uploaded study materials
        </p>
      </div>

      {/* Search and Stats Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search by title or session ID..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-indigo-800 bg-white px-4 py-2 rounded-lg border-black border-1">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'Material' : 'Materials'} Found
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading materials: {error.message}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Loading/>
      )}

      {/* Empty State */}
      {!isLoading && filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaFileAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-red-700">
            No materials found
          </h3>
          <p className="text-secondary mt-1">
            {searchTerm ? 'Try a different search term' : 'Upload your first material to get started'}
          </p>
        </div>
      )}

      {/* Materials Grid */}
      {!isLoading && filteredMaterials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <motion.div 
              key={material._id}
              className="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              {/* Material Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={material.imageUrl} 
                  alt={material.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Material Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-black truncate">
                    {material.title}
                  </h3>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                    {material.sessionId.slice(-6)}
                  </span>
                </div>

                <p className="text-sm text-black/60 mb-4">
                  Uploaded on {formatDate(material.uploadedAt)}
                </p>

                {/* Resource Links */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">
                    Resources:
                  </h4>
                  <div className="space-y-2">
                    {material.resourceLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getLinkIcon(link.type)}
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-700 hover:underline truncate"
                        >
                          {link.type} link
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                  <button
                    onClick={() => handleUpdateClick(material)}
                    className="flex items-center gap-1 px-3 py-1.5   rounded-lg hover:bg-blue-200 bg-blue-700 text-white transition"
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-700 transition text-white rounded-2xl"
                    disabled={deleteMaterial.isLoading}
                  >
                    {deleteMaterial.isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaTrash size={14} /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Update Material Modal - Integrated at the bottom */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-gray-100 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">
                  Update Material
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-red-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-md focus:ring-indigo-500 focus:border-indigo-500 "
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Resource Links
                  </label>
                  {formData.resourceLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {getLinkIcon(link.type)}
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.resourceLinks];
                          newLinks[index] = {
                            ...newLinks[index],
                            url: e.target.value,
                            type: getLinkType(e.target.value)
                          };
                          setFormData({...formData, resourceLinks: newLinks});
                        }}
                        className="flex-1 px-3 py-2 border border-black  rounded-md bg-white text-blue-400"
                        placeholder="https://..."
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedLinks = formData.resourceLinks.filter((_, i) => i !== index);
                            setFormData({...formData, resourceLinks: updatedLinks});
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData, 
                      resourceLinks: [...formData.resourceLinks, { url: '', type: 'other' }]
                    })}
                    className="mt-2 text-sm text-blue-700 hover:underline"
                  >
                    + Add another link
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-red-700 rounded-md text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                    disabled={updateMaterial.isLoading}
                  >
                    {updateMaterial.isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewAllMaterials;