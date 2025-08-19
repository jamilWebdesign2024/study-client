import { useQuery } from '@tanstack/react-query';
import { FaStar, FaCalendarAlt, FaUserGraduate, FaClock, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../../Components/Loading';

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

    if (parseInt(session.registrationFee) === 0) {
      try {
        const res = await axiosSecure.post('/bookedSessions', bookedSessionData);
        if (res.status === 201) {
          toast.success('Successfully enrolled in the session!');
          navigate('/dashboard/viewBookedSession')
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
    return <Loading></Loading>;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Session Card */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="bg-primary text-primary-content p-8 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center">{session.sessionTitle}</h1>
          </div>

          <div className="card-body">
            {/* Tutor Info & Rating */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/20 p-3 rounded-full mr-4">
                  <FaUserGraduate className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{session.tutorName}</h3>
                  <p className="text-base-content/70 text-sm">{session.tutorEmail}</p>
                </div>
              </div>
              {averageRating !== null && (
                <div className="flex items-center bg-warning/20 px-4 py-2 rounded-full">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${i < Math.floor(averageRating) ? 'text-warning' : 'text-base-content/30'}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">About This Session</h3>
              <p className="text-base-content/80 leading-relaxed">{session.description}</p>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <FaCalendarAlt className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Registration Period</h4>
                    <p className="text-base-content/70 text-sm">
                      {dayjs(session.registrationStartDate).format('MMM D, YYYY')} -{' '}
                      {dayjs(session.registrationEndDate).format('MMM D, YYYY')}
                    </p>
                    <span
                      className={`badge mt-1 ${isRegistrationOpen ? 'badge-success' : 'badge-error'}`}
                    >
                      {isRegistrationOpen ? 'Open for registration' : 'Registration closed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <IoMdTime className="text-primary text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium">Class Schedule</h4>
                    <p className="text-base-content/70 text-sm">
                      {dayjs(session.classStartDate).format('MMM D, YYYY')} -{' '}
                      {dayjs(session.classEndDate).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <FaClock className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Duration</h4>
                    <p className="text-base-content/70 text-sm">{session.sessionDuration} weeks</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-lg mr-4">
                    <FaMoneyBillWave className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Fee</h4>
                    <p className="text-base-content/70 text-sm">
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
              className={`btn btn-lg w-full ${disableBooking ? 'btn-disabled' : 'btn-primary'}`}
            >
              {hasAlreadyBooked ? (
                <>
                  <FaCheckCircle className="mr-2" /> Already Enrolled
                </>
              ) : isRegistrationOpen ? (
                'Enroll Now'
              ) : (
                'Registration Closed'
              )}
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Student Reviews</h2>

            {/* Review form for enrolled student */}
            {user && role === 'student' && (
              <div className="bg-base-200 p-6 rounded-box mb-8">
                <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRating(val)}
                        className={`text-2xl transition-colors ${val <= rating ? 'text-warning' : 'text-base-content/30 hover:text-warning'}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    rows={4}
                    className="textarea textarea-bordered w-full"
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button
                  onClick={handlePostReview}
                  disabled={!comment || !rating}
                  className={`btn ${!comment || !rating ? 'btn-disabled' : 'btn-primary'}`}
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No reviews yet for this session.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-base-300 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{r.studentName}</h4>
                        <p className="text-base-content/70 text-sm">{r.studentEmail}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < r.rating ? 'text-warning' : 'text-base-content/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-base-content/80 mt-2">"{r.comment}"</p>
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