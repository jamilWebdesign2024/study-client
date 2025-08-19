import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/Loading";

const TutorProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    bio: "",
    expertise: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/tutor/profile?email=${user.email}`);
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          photo: res.data.photo || "",
          bio: res.data.bio || "",
          expertise: res.data.expertise || "",
          experience: res.data.experience || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axiosSecure.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({ ...prev, photo: res.data.imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put("/api/tutor/profile", profile);
      setProfile({
        name: res.data.name,
        email: res.data.email,
        photo: res.data.photo,
        bio: res.data.bio,
        expertise: res.data.expertise,
        experience: res.data.experience,
      });
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <Loading></Loading>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-2 justify-center">Tutor Profile</h2>
          <p className="text-center text-base-content/70 mb-6">Manage your professional information</p>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-base-300 border-4 border-primary/20 flex items-center justify-center">
                  <span className="text-4xl">{profile.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {editing && (
                <label className="absolute bottom-2 right-2 bg-primary text-primary-content p-2 rounded-full cursor-pointer shadow-md">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-primary"
              >
                {editing ? (
                  <>Cancel Edit</>
                ) : (
                  <>Edit Profile</>
                )}
              </button>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline btn-primary"
                >
                  View Mode
                </button>
              )}
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="input input-bordered bg-base-200"
                  />
                  <label className="label">
                    <span className="label-text-alt">Email cannot be changed</span>
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell students about yourself and your teaching approach"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Areas of Expertise</span>
                  </label>
                  <input
                    name="expertise"
                    type="text"
                    value={profile.expertise}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="e.g., Mathematics, Physics, English"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Years of Experience</span>
                  </label>
                  <input
                    name="experience"
                    type="number"
                    value={profile.experience}
                    onChange={handleChange}
                    className="input input-bordered"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-success btn-block"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-base-content/70">Name</h3>
                  <p className="text-xl">{profile.name || "Not provided"}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content/70">Email</h3>
                  <p className="text-xl">{profile.email}</p>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="text-lg font-semibold text-base-content/70">Bio</h3>
                <p className="text-lg mt-2 whitespace-pre-line">{profile.bio || "No bio provided yet."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-base-content/70">Expertise</h3>
                  <p className="text-lg">{profile.expertise || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content/70">Experience</h3>
                  <p className="text-lg">{profile.experience ? `${profile.experience} years` : "Not specified"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;