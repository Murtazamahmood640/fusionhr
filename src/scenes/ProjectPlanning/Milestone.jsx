import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const CreateMilestone = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectMilestones, setProjectMilestones] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  // Define the max allowed date (you can adjust this)
  const maxDate = new Date().toISOString().split("T")[0]; // Current date

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/projects");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchProjectDetails = async () => {
        try {
          const { data } = await axios.get(
            `https://a-khuhro-abidipro.mdbgo.io/api/projects/${selectedProject}`
          );
          setProjectMilestones(data.milestones || []);
          // Fetch assignedMembers with their IDs
          setAssignedMembers(data.assignedMembers || []);
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      };

      fetchProjectDetails();
    }
  }, [selectedProject]);

  const handleFormSubmit = async (values) => {
    try {
      const formData = {
        projectName: selectedProject,
        milestoneName: values.milestoneName,
        dueDate: values.dueDate,
        status: values.status,
        assignedMembers: values.assignedMembers, // These will be IDs now
        description: values.description,
      };

      await axios.post("https://a-khuhro-abidipro.mdbgo.io/api/milestones", formData);
      alert("Milestone created successfully!");
    } catch (error) {
      console.error(
        "Error creating milestone:",
        error.response?.data || error.message
      );
      alert("Error creating milestone.");
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Add Milestone Details"
        subtitle="Add Milestone Details of Project"
      />
      <Formik
        initialValues={{
          milestoneName: "",
          dueDate: "",
          status: "",
          assignedMembers: [],
          description: "",
        }}
        validationSchema={yup.object().shape({
          milestoneName: yup.string().required("Milestone Name is required"),
          dueDate: yup.date().required("Due Date is required"),
          status: yup.string().required("Status is required"),
          description: yup.string().required("Description is required"),
        })}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(12, 1fr)"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
              }}
            >
              {/* Project Name */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Project Name</InputLabel>
                <Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>Select a project</FormHelperText>
              </FormControl>

              {/* Milestone Name */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Milestone Name</InputLabel>
                <Select
                  value={values.milestoneName}
                  onChange={handleChange}
                  name="milestoneName"
                >
                  {projectMilestones.map((milestone) => (
                    <MenuItem key={milestone._id} value={milestone.name}>
                      {milestone.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a milestone</FormHelperText>
              </FormControl>

              {/* Due Date */}
              <TextField
                fullWidth
                variant="filled"
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dueDate}
                name="dueDate"
                error={!!touched.dueDate && !!errors.dueDate}
                helperText={touched.dueDate && errors.dueDate}
                sx={{ gridColumn: "span 6" }}
                inputProps={{
                  min: selectedProject
                    ? new Date(projects.find(p => p._id === selectedProject)?.startDate)
                      .toISOString()
                      .split("T")[0]
                    : undefined,
                  max: selectedProject
                    ? new Date(projects.find(p => p._id === selectedProject)?.endDate)
                      .toISOString()
                      .split("T")[0]  // Format endDate as YYYY-MM-DD
                    : undefined,  // No max date if no project is selected
                }}
              />



              {/* Status */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={values.status}
                  onChange={handleChange}
                  name="status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
                <FormHelperText>Select status of the milestone</FormHelperText>
              </FormControl>

              {/* Description */}
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                multiline
                rows={4}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 12" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Save Milestone
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateMilestone;
