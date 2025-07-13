import { useQuery } from '@tanstack/react-query';
import { FaStar, FaCalendarAlt, FaUserGraduate, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const ViewDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, role } = useAuth();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  // Get study session details
  const { data: session, isLoading } = useQuery({
    queryKey: ['study-session', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions/${id}`);
      console.log("Session ID:", id);

      return res.data;
    },
    enabled: !!id,
  });

  // Get reviews for this session
  const { data: reviews = [], refetch } = useQuery({
    queryKey: ['session-reviews', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const isRegistrationOpen =
    session &&
    dayjs().isAfter(dayjs(session.registrationStartDate)) &&
    dayjs().isBefore(dayjs(session.registrationEndDate));

  const disableBooking = !user || role === 'admin' || role === 'tutor' || !isRegistrationOpen;

  // Calculate average rating as number or null if no reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  const handlePostReview = async () => {
    if (!comment || !rating) return toast.error('Please fill all fields');
    try {
      await axiosSecure.post('/reviews', {
        sessionId: id,
        studentEmail: user.email,
        studentName: user.displayName,
        rating,
        comment,
      });
      toast.success('Review submitted!');
      setComment('');
      setRating(0);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    }
  };

  if (isLoading || !session) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-indigo-600">{session.sessionTitle}</h2>
        <p className="text-gray-500 text-lg mt-2">by {session.tutorName}</p>
        <div className="flex justify-center items-center gap-2 text-yellow-500 mt-2">
          {averageRating !== null &&
            [...Array(Math.floor(averageRating))].map((_, i) => (
              <FaStar key={i} />
            ))}
          <span className="text-gray-600 text-sm">
            ({averageRating !== null ? averageRating.toFixed(1) : 'No ratings yet'})
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-300 text-sm mb-10">
        <div className="space-y-3">
          <p><FaUserGraduate className="inline mr-2 text-indigo-500" /> Tutor Email: {session.tutorEmail}</p>
          <p><FaCalendarAlt className="inline mr-2 text-indigo-500" /> Registration: {session.registrationStartDate} to {session.registrationEndDate}</p>
          <p><FaCalendarAlt className="inline mr-2 text-indigo-500" /> Classes: {session.classStartDate} to {session.classEndDate}</p>
        </div>
        <div className="space-y-3">
          <p><FaClock className="inline mr-2 text-indigo-500" /> Duration: {session.sessionDuration} weeks</p>
          <p><FaMoneyBillWave className="inline mr-2 text-indigo-500" /> Fee: {session.registrationFee === 0 ? 'Free' : `${session.registrationFee}৳`}</p>
          <p className="text-justify text-base text-gray-600 dark:text-gray-300 mt-4">{session.description}</p>
        </div>
      </div>

      {/* Book Button */}
      <div className="mb-10">
        <button
          disabled={disableBooking}
          className={`btn w-full ${disableBooking ? 'btn-disabled bg-gray-300' : 'btn-primary'}`}
        >
          {isRegistrationOpen ? 'Book Now' : 'Registration Closed'}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Student Reviews</h3>

        {/* Review form */}
        {user && role === 'student' && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-sm">Your Rating:</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRating(val)}
                  className={`text-xl ${val <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button
              onClick={handlePostReview}
              className="btn btn-outline btn-primary"
              disabled={!comment || !rating}
            >
              Submit Review
            </button>
          </div>
        )}

        {/* Display reviews */}
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet for this session.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-slate-700 border p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-indigo-600">{r.studentName}</p>
                    <p className="text-xs text-gray-400">{r.studentEmail}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">“{r.comment}”</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;

