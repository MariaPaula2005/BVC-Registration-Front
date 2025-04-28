import React from 'react';

const RegistrationPage = ({ courses, programs, onAdd}) => {
    return (
        <div className="registration-container">
            <h2>Registration Page</h2>

            <div className="program-listing">
                <h3>Select a Program</h3>
                {programs.map((program) => (
                    <div key={program.Code}>
                        <h4>{program.Program}</h4>
                        <h4>{program.Department}</h4>
                        <h4>{program.Term}</h4>
                        <h4>{program.Description}</h4>
                        <h4>{program.StartDate}</h4>
                        <h4>{program.EndDate}</h4>
                        <h4>{program.Fees}</h4>
                    </div>
                ))}
            </div>

            <div className="course-listing">
                <h3>Select Courses</h3>
                {courses.map((course) => (
                    <div key={course.Code}>
                        <h4>{course.Course}</h4>
                        <p>{course.Description}</p>
                        <p>{course.StartDate}</p>
                        <p>{course.EndDate}</p>
                        <button onClick={() => onAdd(course)}>Add Course</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegistrationPage;
