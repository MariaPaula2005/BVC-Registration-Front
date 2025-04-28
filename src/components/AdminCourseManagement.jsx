import React, { useState } from 'react';
import CourseCard from "../components/CourseCard";
import './AdminCourseManagement.css';

const AdminCourseManagement = ({ courses, refreshCourses }) => {
    const [newCourse, setNewCourse] = useState({
        id: '',
        Program: '',
        Course: '',
        Code: '',
        Term: '',
        Description: '',
        StartDate: '',
        EndDate: '',
        Fees: ''
    });

    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);

    const editHandler = (id) => {
        let course = courses.find(courseItem => courseItem.id === id);
        if (course) {
            setNewCourse(course);
            setEditingCourseId(id);
            setIsAddingCourse(true);
        }
    };

    const deleteHandler = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to delete course');
            alert('Course deleted successfully');
            refreshCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleChange = (e) => {
            setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();

        console.log('Sending course data:', newCourse);

        const courseData = {
            id: newCourse.id,
            Course: newCourse.Course,
            Code: newCourse.Code,
            Program: newCourse.Program,
            Term: newCourse.Term,
            StartDate: newCourse.StartDate,
            EndDate: newCourse.EndDate,
            Description: newCourse.Description,
            Fees: newCourse.Fees,
        };

        console.log("Sending course data:", courseData);

        const endpoint = editingCourseId
            ? `http://localhost:5000/api/courses/edit/${editingCourseId}`
            : 'http://localhost:5000/api/courses/newcourse';
        const method = editingCourseId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });


            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok) {
                alert(editingCourseId ? 'Course updated successfully' : 'Course added successfully');
                resetForm();
                refreshCourses(); 
            } else {
                console.error('Error saving course');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const resetForm = () => {
        setNewCourse({
            id: '',
            Program: '',
            Course: '',
            Code: '',
            Term: '',
            Description: '',
            StartDate: '',
            EndDate: '',
            Fees: ''
        });
        setIsAddingCourse(false);
        setEditingCourseId(null);
    };

    const formatDate = (date) => {
        if (date && !isNaN(new Date(date).getTime())) {  // Check if the date is valid
            const d = new Date(date);
            return d.toISOString().split('T')[0]; // Extracts the date part only
        }
        return '';
    };

    return (
        <div className="course-list-page-container">
            <div className="course-list-header">
                <h1 className='adminCourseH1'>Course Management</h1>
                <button className="btn-newCourse" onClick={() => setIsAddingCourse(true)}>Add Course</button>
            </div>
            {!isAddingCourse ? (
                <div className='course-card-list'>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            {...course}
                            showEditButton={true}
                            showDeleteButton={true}
                            onEdit={() => editHandler(course.id)}
                            onDelete={() => deleteHandler(course.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="course-card">
                    <h2>{editingCourseId ? "Edit Course" : "Add New Course"}</h2>
                    <form id="addCourse" onSubmit={handleSaveCourse}>
                        <label htmlFor="id">Course ID:
                            <input type="text" id="id" name="id" value={newCourse.id} onChange={handleChange} readOnly={editingCourseId !== null} />
                        </label>
                        <label htmlFor="code">Course Code:
    <input 
        type="text" 
        id="Code" 
        name="Code" 
        value={newCourse.Code} 
        onChange={handleChange} 
    />
</label>
                        <label htmlFor="Course">Course:
                            <input type="text" id="Course" name="Course" value={newCourse.Course} onChange={handleChange} />
                        </label>
                        <label htmlFor="Program">Program:
                            <input type="text" id="Program" name="Program" value={newCourse.Program} onChange={handleChange} />
                        </label>
                        <label htmlFor="Term">Term:
                            <input type="text" id="Term" name="Term" value={newCourse.Term} onChange={handleChange} />
                        </label><br />
                        <label htmlFor="Description">Description:
                            <textarea id="Description" name="Description" value={newCourse.Description} onChange={handleChange}></textarea>
                        </label>
                        <label htmlFor="StartDate">Start Date:
                            <input type="date" id="StartDate" name="StartDate" value={formatDate(newCourse.StartDate)} onChange={handleChange} />
                        </label>
                        <label htmlFor="EndDate">End Date:
                            <input type="date" id="EndDate" name="EndDate" value={formatDate(newCourse.EndDate)} onChange={handleChange} />
                        </label>
                        <label htmlFor="Fees">Fees:
                            <input type="string" id="Fees" name="Fees" value={newCourse.Fees} onChange={handleChange} />
                        </label><br />
                        <button className='btn-newCourse' type="submit">{editingCourseId ? "Save Changes" : "Save Course"}</button>
                        <button className='btn-cancel' type="button" onClick={resetForm}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminCourseManagement;
