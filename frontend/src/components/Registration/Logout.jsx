import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      await onLogout();
      navigate('/');
      setLoading(false);
    };
    logout();
  }, [onLogout, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Logged out successfully!</div>;
};

export default Logout;