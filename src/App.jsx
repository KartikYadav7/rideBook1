import React from 'react'
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { ResetPasswordModal, ResetPasswordPage } from './Pages/ResetPassword'
import Error from './Pages/Error'
import BookingForm from './Pages/BookingForm'
import ContactForm from './Pages/ContactForm'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
           <Route path="/resetPassword" element={<ResetPasswordModal />} />
            <Route path="/resetPasswordPage" element={<ResetPasswordPage />} />
          <Route path="/bookingForm" element={<BookingForm />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path = "*" element={<Error/>}/>
        </Routes>
      </Router>

    </>
  )
}

export default App
