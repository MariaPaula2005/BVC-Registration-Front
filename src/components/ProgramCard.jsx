import React from 'react';

const ProgramCard = ({ program, onAdd }) => {
    if (!program) return null; 
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <div className="program-card">
            <h2>{program.Program}</h2>
            <p>Code: {program.Code}</p>
            <p>Department: {program.Department}</p>
            <p>Term: {program.Term}</p>
            <p>Description: {program.Description}</p>
            <p>Start Date: {formatDate(program.StartDate)}</p>
            <p>End Date: {formatDate(program.EndDate)}</p>
            <p>Fees: ${program.Fees}</p> 
        </div>
    );
};

export default ProgramCard;