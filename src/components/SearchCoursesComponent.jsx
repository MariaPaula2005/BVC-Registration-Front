import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import "./SearchCoursesComponent.css";

const SearchCoursesComponent = ({ onAdd, courses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const terms = [...new Set(courses.map((course) => course.Term))];
  const programs = [...new Set(courses.map((course) => course.Program))];

  const filteredCourses = courses.filter(
    (course) =>
      (course.Course || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTerm ? course.Term === selectedTerm : true) &&
      (selectedProgram ? course.Program === selectedProgram : true)
  );

  return (
    <div className="search-courses-container">
      <input
        type="text"
        placeholder="Search by Course Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSelectedTerm(e.target.value)} value={selectedTerm}>
        <option value="">Filter by Term</option>
        {terms.map((term) => (
          <option key={term} value={term}>{term}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedProgram(e.target.value)} value={selectedProgram}>
        <option value="">Filter by Program</option>
        {programs.map((program) => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>

      <div className="course-card-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              showAddButton
              onAdd={onAdd}
            />
          ))
        ) : (
          <p>No courses found</p>
        )}
      </div>
    </div>
  );
};

export default SearchCoursesComponent;
