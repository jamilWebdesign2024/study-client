import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaLink, FaImage, FaSpinner, FaYoutube, FaFileAlt, FaTable } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../Components/Loading';

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

  const { data: sessions = [], isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['approved-sessions', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
      return res.data.filter(session => session.status === 'approved');
    },
  });

  if (sessionsLoading) return <Loading />;

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
    if (!selectedSession) errors.session = 'Please select a session';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.imageFile) errors.image = 'Image is required';
    formData.resourceLinks.forEach((link, i) => {
      if (!link.url.trim()) errors[`resourceLink${i}`] = 'Link is required';
      else if (!/^https?:\/\/.+/i.test(link.url)) errors[`resourceLink${i}`] = 'Must be a valid URL';
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) throw new Error('No image file selected');
    if (imageFile.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB');
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(imageFile.type)) throw new Error('Only JPG, PNG or GIF images are allowed');

    const form = new FormData();
    form.append("image", imageFile);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    const res = await axiosSecure.post(imageUploadUrl, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (!res.data?.data?.url) throw new Error('Image upload failed');
    return res.data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          .map(link => ({ url: link.url, type: getLinkType(link.url) })),
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post('/materials', materialData);
      if (!res.data.insertedId) throw new Error('Database save failed');

      toast.dismiss();
      toast.success('Material uploaded successfully!');
      setFormData({ title: '', imageFile: null, resourceLinks: [{ url: '', type: 'other' }] });
      setSelectedSession(null);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getLinkIcon = (type) => {
    switch (type) {
      case 'youtube': return <FaYoutube className="text-error" />;
      case 'doc': return <FaFileAlt className="text-info" />;
      case 'spreadsheet': return <FaTable className="text-success" />;
      case 'drive': return <FaLink className="text-warning" />;
      default: return <FaLink className="text-neutral" />;
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
        <h2 className="text-3xl font-extrabold flex justify-center items-center gap-2 text-primary">
          <FaCloudUploadAlt /> Upload Study Materials
        </h2>
        <p className="text-base-content">
          Upload images and multiple resource links (YouTube, Google Docs, Drive, etc.)
        </p>
      </div>

      {sessionsError && (
        <div className="alert alert-error mb-6">
          <span>Error loading sessions: {sessionsError.message}</span>
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-base-content">
          Select Approved Session
        </label>
        <select
          onChange={(e) => setSelectedSession(sessions.find(s => s._id === e.target.value))}
          className={`select select-bordered w-full ${validationErrors.session ? 'select-error' : ''}`}
          value={selectedSession?._id || ''}
        >
          <option value="">-- Select a Session --</option>
          {sessions.map(session => (
            <option key={session._id} value={session._id}>{session.sessionTitle}</option>
          ))}
        </select>
        {validationErrors.session && <p className="text-error mt-1">{validationErrors.session}</p>}
      </div>

      {selectedSession && (
        <form onSubmit={handleSubmit} className="card bg-base-100 p-6 rounded-xl shadow-md space-y-5">
          <div>
            <label className="label font-semibold text-base-content">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter material title"
              className={`input input-bordered w-full ${validationErrors.title ? 'input-error' : ''}`}
            />
            {validationErrors.title && <p className="text-error mt-1">{validationErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label font-semibold text-base-content">Session ID</label>
              <input type="text" value={selectedSession._id} readOnly className="input input-bordered w-full input-disabled" />
            </div>
            <div>
              <label className="label font-semibold text-base-content">Tutor Email</label>
              <input type="email" value={user.email} readOnly className="input input-bordered w-full input-disabled" />
            </div>
          </div>

          <div>
            <label className="label font-semibold text-base-content flex items-center gap-2">
              <FaImage /> Upload Image (Max 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
              className={`file-input file-input-bordered w-full ${validationErrors.image ? 'file-input-error' : ''}`}
            />
            {validationErrors.image && <p className="text-error mt-1">{validationErrors.image}</p>}
            {formData.imageFile && <p className="text-base-content mt-1">Selected: {formData.imageFile.name} ({(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>

          <div>
            <label className="label font-semibold text-base-content flex items-center gap-2">
              <FaLink /> Resource Links
            </label>
            {formData.resourceLinks.map((link, index) => (
              <div key={index} className="mt-2 flex gap-2 items-center">
                {getLinkIcon(getLinkType(link.url))}
                <input
                  type="url"
                  placeholder={`https://... (Link ${index + 1})`}
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...formData.resourceLinks];
                    newLinks[index].url = e.target.value;
                    newLinks[index].type = getLinkType(e.target.value);
                    setFormData({ ...formData, resourceLinks: newLinks });
                  }}
                  className={`input input-bordered flex-grow ${validationErrors[`resourceLink${index}`] ? 'input-error' : ''}`}
                />
                {index > 0 && (
                  <button type="button" onClick={() => setFormData({ ...formData, resourceLinks: formData.resourceLinks.filter((_, i) => i !== index) })} className="btn btn-error btn-sm">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, resourceLinks: [...formData.resourceLinks, { url: '', type: 'other' }] })} className="btn btn-link btn-sm mt-2">+ Add another link</button>
          </div>

          <button type="submit" disabled={uploading} className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
            {uploading ? <><FaSpinner className="animate-spin" /> Uploading...</> : <><FaCloudUploadAlt /> Upload Material</>}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default UploadMaterials;
