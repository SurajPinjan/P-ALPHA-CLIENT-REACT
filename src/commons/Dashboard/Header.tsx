import '../../App.css'
import { useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();

    const logout = () => {
        navigate('/');
    };

    return (
        <>     
        <h3>Six-Sigma</h3>
        <button onClick={logout}>Logout</button>
        </>
    );
}

export default Header