import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
 
const TaskStatus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [reFetch, setReFetch] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("name"));

  useEffect(() => {
    fetchTasks();
  }, [reFetch]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/create-tasks', {
        params: { name: currentUser.name },
      });
  
      // Ensure every task has a unique 'id' property (fallback to index if '_id' is missing)
      const tasksWithId = response.data.map((task, index) => ({
        ...task,
        id: task._id || index, // Use '_id' if available, otherwise use the index as a fallback
      }));
  
      setProjects(tasksWithId);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };
  
 
  const handleEditClick = (project) => {
    setEditingProject(project);
    setPopupOpen(true);
  };
 
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/deleteTask`, { params: { _id: id } });
      setReFetch(!reFetch);  // Trigger a re-fetch of tasks after deletion
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };
 
  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingProject(null);
  };

  // Prevent duplicate tasks from being added to the projects array
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      taskAssinge: e.target.taskassinge.value,
      completionTime: e.target.completiontime.value,
      date: e.target.date.value,
      taskpriority: e.target.taskpriority.value,
    };
 
    try {
      if (editingProject) {
        // Edit existing task
        await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/assigned-tasks/${editingProject._id}`, formData);
        toast.success("Task updated successfully");
      } else {
        // Add new task
        const response = await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/assigned-tasks', formData);
        const newTask = response.data;
        // Check if the new task is already in the projects list to avoid duplication
        setProjects((prevProjects) => {
          const isTaskExists = prevProjects.some((task) => task._id === newTask._id);
          return isTaskExists ? prevProjects : [...prevProjects, newTask];
        });
        toast.success("Task created successfully");
      }
      fetchTasks();  // Re-fetch tasks to refresh the table
      handlePopupClose();
    } catch (error) {
      toast.error("Failed to save the task");
    }
  };

  const columns = [
    { field: "projectName", headerName: "Project Name", flex: 1 },
    { field: "taskName", headerName: "Task Name", flex: 1 },
    // { field: "textDescription", headerName: "Task Description", flex: 2 },
    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    { field: "assignedBy", headerName: "Assigned By", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1, renderCell: (params) => params.value.slice(0, 10) },
    { field: "endDate", headerName: "End Date", flex: 1, renderCell: (params) => params.value.slice(0, 10) },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          {/* <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button> */}
          <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TASK STATUS" subtitle="Manage Your Tasks" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={projects}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10} // Set default page size explicitly
          pageSizeOptions={[10, 20, 50]} // Set page size options
        />
      </Box>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>{editingProject ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">PROJECT NAME:</label>
                <input type="text" id="name" name="name" required defaultValue={editingProject ? editingProject.name : ''} />
              </div>
              <div className="form-group">
                <label htmlFor="taskassinge">Task Name:</label>
                <input type="text" id="taskassinge" name="taskassinge" required defaultValue={editingProject ? editingProject.taskAssinge : ''} />
              </div>
              <div className="form-group">
                <label htmlFor="completiontime">Completion Time:</label>
                <input type="text" id="completiontime" name="completiontime" required defaultValue={editingProject ? editingProject.completionTime : ''} />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" required defaultValue={editingProject ? editingProject.date : ''} />
              </div>
              <div className="form-group">
                <label htmlFor="taskpriority">Task Priority:</label>
                <input type="text" id="taskpriority" name="taskpriority" required defaultValue={editingProject ? editingProject.taskpriority : ''} />
              </div>
              <button type="submit">{editingProject ? 'Save Changes' : 'Submit'}</button>
              <button onClick={handlePopupClose} type="button">Cancel</button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </Box>
  );
};
 
export default TaskStatus;
