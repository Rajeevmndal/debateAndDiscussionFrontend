import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateDebate from './pages/CreateDebate';
// import ChatBox from './pages/ChatBox'; // Adjust the path if it's located elsewhere
import InviteParticipants from './pages/InviteParticipants';
import DebateRoom from './pages/DebateRoom';
import JoinDebateRoom from './pages/JoinDebateRoom';
import DebatePage from './pages/PublicDebate/DebateDashboard';
import DebateDiscussion from './pages/PublicDebate/DebateDiscussion';
import ProfileWrapper from './components/ProfileWrapper'; // adjust path as needed
import { AppContext } from './components/context/AppContext';





const App = () => {
  const { isLoggedIn } = useContext(AppContext);
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> :<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />  
        <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/create-debate" element={isLoggedIn ? <CreateDebate /> : <Navigate to="/login" replace />} />
        <Route path="/invite/:debateId" element={isLoggedIn ? <InviteParticipants /> : <Navigate to="/login" replace />} />
        <Route path="/room/:debateId" element={isLoggedIn ? <DebateRoom /> : <Navigate to="/login" replace />} />
        <Route path="/join" element={isLoggedIn ? <JoinDebateRoom /> : <Navigate to="/login" replace />} />
        <Route path="/debatePage" element={isLoggedIn ? <DebatePage /> : <Navigate to="/login" replace />} />
        <Route path="/public-debate/:debateId/discussion" element={isLoggedIn ? <DebateDiscussion /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileWrapper /> : <Navigate to="/login" replace />} />
       
      </Routes>
    </div>
  );
};

export default App;
