import React, { useState, useEffect} from 'react';
import './StudentDashboardPage.css'; 
import ContactForm from '../components/ContactForm';

const StudentDashboardPage = ( ) => {
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [studentFirstName, setStudentFirstName] = useState('');
        const [studentLastName, setStudentLastName] = useState('');
        const [studentEmail, setStudentEmail] = useState('');
        const [studentId, setStudentId] = useState('');
        const [studentProgram, setStudentProgram] = useState('');
        const [studentTerm, setStudentTerm] = useState('');
        const [showContactForm, setShowContactForm] = useState(false);
        const [chosenCourses, setChosenCourses] = useState([]);
        const [messages, setMessages] = useState([]);
        const [loading, setLoading] = useState(true); // To handle loading state
        const [error, setError] = useState(''); 

        useEffect(() => {
            const fetchStudentData = async () => {
                try {
                    const token = localStorage.getItem('jwtToken');
                    if (!token) {
                        setError('Token not found');
                        return;
                    }
                    console.log('Token being sent:', token);
                    const response = await fetch('http://localhost:5000/api/users/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    
                    console.log('Response:', response);

                    if (!response.ok) {
                        throw new Error('Failed to fetch student data');
                    }
    
                    const data = await response.json();
                    setStudentFirstName(data.firstName);
                    setStudentLastName(data.lastName);
                    setStudentEmail(data.email);
                    setStudentId(data.id);
                    setStudentProgram(data.program);
                    setStudentTerm(data.term);
                    fetchRegisteredCourses(data.id, token);
                } catch (error) {
                    console.error('Error fetching student data:', error);
                    setError('Error fetching data. Please try again later.');
                    setLoading(false);
                }
            };
    
           

        const fetchRegisteredCourses = async (studentId, token) => {
            try {
                const response = await fetch(`http://localhost:5000/api/registrations/${studentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 404) {
                    console.warn('No registered courses found for this student.');
                    setChosenCourses([]);
                    return;
                }
        
    
                if (!response.ok) {
                    throw new Error('Failed to fetch registered courses');
                
                }

                const data = await response.json();
                setChosenCourses(data.courses || []); 
    
                // Set the fetched courses
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Error fetching courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);
    
        if (error) {
            return <p>{error}</p>;
        }

        const dropCourse = async (Code) => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError('Token not found');
                return;
            }
    
            try {
                const response = await fetch('http://localhost:5000/api/registrations/drop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ Code }),
                });
                console.log('Dropping Course Code:', Code);

                if (!response.ok) {
                    throw new Error('Failed to drop course');
                }
    
                const data = await response.json();
                setChosenCourses(data.registration.courses || []); // Update the courses list
            } catch (error) {
                console.error('Error dropping course:', error);
                setError('Error dropping course. Please try again later.');
            }
        };
    
        const handleSendMessage = async (message) => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    alert('Please log in first.');
                    return;
                }
        
                const studentName = `${studentFirstName} ${studentLastName}`;
                const studentEmailValue = studentEmail;
                const response = await fetch('http://localhost:5000/api/messages/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      studentName,
                      studentEmailValue,
                      message,
                    }),
                  });

                const data = await response.json();
        
                if (response.ok) {
                    alert(data.success);
                    // Optionally clear messages or handle them in the UI
                } else {
                    alert(data.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('There was an error sending your message. Please try again later.');
            }
        };
        
        

          //const programInfo = JSON.parse(localStorage.getItem('loggedInUser'))

    return (
        <div className='dashboard-container'>
            <div className='st-info'>
               {/* <img 
                    className='st-img' 
                    src='https://media.istockphoto.com/id/1438969575/photo/smiling-young-male-college-student-wearing-headphones-standing-in-a-classroom.jpg?s=612x612&w=0&k=20&c=yNawJP9JGXU6LOL262ME5M1U2xxNKQsvT7F9DZhZCh4=' 
                    alt="Student"
                />
                //upload profile img can be implemented in phase 2
                */}
                <p className='st-fname'>First Name: {studentFirstName}</p>
                <p className='st-lName'>Last Name: {studentLastName}</p>
                <p className='st-eMail'>E-mail: {studentEmail}</p>
                
                <br />
                <button className='btn-contact' onClick={() => setShowContactForm(!showContactForm)}>Contact</button>
                {showContactForm && <ContactForm onSend={handleSendMessage} />}
            </div>

            <div className='program-section'>
            <h2> Program</h2>
                
                    <div>
                        <p>Program: {studentProgram}</p>
                        <p>Department: {"Software Development"}</p>
                        <p>Term: {studentTerm}</p>
                    </div>
                
              
            </div>

            <div className='courses-section'>
                <h2>Your Courses</h2>
                {chosenCourses.length > 0 ? (
                    <ul>
                        {chosenCourses.map(course => (
                            <li key={course.Code}>
                                <h4>{course.Course}({course.Code})</h4>
                                <p>{course.Description}</p>
                                <p>{course.StartDate}</p>
                                <p>{course.EndDate}</p>
                                <button 
                                    className='btn-drop' 
                                    onClick={() => dropCourse(course.Code)}
                                >
                                    Drop
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses chosen.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboardPage;