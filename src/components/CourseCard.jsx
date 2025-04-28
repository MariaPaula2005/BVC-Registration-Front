const CourseCard = ({course, onAdd, onEdit, onDelete, showEditButton, showDeleteButton, loggedInUser}) => {

  const formatDate = (dateString) => {
      return new Date(dateString).toISOString().split('T')[0];
    };
  
  return (
      <div className="course-card">
      <h2>{course.Course}</h2>
    <p>id: {course.id}</p>
    <p>Code {course.Code}</p>
    <p>Program: {course.Program}</p>
    <p>Term: {course.Term}</p>
    <p>Description: {course.Description}</p>
    <p>Start Date: {formatDate(course.StartDate)}</p>
    <p>End Date: {formatDate(course.EndDate)}</p>
    <p>Fees: {course.Fees}</p>
          {!showEditButton && <button onClick={() => onAdd(course)}>Add</button>}
          {showEditButton && <button className='btn-edit' onClick={onEdit}>Edit</button>}
          {showDeleteButton && <button className='btn-delete' onClick={onDelete}>Delete</button>}
      </div>
  );
};

export default CourseCard; 