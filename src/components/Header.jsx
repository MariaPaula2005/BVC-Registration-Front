import React from "react";
import { Link, useNavigate ,useLocation } from "react-router-dom";
import './Header.css';
import  {useEffect,useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const Header = ({ logInName, onLogout, isGuest, isAdmin, isLoggedIn}) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    const handleCoursesClick = () => {
            navigate("/courselisting");
        
    };

    const handleLogout = () => {
        if (isLoggedIn) {
            onLogout();
        }
        else{
            navigate("/signup");  
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const isAdminPage = location.pathname.startsWith('/admin');

    //Close dropdown when route changes
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);


    return (
        <div>
            <div className="b-example-divider"></div>
            <header>
                <div className="px-3 py-2 bg-dark text-white">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <Link to="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                                <img className="bow-home-icon" src="https://cdn.prod.website-files.com/6475eb90c59d6bd3bc835d50/648b5df6bca32974dd79ac54_logo%2Bwhite-1.png" alt="Bow-Valley" />
                            </Link>
                            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                                {isGuest && <li>
                                    <Link to="/programlisting" className="nav-link text-white">
                                        Programs
                                    </Link>
                                </li>
                                }
                                { !isGuest &&
                                <li>
                                    <button className="nav-link text-white bg-transparent border-0" onClick={handleCoursesClick}>
                                        Courses
                                    </button>
                                </li>
                                }
                                <li>
                                <Link to="/signup" className="nav-link text-white" onClick={handleLogout}>
                                {isLoggedIn ? "Logout" : "Login"}
                                    </Link>
                                 </li>
                                 { !isAdminPage && !isGuest && !isAdmin &&<li>
                                    <Link to="/studentdashboard" className="nav-link text-white">
                                        Dashboard
                                    </Link>
                                
                                </li>
                                }

                                {/* Admin Account Dropdown */}
                        {isAdminPage && (
                            <li className="nav-item dropdown">
                                <div 
                                    className="profile-icon" 
                                    onClick={toggleDropdown} 
                                    style={{ 
                                        cursor: 'pointer', fontSize: '15px', padding: '10px 10px', backgroundColor: 'none', color: 'white' , marginLeft: '1em'}}>
                                    <span>Admin</span>
                                </div>
                                        
                                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to="/admin">
                                       
                                        Dashboard</Link>
                                    <Link className="dropdown-item" to="/admin/profile">
                              
                                        Profile</Link>
                                    <Link className="dropdown-item" to="/admin/courses">
                                  
                                        Courses</Link>
                                    <Link className="dropdown-item" to="/admin/students">
                                       
                                        Student List</Link>
                                    <Link className="dropdown-item" to="/admin/forms">
                                 
                                        Forms</Link>
                                    
                                </div>
                            </li>
                        )}


                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
