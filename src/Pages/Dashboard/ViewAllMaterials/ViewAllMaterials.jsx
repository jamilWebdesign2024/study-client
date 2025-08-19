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

  const { data: materials = [], isLoading, error } = useQuery({
    queryKey: ['materials', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?tutorEmail=${user.email}`);
      return res.data;
    },
  });

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

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLinkIcon = (type) => {
    switch (type) {
      case 'youtube': return <FaYoutube className="text-error" />;
      case 'doc': return <FaFileAlt className="text-info" />;
      case 'spreadsheet': return <FaTable className="text-success" />;
      case 'drive': return <FaLink className="text-warning" />;
      default: return <FaLink className="text-neutral" />;
    }
  };

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

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMaterial.mutate(id);
        Swal.fire('Deleted!', 'The material has been deleted.', 'success');
      }
    });
  };

  const handleUpdateClick = (material) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      resourceLinks: [...material.resourceLinks]
    });
    setIsModalOpen(true);
  };

  const getLinkType = (url) => {
    if (!url) return 'other';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('docs.google.com/document')) return 'doc';
    if (url.includes('docs.google.com/spreadsheets')) return 'spreadsheet';
    if (url.includes('drive.google.com')) return 'drive';
    return 'other';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMaterial.mutate({
      _id: selectedMaterial._id,
      title: formData.title,
      resourceLinks: formData.resourceLinks
        .filter(link => link.url.trim())
        .map(link => ({ url: link.url, type: getLinkType(link.url) }))
    });
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">My Uploaded Materials</h2>
        <p className="text-base-content/70">View, edit or delete your uploaded study materials</p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="form-control w-full md:w-96">
          <div className="input-group">
            <span><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by title or session ID..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="badge badge-primary badge-outline">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'Material' : 'Materials'} Found
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>Error loading materials: {error.message}</span>
        </div>
      )}

      {isLoading && <Loading />}

      {!isLoading && filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
            <FaFileAlt className="text-3xl text-base-content/50" />
          </div>
          <h3 className="text-lg font-medium text-error">No materials found</h3>
          <p className="text-base-content/70 mt-1">
            {searchTerm ? 'Try a different search term' : 'Upload your first material to get started'}
          </p>
        </div>
      )}

      {!isLoading && filteredMaterials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material._id}
              className="card bg-base-100 shadow hover:shadow-lg border border-base-300"
              whileHover={{ y: -5 }}
            >
              <figure className="h-48 overflow-hidden">
                <img src={material.imageUrl} alt={material.title} className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-base-content truncate">{material.title}</h3>
                  <div className="badge badge-outline">{material.sessionId.slice(-6)}</div>
                </div>
                <p className="text-sm text-base-content/60 mb-2">Uploaded on {formatDate(material.uploadedAt)}</p>

                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Resources:</h4>
                  <div className="space-y-2">
                    {material.resourceLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getLinkIcon(link.type)}
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="link link-primary truncate text-sm">{link.type} link</a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
                  <button onClick={() => handleUpdateClick(material)} className="btn btn-sm btn-primary gap-1">
                    <FaEdit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(material._id)} className="btn btn-sm btn-error gap-1" disabled={deleteMaterial.isLoading}>
                    {deleteMaterial.isLoading ? <FaSpinner className="animate-spin" /> : <><FaTrash size={14} /> Delete</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-base-300 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-base-100 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Material</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm"><FaTimes size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Resource Links</span>
                </label>
                {formData.resourceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    {getLinkIcon(link.type)}
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.resourceLinks];
                        newLinks[index] = { ...newLinks[index], url: e.target.value, type: getLinkType(e.target.value) };
                        setFormData({ ...formData, resourceLinks: newLinks });
                      }}
                      className="input input-bordered flex-1"
                      placeholder="https://..."
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLinks = formData.resourceLinks.filter((_, i) => i !== index);
                          setFormData({ ...formData, resourceLinks: updatedLinks });
                        }}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, resourceLinks: [...formData.resourceLinks, { url: '', type: 'other' }] })}
                  className="btn btn-link btn-sm"
                >
                  + Add another link
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-error">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updateMaterial.isLoading}>
                  {updateMaterial.isLoading && <FaSpinner className="animate-spin mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewAllMaterials;
