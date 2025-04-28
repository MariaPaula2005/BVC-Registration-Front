import React, { useState, useEffect } from "react";
import ProgramCard from "./ProgramCard";
import "./SearchProgramsComponent.css";

const SearchProgramsComponent = ({ onProgramAdd, programs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const terms = [...new Set(programs.map((program) => program.Term))];
  const types = [...new Set(programs.map((program) => program.Program))];

  const filteredPrograms = programs.filter(
    (program) =>
      (program.Program || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTerm ? program.Term === selectedTerm : true) &&
      (selectedType ? program.Program === selectedType : true)
  );

  return (
    <div className="search-programs-container">
      <input
        type="text"
        placeholder="Search by Program Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSelectedTerm(e.target.value)} value={selectedTerm}>
        <option value="">Filter by Term</option>
        {terms.map((term) => (
          <option key={term} value={term}>{term}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
        <option value="">Filter by Type</option>
        {types.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <div className="program-card-list">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <ProgramCard
              key={program.Code}
              program={program}
              showAddButton
              onAdd={onProgramAdd}
            />
          ))
        ) : (
          <p>No programs found</p>
        )}
      </div>
    </div>
  );
};

export default SearchProgramsComponent;
