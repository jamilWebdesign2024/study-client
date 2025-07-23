import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Components/Loading";

const StudentProfile = () => {
  const { user } = useAuth(); 
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/student/profile?email=${user.email}`);
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          photo: res.data.photo || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put("/api/student/profile", profile);
      setProfile({
        name: res.data.name,
        email: res.data.email,
        photo: res.data.photo,
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
    <div className="max-w-xl mx-auto p-6 bg-base-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile (Student)</h2>

      <div className="flex flex-col items-center mb-6">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-gray-600">
            No Photo
          </div>
        )}
        <button
          onClick={() => setEditing(!editing)}
          className="btn btn-primary btn-sm"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email (read-only)</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Photo URL</label>
            <input
              name="photo"
              type="text"
              value={profile.photo}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Paste photo URL"
            />
          </div>

          <button type="submit" className="btn btn-success w-full">
            Save Profile
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
