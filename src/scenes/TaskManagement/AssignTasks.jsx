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
  FormHelperText,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";

const AssignTasks = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(""); // Controlled value

  const currentUser = JSON.parse(localStorage.getItem("name"));

  // Fetch projects and members on component mount
  useEffect(() => {
    const fetchProjectsAndMembers = async () => {
      try {
        const [projectsResponse, membersResponse] = await Promise.all([
          axios.get("https://a-khuhro-abidipro.mdbgo.io/api/project/created", {
            params: { name: currentUser.name },
          }),
          axios.get("https://a-khuhro-abidipro.mdbgo.io/api/getUser"),
        ]);

        setProjects(projectsResponse.data);
        setMembers(membersResponse.data.map((user) => user.name));
      } catch (error) {
        console.error("Error fetching projects or members:", error);
      }
    };

    fetchProjectsAndMembers();
  }, [currentUser.name]);

  // Handle project selection change
  useEffect(() => {
    if (selectedProject) {
      const project = projects.find((p) => p.projectName === selectedProject);

      setFilteredMembers(project ? project.assignedMembers : members);
      setMilestones(project ? project.milestones : []); // Set milestones or empty array if no project
      setSelectedMilestone(""); // Reset milestone selection when project changes
    } else {
      setFilteredMembers(members);
      setMilestones([]); // Reset milestones when no project is selected
      setSelectedMilestone(""); // Reset milestone selection
    }
  }, [selectedProject, projects, members]);

  const handleFormSubmit = async (values, { resetForm }) => {
    const formData = {
      projectName: values.projectName,
      taskName: values.taskName,
      textDescription: values.textDescription,
      assignedTo: values.assignedTo,
      assignedBy: currentUser.name,
      startDate: values.startDate,
      endDate: values.endDate,
      priority: values.priority, // Added priority field
      relatedMilestone: values.relatedMilestone, // Added related milestone field
    };

    try {
      await axios.post(
        "http://localhost:3000/api/tasks-assigned",
        formData
      );
      toast.success("Task added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(
        `Error: ${
          error.response ? error.response.data.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <Box m="20px">
      <Header title="ASSIGN TASK" subtitle="Add a New Task" />
      <Formik
        initialValues={{
          projectName: "",
          taskName: "",
          textDescription: "",
          assignedTo: "",
          startDate: "",
          endDate: "",
          priority: "Medium", // Default priority
          relatedMilestone: "", // Related milestone
        }}
        validationSchema={yup.object().shape({
          projectName: yup.string().required("Project Name is required"),
          taskName: yup.string().required("Task Name is required"),
          textDescription: yup
            .string()
            .required("Task Description is required"),
          assignedTo: yup.string().required("Assigned To is required"),
          startDate: yup.date().required("Start Date is required"),
          endDate: yup.date().required("End Date is required"),
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
                <InputLabel>Project</InputLabel>
                <Select
                  value={values.projectName}
                  onChange={(e) => {
                    setFieldValue("projectName", e.target.value);
                    setSelectedProject(e.target.value);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.projectName && !!errors.projectName}
                >
                  {projects.map((p) => (
                    <MenuItem key={p._id} value={p.projectName}>
                      {p.projectName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.projectName && errors.projectName}
                </FormHelperText>
              </FormControl>

              {/* Task Name */}
              <TextField
                fullWidth
                variant="filled"
                label="Task Name"
                name="taskName"
                value={values.taskName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.taskName && !!errors.taskName}
                helperText={touched.taskName && errors.taskName}
                sx={{ gridColumn: "span 6" }}
              />

              {/* Task Description */}
              <TextField
                fullWidth
                variant="filled"
                label="Task Description"
                name="textDescription"
                multiline
                rows={4}
                value={values.textDescription}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.textDescription && !!errors.textDescription}
                helperText={touched.textDescription && errors.textDescription}
                sx={{ gridColumn: "span 12" }}
              />

              {/* Assigned To */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={values.assignedTo}
                  onChange={handleChange}
                  name="assignedTo"
                  onBlur={handleBlur}
                  error={!!touched.assignedTo && !!errors.assignedTo}
                >
                  {filteredMembers.map((m, index) => (
                    <MenuItem key={index} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.assignedTo && errors.assignedTo}
                </FormHelperText>
              </FormControl>

              {/* Priority */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Priority</InputLabel>
                <Select
                  value={values.priority}
                  onChange={handleChange}
                  name="priority"
                  onBlur={handleBlur}
                  error={!!touched.priority && !!errors.priority}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
                <FormHelperText>
                  {touched.priority && errors.priority}
                </FormHelperText>
              </FormControl>

              {/* Related Milestone */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 6" }}
              >
                <InputLabel>Related Milestone</InputLabel>
                <Select
                  value={values.relatedMilestone}
                  onChange={(e) =>
                    setFieldValue("relatedMilestone", e.target.value)
                  }
                  name="relatedMilestone"
                  onBlur={handleBlur}
                  error={
                    !!touched.relatedMilestone && !!errors.relatedMilestone
                  }
                  disabled={!milestones.length} // Disable if no milestones
                >
                  {milestones.length ? (
                    milestones.map((milestone, index) => (
                      <MenuItem key={milestone._id} value={milestone.name}>
                        {milestone.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No milestones available</MenuItem>
                  )}
                </Select>
                <FormHelperText>
                  {touched.relatedMilestone && errors.relatedMilestone}
                </FormHelperText>
              </FormControl>

              {/* Start Date */}
              <TextField
                fullWidth
                variant="filled"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                name="startDate"
                value={values.startDate}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 6" }}
              />

              {/* End Date */}
              <TextField
                fullWidth
                variant="filled"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                name="endDate"
                value={values.endDate}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 6" }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
            >
              Assign Task
            </Button>
            <ToastContainer />
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AssignTasks;
