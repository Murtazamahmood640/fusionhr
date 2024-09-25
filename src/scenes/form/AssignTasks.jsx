import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Typography, Card, CardContent, CardActions, useTheme
} from '@mui/material';
import { Assignment, Search } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const AssignTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('sortby');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedAssignedTo, setSelectedAssignedTo] = useState([]);
  const [selectedAssignedBy, setSelectedAssignedBy] = useState([]);
  const [createdProject, setCreatedProject] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
 
  const currentUser = JSON.parse(localStorage.getItem("name"));
  const theme = useTheme();
 
  useEffect(() => {
    const getCreatedProjects = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/project/created', {
          params: { name: currentUser.name },
        });
        setCreatedProject(response.data);
      } catch (error) {
        console.error('Failed to fetch created projects:', error);
      }
    };
 
    const getActiveProjects = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/project/created', {
          params: { name: currentUser },
        });
        setActiveProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch active projects:', error);
      }
    };
 
    const getProjectMembers = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/getUser');
        const userNames = response.data.map(user => user.name);
        setMembers(userNames);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
 
    getCreatedProjects();
    getActiveProjects();
    getProjectMembers();
  }, [currentUser]);
 
  useEffect(() => {
    if (selectedProject) {
      const project = createdProject.find(p => p.projectName === selectedProject);
      setFilteredMembers(project ? project.assignedMembers : []);
    } else {
      setFilteredMembers(members);
    }
  }, [selectedProject, createdProject, members]);
 
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortingChange = (e) => setSortingOption(e.target.value);
  const handleAddTaskClick = () => {
    setPopupOpen(true);
    setEditingIndex(null);
    setSelectedProject('');
    setSelectedAssignedTo([]);
    setSelectedAssignedBy(currentUser.name); // Directly setting Assigned By to current user
  };
 
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setPopupOpen(true);
    const task = projects[index];
    setSelectedProject(task.projectName);
    setSelectedAssignedTo(task.assignedTo);
    setSelectedAssignedBy(task.assignedBy);
  };
 
  const handleViewDetailsClick = (project) => {
    setSelectedProjectDetails(project);
    setDetailsDialogOpen(true);
  };
 
  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
    setDetailsDialogOpen(false);
    setSelectedProjectDetails(null);
  };
 
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };
 
  const handleAssignedToChange = (event) => setSelectedAssignedTo(event.target.value);
 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      projectName: selectedProject,
      taskName: e.target.taskName.value,
      textDescription: e.target.textDescription.value,
      assignedTo: selectedAssignedTo,
      assignedBy: selectedAssignedBy,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
    };
  
    console.log('Form Data:', formData);
  
    try {
      if (editingIndex !== null) {
        const projectId = projects[editingIndex]._id;
        await axios.put(`https://murtaza011-abidipro.mdbgo.io/api/assigned-tasks/${projectId}`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...formData, _id: projectId };
        setProjects(updatedProjects);
        toast.success("Task updated successfully");
      } else {
        const response = await axios.post("https://murtaza011-abidipro.mdbgo.io/api/create-tasks", formData);
        setProjects([...projects, { ...formData, _id: response.data._id }]);
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.error("Error processing project:", error.response ? error.response.data : error.message);
      toast.error(`Error processing project: ${error.response ? error.response.data.message : "Unknown error"}`);
    }
  
    setPopupOpen(false);
    setEditingIndex(null);
  };
  

 
  const sortedProjects = [...projects].sort((a, b) => {
    if (sortingOption === 'sortby') {
      return 0;
    } else if (sortingOption === 'name') {
      return a.projectName.localeCompare(b.projectName);
    } else if (sortingOption === 'id') {
      return (a._id || a.id).localeCompare(b._id || b.id);
    }
    return 0;
  });
 
  const filteredProjects = sortedProjects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const filteredActiveProjects = activeProjects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <Box p={3} bgcolor={theme.palette.background.default}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">Assign Tasks</Typography>
            <Button variant="contained" color="primary" onClick={handleAddTaskClick} startIcon={<Assignment />}>
              Assign Task
            </Button>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search projects or tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search position="start" />,
              }}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort by</InputLabel>
              <Select value={sortingOption} onChange={handleSortingChange} label="Sort by">
                <MenuItem value="sortby" disabled>Sort by</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="id">ID</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <Grid container spacing={3}>
            {filteredProjects.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{p.projectName}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEditClick(p._id)}>Edit</Button>
                    <Button size="small" onClick={() => handleViewDetailsClick(p)}>View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid> */}
          <Typography variant="h5" mt={4} mb={2}>Active Projects</Typography>
          <Grid container spacing={3}>
            {filteredActiveProjects.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{p.projectName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {p.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
 
      <Dialog open={isPopupOpen} onClose={handlePopupClose}>
        <DialogTitle>{editingIndex !== null ? 'Edit Task' : 'Assign Task'}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Project</InputLabel>
                  <Select value={selectedProject} onChange={handleProjectChange} label="Project">
                    {createdProject.map((p) => (
                      <MenuItem key={p._id} value={p.projectName}>
                        {p.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Task Name"
                  name="taskName"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Task Description"
                  name="textDescription"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Assigned To</InputLabel>
                  <Select value={selectedAssignedTo} onChange={handleAssignedToChange} label="Assigned To">
                    {filteredMembers.map((m, index) => (
                      <MenuItem key={index} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Assigned By"
                  value={selectedAssignedBy}
                  name="assignedBy"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="End Date"
                  name="endDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {editingIndex !== null ? 'Update' : 'Assign'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};
 
export default AssignTasks;
 