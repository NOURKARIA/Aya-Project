import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import DepartmentForm from './DepartmentForm'; // You'll create this next
import './Departments.scss';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const navigate = useNavigate();

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockDepartments = [
      { id: 1, name: 'Human Resources', manager: 'John Doe', employeeCount: 15 },
      { id: 2, name: 'Engineering', manager: 'Jane Smith', employeeCount: 42 },
      { id: 3, name: 'Marketing', manager: 'Mike Johnson', employeeCount: 8 },
      { id: 4, name: 'Finance', manager: 'Sarah Williams', employeeCount: 12 },
    ];
    setDepartments(mockDepartments);
    setFilteredDepartments(mockDepartments);
  }, []);

  useEffect(() => {
    const results = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(results);
  }, [searchTerm, departments]);

  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  const handleViewEmployees = (departmentId) => {
    navigate(`/employees?department=${departmentId}`);
  };

  const handleSubmit = (departmentData) => {
    if (currentDepartment) {
      // Update existing department
      setDepartments(departments.map(dept =>
        dept.id === currentDepartment.id ? { ...dept, ...departmentData } : dept
      ));
    } else {
      // Add new department
      const newDepartment = {
        ...departmentData,
        id: Math.max(...departments.map(d => d.id)) + 1,
        employeeCount: 0
      };
      setDepartments([...departments, newDepartment]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="departments-container">
      <div className="departments-header">
        <h2>Departments</h2>
        <div className="actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAddDepartment}>
            <FiPlus /> Add Department
          </button>
        </div>
      </div>

      <div className="departments-table">
        {filteredDepartments.length === 0 ? (
          <div className="no-results">No departments found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Manager</th>
                <th>Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.manager}</td>
                  <td>
                    <button 
                      className="employee-count"
                      onClick={() => handleViewEmployees(department.id)}
                    >
                      {department.employeeCount} employees
                    </button>
                  </td>
                  <td>
                    <button 
                      className="btn-icon edit"
                      onClick={() => handleEdit(department)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(department.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isFormOpen && (
        <DepartmentForm
          department={currentDepartment}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Departments;