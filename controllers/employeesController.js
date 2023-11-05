const Employee = require('../models/Employee');

const allEmployees = async () => {
  return await Employee.find().exec();
}

const findById = async (id) => {
  return await Employee.findOne({ _id: id}).exec();
};

const getAllEmployees = async (req, res) => {
  res.json(await allEmployees());
}

const createEmployee = async (req, res) => {
  if(!req.body.first_name || !req.body.last_name) {
    return res.status(400).json({ "message": 'First and last names are required.' });
  }

  const newEmployee = await Employee.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  res.status(201).json(await allEmployees());
}

const updateEmployee = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ "message": 'Employee ID is required.' });
  }

  const employee = await findById(req.body.id);

  if (!employee) {
    return res.status(400).json({ "message": `Employee with id ${req.body.id} not found.` });
  }

  if (req.body?.first_name) employee.first_name = req.body.first_name;
  if (req.body?.last_name) employee.last_name = req.body.last_name;
  await employee.save();

  res.json(await allEmployees());
}

const deleteEmployee = async (req, res) => {
  const employee = await findById(req.body.id);

  if (!employee) {
    return res.status(400).json({ "message": `Employee with id ${req.body.id} not found.` });
  }

  await Employee.deleteOne({ _id: employee._id });

  res.json(await allEmployees());
}

const getEmployeeById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ "message": 'Employee ID is required.' });
  }

  const employee = await findById(req.params.id);

  if (!employee) {
    return res.status(400).json({ "message": `Employee with id ${req.params.id} not found.` });
  }

  res.json(employee);
}

module.exports = { getAllEmployees,
                   createEmployee,
                   updateEmployee,
                   deleteEmployee,
                   getEmployeeById }