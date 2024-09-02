const Employee = require('../models/employeeModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.employeeListByAdmin = async (req, res) => {
    try {
        const employees = await Employee.findAll({
          attributes: { exclude: ['password'] }
        });
        res.json(employees);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  };
  

exports.createEmployee = async (req, res) => {
  try {
    const { name, email,password, designation, department, joiningDate } = req.body;
    if (new Date(joiningDate) > new Date()) {
      return res.status(400).json({ message: 'Joining date cannot be in the future' });
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const employee = await Employee.create({ name, email,password, designation, department, joiningDate });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
  try {
    const employee = await Employee.findOne({ where: { email } });
    
    if (!employee) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    console.log("employee",process.env.JWT_SECRETx);
    
    
    const token = jwt.sign({ id: employee.id, email: employee.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("token",token);
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  };

exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, designation, department, joiningDate } = req.body;
    if (new Date(joiningDate) > new Date()) {
      return res.status(400).json({ message: 'Joining date cannot be in the future' });
    }
    const employee = await Employee.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.update({ name, email, designation, department, joiningDate });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const { department, designation } = req.query;
    const where = {};
    if (department) where.department = department;
    if (designation) where.designation = designation;

    const employees = await Employee.findAll({ where });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
