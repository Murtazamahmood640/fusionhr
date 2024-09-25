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
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProject = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]); // For the client dropdown
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]); // Assigned Members (Team)
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get(
          "https://a-khuhro-abidipro.mdbgo.io/api/getUser"
        );
        const userNames = data.map((user) => user.name); // Extract only names
        setUsers(userNames);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const getAllClients = async () => {
      try {
        const { data } = await axios.get(
          "https://a-khuhro-abidipro.mdbgo.io/api/clients" // Assuming an endpoint for clients
        );
        const clientNames = data.map((client) => client.name);
        setClients(clientNames);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    getAllUsers();
    getAllClients();
  }, []);

  const handleFormSubmit = async (values) => {
    const formData = {
        projectName: values.projectName,
        lead: selectedLead,
        assignedMembers: selectedMembers, 
        startDate: values.startDate,
        endDate: values.endDate,
        client: values.client, 
        budget: values.budget,
        description: values.description,
        milestones: values.milestones,
      
      
    };

    try {
      if (values._id) {
        await axios.put(
          `http://locahost:3000/api/projects/${values._id}`,
          formData
        );
        toast.success("Project updated successfully");
      } else {
        await axios.post(
          "http://localhost:3000/api/projects",
          formData
        );
        toast.success("Project added successfully");
      }
    } catch (error) {
      console.error("Error processing project:", error);
      toast.error("Error processing project");
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PROJECT" subtitle="Add or Edit Project" />
      <Formik
        initialValues={{
          projectName: "",
          startDate: "",
          endDate: "",
          client: "",
          budget: "",
          description: "",
          milestones: [],
          documents: "",
          _id: "", // for editing existing projects
        }}
        validationSchema={yup.object().shape({
          projectName: yup.string().required("Project Name is required"),
          startDate: yup.date().required("Start Date is required"),
          endDate: yup.date().required("End Date is required"),
          // client: yup.string().required("Client is required"),
          budget: yup.number().required("Budget is required"),
          // description: yup.string().required("Description is required"),
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
              <TextField
                fullWidth
                variant="filled"
                label="Project Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.projectName}
                name="projectName"
                error={!!touched.projectName && !!errors.projectName}
                helperText={touched.projectName && errors.projectName}
                sx={{ gridColumn: "span 6" }}
              />

              {/* Lead */}
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Lead</InputLabel>
                <Select
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a lead for the project</FormHelperText>
              </FormControl>

              {/* Assigned To (Team Members) */}
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={(e) => setSelectedMembers(e.target.value)}
                  open={isMembersDropdownOpen}
                  onClose={() => setIsMembersDropdownOpen(false)}
                  onOpen={() => setIsMembersDropdownOpen(true)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {users.map((user) => (
                    <MenuItem key={user} value={user}>
                      <Checkbox checked={selectedMembers.indexOf(user) > -1} />
                      <ListItemText primary={user} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select team members for the project</FormHelperText>
              </FormControl>

              {/* Client */}
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Client</InputLabel>
                <Select
                  value={values.client}
                  onChange={handleChange}
                  name="client"
                  error={!!touched.client && !!errors.client}
                >
                  {clients.map((client) => (
                    <MenuItem key={client} value={client}>
                      {client}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a client for the project</FormHelperText>
              </FormControl>

              {/* Start Date */}
              <TextField
                fullWidth
                variant="filled"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 6" }}
              />

              {/* Budget */}
              <TextField
                fullWidth
                variant="filled"
                label="Budget"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.budget}
                name="budget"
                error={!!touched.budget && !!errors.budget}
                helperText={touched.budget && errors.budget}
                sx={{ gridColumn: "span 6" }}
              />

              {/* Description
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
              /> */}

              {/* Milestones section */}
              <Box sx={{ gridColumn: "span 12" }}>
                <FieldArray name="milestones">
                  {({ remove, push }) => (
                    <>
                  <Button
  variant="outlined"
  onClick={() =>
    push({
      name: "",
      dueDate: "",
      description: "",
    })
  }
  sx={{
    color: 'white',          // Set text color to green
    boxShadow: '0px 4px 10px rgba(0, 128, 0, 0.4)',  // Greenish box shadow
    borderColor: 'green',    // Set the outline border color to green
    '&:hover': {
      backgroundColor: 'rgba(0, 128, 0, 0.1)', // Add a green tint on hover
      borderColor: 'white', // Maintain green border on hover
      boxShadow: '0px 6px 12px rgba(0, 128, 0, 0.6)', // More intense shadow on hover
    },
  }}
>
  Add Milestone
</Button>

                      {values.milestones.map((milestone, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            gridColumn: "span 12",
                          }}
                        >
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Milestone Name"
                            name={`milestones.${index}.name`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={milestone.name}
                            sx={{ gridColumn: "span 4" }}
                          />
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Milestone Due Date"
                            name={`milestones.${index}.dueDate`}
                            type="date"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={milestone.dueDate}
                            InputLabelProps={{ shrink: true }}
                            sx={{ gridColumn: "span 4" }}
                          />
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Milestone Description"
                            name={`milestones.${index}.description`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={milestone.description}
                            multiline
                            rows={2}
                            sx={{ gridColumn: "span 4" }}
                          />
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ gridColumn: "span 12" }}
                          >
                            Remove Milestone
                          </Button>
                        </Box>
                      ))}
                    </>
                  )}
                </FieldArray>
              </Box>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Save Project
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default CreateProject;
