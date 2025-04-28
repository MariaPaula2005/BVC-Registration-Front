// import React, { useState, useEffect, useRef } from 'react';
import '../pages/AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

const AdminDashboardPage = () => {
    const [adminData, setAdminData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
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


    return (
        <div className="admin-dashboard">
            <div className="admin-content">
                <h1>Hello, {adminData.firstName}!</h1>
                <h2>Welcome to your Admin Dashboard</h2>
                <p>Get ready to manage your courses and students effectively!</p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;