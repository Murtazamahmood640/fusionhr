// ProjectList.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  GroupWork as GroupWorkIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  // Fetch all projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/projects');
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = projects.filter((project) =>
      project.projectName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  // Handle Update button click
  const handleUpdateClick = (project) => {
    setSelectedProject(project);
    setOpenUpdateDialog(true);
  };

  // Handle Delete button click
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`https://murtaza011-abidipro.mdbgo.io/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle milestones changes
  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = selectedProject.milestones.map((milestone, i) =>
      i === index ? { ...milestone, [name]: value } : milestone
    );
    setSelectedProject((prev) => ({
      ...prev,
      milestones: updatedMilestones,
    }));
  };

  // Add a new milestone
  const addMilestone = () => {
    setSelectedProject((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { name: '', dueDate: '', description: '' },
      ],
    }));
  };

  // Remove a milestone
  const removeMilestone = (index) => {
    const updatedMilestones = selectedProject.milestones.filter(
      (milestone, i) => i !== index
    );
    setSelectedProject((prev) => ({
      ...prev,
      milestones: updatedMilestones,
    }));
  };

  // Handle Update Project submission
  const handleUpdateProject = async () => {
    try {
      await axios.put(`https://murtaza011-abidipro.mdbgo.io/api/projects/${selectedProject._id}`, selectedProject);
      setOpenUpdateDialog(false);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>
        Project List
      </Typography>

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          label="Search Projects"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3} >
        {filteredProjects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card elevation={3} sx={{
    backgroundColor: (theme) => theme.palette.primary.main, // Use primary.main instead of primary[400]
  }}>
              <CardContent>
                {/* Project Number and Name */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h4" color="white" style={{ flexGrow: 1 }}>
                    {index + 1}. {project.projectName}
                  </Typography>
                </Box>

                {/* Project Details with Icons */}
                <Box display="flex" alignItems="center" mb={1}>
                  <AssignmentIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Lead:</strong> {project.lead}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Assigned Members:</strong> {project.assignedMembers.join(', ')}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <DateRangeIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <DateRangeIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <AttachMoneyIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Budget:</strong> ${project.budget}
                  </Typography>
                </Box>

                {/* <Box display="flex" alignItems="center" mb={1}>
                  <DescriptionIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Description:</strong> {project.description}
                  </Typography>
                </Box> */}

                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon color="action" />
                  <Typography variant="body1" ml={1}>
                    <strong>Client:</strong> {project.client}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle1" color="secondary">
                    <strong>Milestones:</strong>
                  </Typography>
                  {project.milestones.length > 0 ? (
                    project.milestones.map((milestone, idx) => (
                      <Box key={idx} ml={2} mb={1}>
                        <Typography variant="body2">
                          <strong>{idx + 1}. {milestone.name}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Due Date: {new Date(milestone.dueDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Description: {milestone.description}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" ml={2}>
                      No milestones available.
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="space-between">
                  <IconButton
                    color="secondary"
                    onClick={() => handleUpdateClick(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(project._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Update Project Dialog */}
      {selectedProject && (
        <Dialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Update Project</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Project Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Project Name"
                  name="projectName"
                  value={selectedProject.projectName}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Lead */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lead"
                  name="lead"
                  value={selectedProject.lead}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Assigned Members */}
              <Grid item xs={12}>
                <TextField
                  label="Assigned Members (comma separated)"
                  name="assignedMembers"
                  value={selectedProject.assignedMembers.join(', ')}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      assignedMembers: e.target.value.split(',').map((member) => member.trim()),
                    })
                  }
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={selectedProject.startDate.split('T')[0]}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* End Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={selectedProject.endDate.split('T')[0]}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Budget */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Budget"
                  name="budget"
                  type="number"
                  value={selectedProject.budget}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Client */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client"
                  name="client"
                  value={selectedProject.client}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Description */}
              {/* <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={selectedProject.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid> */}

              {/* Milestones */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Milestones
                </Typography>
                {selectedProject.milestones.map((milestone, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    {/* Milestone Name */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Milestone Name"
                        name="name"
                        value={milestone.name}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>

                    {/* Milestone Due Date */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={milestone.dueDate ? milestone.dueDate.split('T')[0] : ''}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    {/* Milestone Description */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Description"
                        name="description"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>

                    {/* Remove Milestone Button */}
                    <Grid item xs={12} sm={12}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeMilestone(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove Milestone
                      </Button>
                    </Grid>
                  </Grid>
                ))}

                {/* Add Milestone Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={addMilestone}
                  startIcon={<AddIcon />}
                  style={{ marginTop: '10px' }}
                >
                  Add Milestone
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateProject} color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ProjectList;
