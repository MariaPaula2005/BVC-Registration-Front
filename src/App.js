import './App.css';
import React, {useEffect,useState} from "react";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProfile from './components/AdminProfile';
import AdminStudentList from './components/AdminStudentList';
import AdminCourseManagement from './components/AdminCourseManagement';
import AdminForms from './components/AdminForms';
import RegistrationPage from './pages/RegistrationPage';
import CourseListingPage from './pages/CourseListingPage';
import ProgramListingPage from './pages/ProgramListingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


function App() {

  const [loggedInUser, setLoggedInUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [chosenCourses, setChosenCourses] = useState([]); 
  const [selectedProgram, setSelectedProgram] = useState(null); 
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);


  

  useEffect(() => {
    // Function to fetch logged-in user
    const fetchLoggedInUser = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await axios.get('/api/user/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLoggedInUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user info:', error);
          setIsLoggedIn(false);

        }
      } else {
        setIsLoggedIn(false); 
      }
    };
  
    // Function to fetch courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses'); // Make sure the backend is running
        setCourses(response.data); // Set the courses data
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    // Function to fetch programs
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/programs'); // Same for programs
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
  
    // Fetch the logged-in user, courses, and programs
    fetchLoggedInUser();
    fetchCourses();
    fetchPrograms();
  
  }, []); 

  const refreshCourses = async () => {
    const response = await fetch('http://localhost:5000/api/courses');
    const updatedCourses = await response.json();
    setCourses(updatedCourses);
};


const handleLogout = async () => {
  try {
    localStorage.removeItem('jwtToken');
    setLoggedInUser({});
    setIsAdmin(false);
    setIsGuest(true);
    setIsLoggedIn(false); 

  } catch (error) {
    console.error("Error logging out:", error);
  }
};




const handleCourseDrop = async (course) => {
  try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:5000/api/registrations/drop', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              Code: course.Code 
          }),
      });
      if (response.ok) {
          alert('Course dropped successfully!');
      } else {
          alert('Failed to drop course.');
      }
  } catch (error) {
      console.error('Error dropping course:', error);
  }
};

const handleCourseAdd = async (course) => {
  try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
          console.log('Token not found');
          return;
      }

      console.log('Token being sent:', token);

      // Fetch the logged-in user information
      const userResponse = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      });

      console.log('User Response:', userResponse);

      if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User Data:', userData);

      // Add the selected course
      const courseResponse = await fetch('http://localhost:5000/api/registrations/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              id: userData.id, 
              Code: course.Code, 
          }),
      });

      console.log('Course Response:', courseResponse);

      if (!courseResponse.ok) {
          throw new Error('Failed to add course');
      }

      const addedCourse = await courseResponse.json();
      console.log('Course added successfully:', addedCourse);

      // Update the chosen courses state
      setChosenCourses((prevCourses) => [...prevCourses, addedCourse]);
      alert('Course Added Successfully');
  } catch (error) {
      console.error('Error adding course:', error);
      console.log('Error adding course. Please try again later.');
  }
};


const handleCourseEdit = (id, updatedCourse) => {
  setCourses((prevCourses) =>
    prevCourses.map((course) =>
      course.id === id ? updatedCourse : course
    )
  );
};


const handleCourseDelete = (id) => {
  setCourses((prevCourses) =>
    prevCourses.filter((course) => course.id !== id)
  );
};



  return (
  <div>
      <BrowserRouter>

      <Header setIsLoggedIn={isLoggedIn} selectedProgram={selectedProgram} onLogout={handleLogout} isLoggedIn={isLoggedIn} isGuest={isGuest}/>

      <Routes>
        <Route path='/' element={<Navigate to="/home"/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path="/signup" element={<SignupPage 
                setUserName={setLoggedInUser}
                setSession={setSession}
                setIsAdmin={setIsAdmin}
                setIsLoggedIn={setIsLoggedIn}
                setIsGuest={setIsGuest}
               />}/> 
               
        <Route path='/studentdashboard' element={<StudentDashboardPage 
                            studentFirstName={loggedInUser.firstName} 
                            studentLastName={loggedInUser.lastName} 
                            studentEmail={loggedInUser.email}
                            chosenCourses={chosenCourses} 
                            selectedProgram={selectedProgram}
                            setLoggedInUser={setLoggedInUser} 
                            onAdd={handleCourseAdd}
                            onCourseDrop={handleCourseDrop} />} />
        <Route path='/Registration' element={<RegistrationPage 
                            courses={courses} 
                            programs={programs} 
                            onAdd={handleCourseAdd} 
                            setLoggedInUser={loggedInUser} 
                            />} />
        <Route path='/courselisting' element={<CourseListingPage 
                            courses={courses} 
                            onAdd={handleCourseAdd}
                            selectedProgram={selectedProgram} />} />
                            <Route path='/programlisting' element={
                        <ProgramListingPage 
                            programs={programs} 
                            selectedProgram={selectedProgram} 
                        />} 
                    />
        <Route path='/admin' element={<AdminDashboardPage/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboardPage/>}/>
        <Route path='/admin/profile' element={<AdminProfile/>}/>
        <Route path="/admin/courses" element={<AdminCourseManagement 
        courses={courses} onNewCourse={handleCourseAdd} 
        onCourseEdit={handleCourseEdit} 
        onCourseDelete={handleCourseDelete}
        refreshCourses={refreshCourses}
        />}/>
        <Route path='/admin/students' element={<AdminStudentList/>}/>
        <Route path='/admin/forms' element={<AdminForms/>}/>



      </Routes>

      <Footer />
      
    </BrowserRouter>
  </div>
  );
}

export default App;