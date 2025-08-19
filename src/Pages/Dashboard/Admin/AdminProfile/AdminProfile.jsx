import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../Components/Loading";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaUserCog,
  FaCog,
  FaCheck
} from "react-icons/fa";

const AdminProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/admin/profile?email=${user.email}`);
        const profileData = {
          name: res.data.name || user.displayName || "",
          email: res.data.email || user.email || "",
          photo: res.data.photo || user.photoURL || "",
        };
        setProfile(profileData);
        setImagePreview(profileData.photo);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (name === 'photo') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosSecure.put("/api/admin/profile", profile);
      setProfile({
        name: res.data.name,
        email: res.data.email,
        photo: res.data.photo,
      });
      setImagePreview(res.data.photo);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setImagePreview(profile.photo);
    // Reset form to original values
    setProfile((prev) => ({ ...prev }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShieldAlt className="text-3xl text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              Admin Profile
            </h1>
          </div>
          <p className="text-base-content opacity-70">
            Manage your administrative account settings and information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                {/* Profile Picture Section */}
                <div className="relative group">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-4 ring-offset-base-100 overflow-hidden">
                      <img
                        src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Admin')}&background=random&size=128`}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Admin')}&background=random&size=128`;
                        }}
                      />
                    </div>
                  </div>
                  {editing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                  )}
                </div>

                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-base-content">
                    {profile.name || "Admin User"}
                  </h3>
                  <p className="text-base-content opacity-70">{profile.email}</p>

                  <div className="badge badge-primary badge-lg mt-2 gap-2">
                    <FaUserCog className="text-sm" />
                    Administrator
                  </div>
                </div>

                {/* Stats */}
                <div className="stats stats-vertical lg:stats-horizontal bg-base-200 shadow-inner mt-6 w-full">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <FaCheck className="text-lg" />
                    </div>
                    <div className="stat-title">Status</div>
                    <div className="stat-value text-sm text-success">Active</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FaCog className="text-lg" />
                    </div>
                    <div className="stat-title">Role</div>
                    <div className="stat-value text-sm">Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-header bg-gradient-to-r from-primary to-secondary text-primary-content p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-2xl" />
                    <h2 className="text-2xl font-bold">
                      {editing ? "Edit Profile" : "Profile Information"}
                    </h2>
                  </div>

                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-outline btn-sm text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="btn btn-ghost btn-sm text-primary-content"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-body p-6">
                {editing ? (
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <FaUser className="text-primary" />
                          Full Name
                        </span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={profile.name}
                        onChange={handleChange}
                        className="input input-bordered input-lg focus:input-primary"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <FaEnvelope className="text-primary" />
                          Email Address
                        </span>
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="input input-bordered input-lg bg-base-200 cursor-not-allowed"
                      />
                      <label className="label">
                        <span className="label-text-alt opacity-70">
                          Email cannot be changed for security reasons
                        </span>
                      </label>
                    </div>

                    {/* Photo URL Field */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <FaCamera className="text-primary" />
                          Profile Photo URL
                        </span>
                      </label>
                      <input
                        name="photo"
                        type="url"
                        value={profile.photo}
                        onChange={handleChange}
                        className="input input-bordered input-lg focus:input-primary"
                        placeholder="https://example.com/your-photo.jpg"
                      />
                      <label className="label">
                        <span className="label-text-alt opacity-70">
                          Enter a valid image URL for your profile picture
                        </span>
                      </label>
                    </div>

                    {/* Save Button */}
                    <div className="card-actions justify-end pt-4">
                      <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="btn btn-primary btn-lg w-full md:w-auto gap-2"
                      >
                        {saving ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <FaSave />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Display Information */}
                    <div className="grid gap-4">
                      <div className="p-4 bg-base-200 rounded-xl border-l-4 border-primary">
                        <div className="flex items-center gap-3">
                          <FaUser className="text-primary text-lg" />
                          <div className="flex-1">
                            <div className="text-sm opacity-70 mb-1">Full Name</div>
                            <div className="text-lg font-semibold">
                              {profile.name || "Not provided"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-base-200 rounded-xl border-l-4 border-secondary">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-secondary text-lg" />
                          <div className="flex-1">
                            <div className="text-sm opacity-70 mb-1">Email Address</div>
                            <div className="text-lg font-semibold break-all">
                              {profile.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-base-200 rounded-xl border-l-4 border-accent">
                        <div className="flex items-center gap-3">
                          <FaShieldAlt className="text-accent text-lg" />
                          <div className="flex-1">
                            <div className="text-sm opacity-70 mb-1">Account Type</div>
                            <div className="text-lg font-semibold">Administrator</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;