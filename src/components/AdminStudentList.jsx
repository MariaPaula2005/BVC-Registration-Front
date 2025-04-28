import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminStudentList.css';

const AdminStudentList = () => {
    const [students, setStudents] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        firstName: 'All',
        lastName: 'All',
        email: 'All',
        phone: 'All',
        program: 'All',
        term: 'All',
    });

    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        program: true,
        term: true,
    });

    // State to manage filter dropdown visibility
    const [dropdownState, setDropdownState] = useState({
        filterDropdownOpen: false,
        columnDropdownOpen: false,
    });

    const filterDropdownRef = useRef(null);
    const columnDropdownRef = useRef(null);

    // Close dropdowns if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterDropdownRef.current && !filterDropdownRef.current.contains(event.target) &&
                columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)
            ) {
                setDropdownState({ filterDropdownOpen: false, columnDropdownOpen: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Effect to fetch student data from JSON file on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/students');
                const data = await response.json();
                console.log('Fetched students:', data); // Log fetched data for inspection
                setStudents(data);
                setFilteredStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    // Handler to update filter options based on user selection
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prevOptions) => {
            const updatedOptions = {
                ...prevOptions,
                [name]: value,
            };
            applyRegularFilter(updatedOptions); // Apply the filter with updated options
            return updatedOptions;
        });
    };

    // Function to apply regular filters to the student list
    const applyRegularFilter = () => {
        const filtered = students.filter(student => {
            return (
                (filterOptions.firstName === 'All' || (student.FirstName && student.FirstName.toLowerCase().includes(filterOptions.firstName.toLowerCase()))) &&
                (filterOptions.lastName === 'All' || (student.LastName && student.LastName.toLowerCase().includes(filterOptions.lastName.toLowerCase()))) &&
                (filterOptions.email === 'All' || (student.Email && student.Email.toLowerCase().includes(filterOptions.email.toLowerCase()))) &&
                (filterOptions.phone === 'All' || (student.Phone && student.Phone.includes(filterOptions.phone))) &&
                (filterOptions.program === 'All' || (student.Program && student.Program.toLowerCase().includes(filterOptions.program.toLowerCase()))) &&
                (filterOptions.term === 'All' || (student.Term && student.Term.toLowerCase().includes(filterOptions.term.toLowerCase())))
            );
        });

        setFilteredStudents(filtered);
    };

    // Reset all filters
    const resetFilterOptions = () => {
        setFilterOptions({
            firstName: 'All',
            lastName: 'All',
            email: 'All',
            phone: 'All',
            program: 'All',
            term: 'All',
        });
    };

    // Update the search
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Column visibility
    const toggleColumnVisibility = (column) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    const getUniqueOptions = (key) => {
        const uniqueValues = [...new Set(students.map(student => student[key]))];
        return uniqueValues;
    };

    // Function to toggle the filter dropdown visibility
    const toggleDropdown = (dropdownName) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [dropdownName]: !prevState[dropdownName],
        }));
    };

    // Log filtered students for debugging
    useEffect(() => {
        console.log('Filtered students:', filteredStudents);
    }, [filteredStudents]);

    return (
        <div className='student-list-container'>
            <div className='header'>
                <h2 className='title'>BVC Students</h2>
                <div className='search-bar'>
                    {/* Filter Dropdown */}
                    <div className='dropdown' ref={columnDropdownRef}>
                        <button className="btn btn-custom column-button" onClick={() => toggleDropdown('columnDropdownOpen')}>
                            <span className="material-icons icon">view_column</span>
                        </button>
                        {dropdownState.columnDropdownOpen && (
                            <div className="student-dropdown-menu show">
                                {Object.keys(visibleColumns).map((column) => (
                                    <div key={column} className="checkbox-container">
                                        <label>{column.charAt(0).toUpperCase() + column.slice(1)}</label>
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[column]}
                                            onChange={() => toggleColumnVisibility(column)}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className='table table-striped table-bordered student-table'>
                    <thead>
                        <tr>
                            {visibleColumns.firstName && <th>First Name</th>}
                            {visibleColumns.lastName && <th>Last Name</th>}
                            {visibleColumns.email && <th>Email</th>}
                            {visibleColumns.phone && <th>Phone</th>}
                            {visibleColumns.program && <th>Program</th>}
                            {visibleColumns.term && <th>Term</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.filter(student => {
                            return (
                                (student.FirstName && student.FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (student.LastName && student.LastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (student.Email && student.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (student.Phone && student.Phone.includes(searchTerm)) ||
                                (student.Program && student.Program.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (student.Term && student.Term.toLowerCase().includes(searchTerm.toLowerCase()))
                            );
                        }).map((student) => (
                            <tr key={student._id}> {/* Changed from student.id to student._id */}
                                {visibleColumns.firstName && <td>{student.FirstName}</td>}
                                {visibleColumns.lastName && <td>{student.LastName}</td>}
                                {visibleColumns.email && <td>{student.Email}</td>}
                                {visibleColumns.phone && <td>{student.Phone}</td>}
                                {visibleColumns.program && <td>{student.Program}</td>}
                                {visibleColumns.term && <td>{student.Term}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStudentList;
