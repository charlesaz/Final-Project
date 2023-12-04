import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Clear user-related data from local storage on logout
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        // Redirect to login page after logout
        navigate('/login');
    };

    return logout;
};

export default useLogout;