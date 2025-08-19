import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Shield,
  Calendar,
  MapPin
} from "lucide-react";
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
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
    joinedDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

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
          phone: res.data.phone || "",
          address: res.data.address || "",
          dateOfBirth: res.data.dateOfBirth || "",
          bio: res.data.bio || "",
          joinedDate: res.data.joinedDate || "",
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
      setUpdating(true);
      const res = await axiosSecure.put("/api/student/profile", profile);
      setProfile(res.data);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const ProfileHeader = () => (
    <div className="card bg-accent/5 border border-primary">
      <div className="card-body text-center">
        <div className="avatar mb-4">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary flex items-center justify-center text-primary-content rounded-full w-full h-full">
                <User className="w-16 h-16" />
              </div>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-base-content mb-2">
          {profile.name || "Student Name"}
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-base-content/70 mb-4">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{profile.email}</span>
        </div>

        {profile.joinedDate && (
          <div className="flex items-center justify-center gap-2 text-base-content/60">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Joined {new Date(profile.joinedDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="card-actions justify-center mt-6">
          <button
            onClick={() => setEditing(!editing)}
            className={`btn gap-2 ${editing ? 'btn-error btn-outline' : 'btn-primary'}`}
            disabled={updating}
          >
            {editing ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ProfileInfo = () => (
    <div className="card bg-base-100 shadow-lg border border-base-200">
      <div className="card-body">
        <h2 className="card-title text-xl mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <User className="w-4 h-4" />
                <span>{profile.name || "Not provided"}</span>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
                <Shield className="w-4 h-4 text-accent" />
              </label>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <span>{profile.phone || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Date of Birth</span>
              </label>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                </span>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Address</span>
              </label>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span>{profile.address || "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-6">
            <label className="label">
              <span className="label-text font-semibold">Bio</span>
            </label>
            <div className="p-4 bg-base-200 rounded-lg">
              <p>{profile.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const EditForm = () => (
    <div className="card bg-base-100 shadow-lg border border-base-200">
      <div className="card-body">
        <h2 className="card-title text-xl mb-6 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-primary" />
          Edit Profile Information
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name *</span>
              </label>
              <input
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                className="input input-bordered input-primary"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
                <div className="badge badge-accent badge-xs">Protected</div>
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="input input-bordered bg-base-200 cursor-not-allowed"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                className="input input-bordered input-primary"
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date of Birth</span>
              </label>
              <input
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="input input-bordered input-primary"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Address</span>
            </label>
            <input
              name="address"
              type="text"
              value={profile.address}
              onChange={handleChange}
              className="input input-bordered input-primary"
              placeholder="Enter your address"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Profile Photo URL</span>
            </label>
            <div className="flex gap-2">
              <input
                name="photo"
                type="url"
                value={profile.photo}
                onChange={handleChange}
                className="input input-bordered input-primary flex-1"
                placeholder="Paste photo URL here"
              />
              <div className="tooltip" data-tip="Upload photo">
                <button type="button" className="btn btn-outline btn-square">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
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
              className="textarea textarea-bordered textarea-primary h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="card-actions justify-end pt-4">
            <button 
              onClick={handleSubmit}
              className="btn btn-primary gap-2"
              disabled={updating}
            >
              {updating ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <ProfileHeader />
          {editing ? <EditForm /> : <ProfileInfo />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
