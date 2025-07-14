import { useQuery } from '@tanstack/react-query';
import { FaStar, FaCalendarAlt, FaUserGraduate, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';

const ViewDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  // Get session details
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['study-session', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Check if user already booked
  const { data: userBookings = [], isLoading: bookingLoading } = useQuery({
    queryKey: ['user-booking-check', user?.email, id],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(
        `/bookedSessions/check?studentEmail=${user.email}&sessionId=${id}`
      );
      return res.data;
    },
    enabled: !!user?.email && !!id,
  });

  const hasAlreadyBooked = userBookings.length > 0;

  // Get reviews
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

  const disableBooking =
    !user || role === 'admin' || role === 'tutor' || !isRegistrationOpen || hasAlreadyBooked;

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      return;
    }

    if (hasAlreadyBooked) {
      toast.error('You have already enrolled in this session!');
      return;
    }

    const bookedSessionData = {
      sessionId: session._id,
      studentEmail: user.email,
      tutorEmail: session.tutorEmail,
      sessionTitle: session.sessionTitle,
      tutorName: session.tutorName,
      registrationFee: session.registrationFee,
      classStartDate: session.classStartDate,
      classEndDate: session.classEndDate,
      status: 'booked',
    };

    if (session.registrationFee === 0) {
      try {
        const res = await axiosSecure.post('/bookedSessions', bookedSessionData);
        if (res.status === 201) {
          toast.success('Successfully enrolled in the session!');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to enroll');
      }
    } else {
      navigate('/payment', {
        state: bookedSessionData,
      });
    }
  };

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

  if (sessionLoading || bookingLoading || !session)
    return <div className="text-center py-20 text-lg font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Session Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 h-48 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">{session.sessionTitle}</h1>
          </div>

          <div className="p-8">
            {/* Tutor Info & Rating */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaUserGraduate className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{session.tutorName}</h3>
                  <p className="text-gray-500 text-sm">{session.tutorEmail}</p>
                </div>
              </div>
              {averageRating !== null && (
                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-700">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">About This Session</h3>
              <p className="text-gray-600 leading-relaxed">{session.description}</p>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <FaCalendarAlt className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Registration Period</h4>
                    <p className="text-gray-500 text-sm">
                      {dayjs(session.registrationStartDate).format('MMM D, YYYY')} -{' '}
                      {dayjs(session.registrationEndDate).format('MMM D, YYYY')}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isRegistrationOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isRegistrationOpen ? 'Open for registration' : 'Registration closed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <IoMdTime className="text-indigo-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Class Schedule</h4>
                    <p className="text-gray-500 text-sm">
                      {dayjs(session.classStartDate).format('MMM D, YYYY')} -{' '}
                      {dayjs(session.classEndDate).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <FaClock className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Duration</h4>
                    <p className="text-gray-500 text-sm">{session.sessionDuration} weeks</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <FaMoneyBillWave className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Fee</h4>
                    <p className="text-gray-500 text-sm">
                      {session.registrationFee === 0 ? 'Free' : `${session.registrationFee}৳`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enroll Button */}
            <button
              disabled={disableBooking}
              onClick={handleEnroll}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                disableBooking
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {hasAlreadyBooked ? 'Already Enrolled' : isRegistrationOpen ? 'Enroll Now' : 'Registration Closed'}
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reviews</h2>

            {/* Review form for enrolled student */}
            {user && role === 'student' && hasAlreadyBooked && (
              <div className="bg-indigo-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Experience</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRating(val)}
                        className={`text-2xl transition-colors ${
                          val <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button
                  onClick={handlePostReview}
                  disabled={!comment || !rating}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    !comment || !rating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet for this session.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{r.studentName}</h4>
                        <p className="text-sm text-gray-500">{r.studentEmail}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
