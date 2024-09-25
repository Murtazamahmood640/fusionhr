import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";

const Test = () => {
  const [departments, setDepartments] = useState([]);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/EmployeesPayroll");
      const departmentData = data.reduce((acc, employee) => {
        const { department, netSalary } = employee;
        if (!acc[department]) {
          acc[department] = { department, totalSalary: 0 };
        }
        acc[department].totalSalary += netSalary;
        return acc;
      }, {});

      const transformedData = Object.values(departmentData);
      setDepartments(transformedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

 
  return <BarChart data={departments} />;
};

export default Test;
