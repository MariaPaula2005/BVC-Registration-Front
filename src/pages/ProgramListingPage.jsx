import React from 'react';
import './ProgramListingPage.css';
import SearchProgramsComponent from '../components/SearchProgramsComponent';

const ProgramListingPage = ({ programs, onProgramAdd }) => {
    return (
        <div>
            <h1 className='programH1'>Programs</h1>
            <SearchProgramsComponent programs={programs} onProgramAdd={onProgramAdd} />
        </div>
    );
};

export default ProgramListingPage;
