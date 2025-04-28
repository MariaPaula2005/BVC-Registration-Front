import React, { useState } from 'react';
import studentImg from '../assets/student.jpg';
import adminImg from '../assets/admin.jpg';
import './SignupPage.css'
import { useNavigate } from 'react-router-dom';

const SignupPage = ({setUserName, setSession, setIsAdmin, setIsLoggedIn, setIsGuest}) => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [user, setUser] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isAdmin, setIsadmin] = useState(false);
    const [program, setProgram] = useState("");
    const [term, setTerm] = useState("");
    

    function student(){
      return(
        <div className='lContainer'>
          <div className='sContainer'>
            <div className="imageContainer">
              <img src={studentImg} alt="student" />
            </div>
            <div className="studentInfo">
              <div className="head">
                <h3>Student Login</h3>
                <p>Hello enter your details to sign In!</p>
              </div>
              <div className="userName">
                <input type="email"  value={email} placeholder='Enter your email' onChange={(e)=>{
                  setEmail(e.target.value);
                }}/>
              </div>
              <div className="password">
                <input type="password" placeholder='Enter your password' value={password} onChange={(e)=>{
                  setPassword(e.target.value)}}/>
              </div>
              <div className="logInBtn">
                <button onClick={studentLoginBtnFunc}>Login</button>
              </div>
              <div className='register'>
                <p>Don't have an account? <button onClick={()=>{setIsRegistering(true)}}> Sign up now</button></p>
              </div>
            </div>
          </div>
        
        </div>
      )
    }

    function admin(){
      return(
        <div className='lContainer'>
          <div className='sContainer'>
            <div className="imageContainer">
              <img src={adminImg} alt="student" />
            </div>
            <div className="studentInfo">
              <div className="head">
                <h3>Admin Login</h3>
                <p>Hello enter your details to sign In!</p>
              </div>
              <div className="userName">
                <input type="email"  value={email} placeholder='Enter your email' onChange={(e)=>{
                  setEmail(e.target.value);
                }}/>
              </div>
              <div className="password">
                <input type="password" placeholder='Enter your password' value={password} onChange={(e)=>{
                  setPassword(e.target.value)}}/>
              </div>
              <div className="logInBtn">
                <button onClick={adminLoginBtnFunc}>Login</button>
              </div>
              <div className='register'>
                <p>Don't have an account? <button onClick={()=>{setIsRegistering(true)}}> Sign up now</button></p>
              </div>
            </div>
          </div>
        
        </div>
      )
    }

    function register(){
      return(
        <div className="rContainer">
          <div className="rsContainer">
            <h3>
              Registration
            </h3>
            <div className="studentFirstName">
              <p>First Name</p>
              <input type="text"  placeholder='first name' onChange={(e)=>{setFirstName(e.target.value)}}/>
            </div>
            <div className="studentLastName">
              <p>Last Name</p>
              <input type="text"  placeholder='last name' onChange={(e)=>{setLastName(e.target.value)}}/>
            </div>
            <div className="studentEmail">
              <p>Email</p>
              <input type="email" placeholder='email' onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <div className="studentPassword">
              <p>Password</p>
              <input type="password" placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className="studentPhone">
              <p>Phone Number</p>
              <input type="number" placeholder='phone' onChange={(e)=>{setPhone(e.target.value)}}/>
            </div>
            <div className="program">
              <input type="text" placeholder='Software Developmnet' readOnly/>
            </div>

            {/* program info */}
            <div className="programType">
              <select 
                name="programType" 
                id="programType" 
                value={program} // Set the selected value
                onChange={(e) => setProgram(e.target.value)} // Update state on change
              >
                <option value="default">Program Type</option>
                <option value="Diploma (2 years)">Diploma (2 years)</option>
                <option value="Post-Diploma (1 year)">Post-Diploma (1 year)</option>
                <option value="Certificate (6 months)">Certificate (6 months)</option>
              </select>
            </div>

    
            <div className="term">
              <select 
                name="term" 
                id="term"
                value={term} // Set the selected value
                onChange={(e) => setTerm(e.target.value)} // Update state on change
              >
                <option value="default">Select Term</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>
            <div className="studentId">
             
              <input type="checkbox" onChange={handleCheckboxChange} checked={isAdmin}/><p>Are you admin?</p>
            </div>
            <div className="logBtn">
              <button onClick={handleRegister}>Register</button>
            </div>
          </div>
        </div>
      )
    }

    const handleCheckboxChange = (event) => {
      setIsadmin(event.target.checked); 
    }

    const handleRegister = async () => {

      const newUser = {
        FirstName: firstName,
        LastName: lastName,
        Email: email.toLowerCase(),
        Password: password,
        Phone: phone,
        isAdmin: isAdmin,
        Program: program,
        Term: term,
      };

      console.log("Registering User:", newUser); 
    
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            const token = data.token; 
      localStorage.setItem('jwtToken', token);
              setSession(true);
              setIsLoggedIn(true);
              setIsGuest(false);
              localStorage.setItem('authToken', data.token);
              console.log("Registration successful. Navigating to:", isAdmin ? '/admin' : '/studentdashboard');
              alert('Registration successful');

              navigate(isAdmin ? '/admin' : '/studentdashboard');

          } else {
              alert(data.message);
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'An error occurred during registration.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
      }
   };


   const adminLoginBtnFunc = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({email, password }),
      });
      
      const data = await response.json();
  
      if (response.ok) { 
        const user = data.user;

        const token = data.token; 
      localStorage.setItem('jwtToken', token);


        setSession('Logout');
        setIsAdmin(true);
        setIsLoggedIn(true);
        setIsGuest(false);
  
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/admin');
      } else {
        alert(data.message); 
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };
  
  const studentLoginBtnFunc = async () => { 
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({email, password }), 
      });
  
      const data = await response.json();
  
      if (response.ok) { 
        
        const token = data.token; 
      localStorage.setItem('jwtToken', token);

      localStorage.setItem('user', JSON.stringify(data.user));

        setSession('Logout');
        setIsAdmin(false);
        setIsLoggedIn(true);
        setIsGuest(false);
  
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/studentdashboard');
      } else {
        alert(data.message); 
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };
  

    function changeUser(){
        setUser((prevUser) => !prevUser);
    }

    return (
      <div>
        {isRegistering ? (
          register()
        ) : (
          <>
            {user ? admin() : student()}
            <div className="userStateBtn">
              <button className='userBtn' onClick={changeUser}>
                {user ? 'Are you the student?' : 'Are you the admin?'}
              </button>
            </div>
          </>
        )}
      </div>
    );

}

export default SignupPage;
