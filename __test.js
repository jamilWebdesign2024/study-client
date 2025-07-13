const handleEnroll =(id) => {
    if(session.registrationFee=== 0){
      const bookedSessionData = {
        sessionId:  id,

      }


      axiosSecure.post('/bookesSession/student')
    }

    if(session.registrationFee > 0){
      navigate('/payment')
    }
  }