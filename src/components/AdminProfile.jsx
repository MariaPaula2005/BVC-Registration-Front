import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';



const AdminProfile = () => {

    const navigate = useNavigate();

    const [adminData, setAdminData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load admin.json file
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    setError('Token not found');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
                }

                const data = await response.json();
                setAdminData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Error fetching data. Please try again later.');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

        
    // Save changes
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError('Token not found');
                return;
            }
            const { firstName, lastName, email, phone, password } = adminData;
/*
            if (!FirstName || !LastName || !Email || !Phone || !Password) {
                setError('All fields are required.');
                console.log('adminData is missing fields:', adminData); // Log the data for debugging
                return;
            }

            /*/
            const bodyData = { firstName, lastName, email, phone, password };

            const response = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error('Failed to update admin data');
            }

            const updatedData = await response.json();
            setAdminData(updatedData);
            setIsEditing(false);
            navigate('/admin/profile');
        } catch (err) {
            console.error('Error saving admin data:', err);
            setError('Error saving data. Please try again later.');
        }
    };

    

    return (
        <div className="admin-profile-container">
            <h1>Profile</h1>
            <div className="admin-profile-info">
                <div className="profile-item">
                    <label><b>First Name:</b>
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstName"
                                value={adminData.firstName}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{` ${adminData.firstName}`}</span>
                        )}
                    </label>
                </div>
                <div className="profile-item">
                    <label><b>Last Name:</b>
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastName"
                                value={adminData.lastName}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{` ${adminData.lastName}`}</span>
                        )}
                    </label>
                </div>
                <div className="profile-item">
                    <label><b>Email:</b>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={adminData.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{` ${adminData.email}`}</span>
                        )}
                    </label>
                </div>

                <div className="profile-item">
                    <label><b>Phone:</b>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={adminData.phone}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{` ${adminData.phone}`}</span>
                        )}
                    </label>
                </div>

                <div className="profile-item">
                    <label><b>Password:</b>
                        {isEditing ? (
                            <input
                                type="password"
                                name="password"
                                value={adminData.password}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{` ***********`}</span> // Masked password
                        )}
                    </label>
                </div>
            </div>
            <div className="admin-profile-actions">
                {isEditing ? (
                    <>
                        <button className='edit-btn' onClick={handleSave}>Save</button>
                        <button className='edit-btn' onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <button className='edit-btn' onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;
