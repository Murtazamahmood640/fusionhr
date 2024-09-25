import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";

const Account = () => {
  const [formData, setFormData] = useState({
    name: "",
    personalEmail: "",
    phoneNumber: "",
    birthday: "",
    street: "",
    city: "",
    state: "",
    country: "",
    linkedinId: "",
    twitter: "",
    facebook: "",
    education: [
      {
        degree: "",
        institution: "",
        year: "",
      },
    ],
    experience: [
      {
        company: "",
        role: "",
        years: "",
      },
    ],
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(""); // "education", "experience", "personal", "address", "social"
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`https://a-khuhro-abidipro.mdbgo.io/api/users/user/${userId}`)
      .then((response) => {
        const userData = response.data;
        setFormData({
          name: userData.name || "",
          personalEmail: userData.personalEmail || "",
          phoneNumber: userData.phoneNumber || "",
          birthday: userData.birthday ? userData.birthday.slice(0, 10) : "",
          street: userData.street || "",
          city: userData.city || "",
          state: userData.state || "",
          country: userData.country || "",
          linkedinId: userData.linkedinId || "",
          twitter: userData.twitter || "",
          facebook: userData.facebook || "",
          education: userData.education || [],
          experience: userData.experience || [],
        });
      })
      .catch((error) => console.error("Failed to fetch user details", error));
  }, []);

  const handleDialogOpen = (item, type, edit = false) => {
    setSelectedItem(item);
    setItemType(type);
    setIsEdit(edit);
    setOpenDialog(true);
  };
  const handleDelete = (index, type) => {
    let updatedData = { ...formData };
    
    // Remove the item based on the type (education or experience)
    if (type === "education") {
      updatedData.education.splice(index, 1);
    } else if (type === "experience") {
      updatedData.experience.splice(index, 1);
    }
  
    // Update the state after deletion
    setFormData(updatedData);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} entry deleted successfully`);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    let updatedData = { ...formData };
    if (itemType === "education") {
      if (isEdit) {
        updatedData.education = updatedData.education.map((edu) =>
          edu === selectedItem ? selectedItem : edu
        );
      } else {
        updatedData.education.push(selectedItem);
      }
    } else if (itemType === "experience") {
      if (isEdit) {
        updatedData.experience = updatedData.experience.map((exp) =>
          exp === selectedItem ? selectedItem : exp
        );
      } else {
        updatedData.experience.push(selectedItem);
      }
    } else if (itemType === "personal" || itemType === "address" || itemType === "social") {
      updatedData = { ...formData, ...selectedItem };
    }
    setFormData(updatedData);
    setOpenDialog(false);
    toast.success(`${itemType} entry saved successfully`);
  };

  const renderGrid = (items, type, label, icon) => (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  {icon}
                  <Typography variant="h6" ml={2}>
                    {type === "education" ? item.degree : item.company}
                  </Typography>
                </Box>
  
                {type === "education" ? (
                  <>
                    <Box display="flex" alignItems="center" ml={2}>
                      <Typography variant="body1" mr={2}>Institution: {item.institution}</Typography>
                      <Typography variant="body1" mr={2}>Year: {item.year}</Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box display="flex" alignItems="center" ml={2}>
                      <Typography variant="body1" mr={2}>Role: {item.role}</Typography>
                      <Typography variant="body1" mr={2}>Years: {item.years}</Typography>
                    </Box>
                  </>
                )}
  
                <Box display="flex" alignItems="center">
                  <IconButton
                    color="secondary"
                    onClick={() => handleDialogOpen(item, type, true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index, type)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
  
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen({ degree: "", institution: "", year: "" }, type)}
        >
          Add New {label}
        </Button>
      </Grid>
    </Grid>
  );
  


  const renderPersonalDetails = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Personal Details</Typography>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <PersonIcon />
          <Typography variant="body1" ml={1}>
            Name: {formData.name}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <EmailIcon />
          <Typography variant="body1" ml={1}>
            Email: {formData.personalEmail}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <PhoneIcon />
          <Typography variant="body1" ml={1}>
            Phone: {formData.phoneNumber}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <CakeIcon />
          <Typography variant="body1" ml={1}>
            Date of Birth: {formData.birthday}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() =>
            handleDialogOpen(
              { phoneNumber: formData.phoneNumber, birthday: formData.birthday },
              "personal",
              true
            )
          }
        >
          Edit Personal Details
        </Button>
      </Grid>
    </Grid>
  );

  const renderAddress = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Address</Typography>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <HomeIcon />
          <Typography variant="body1" ml={1}>
            Street: {formData.street}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <LocationCityIcon />
          <Typography variant="body1" ml={1}>
            City: {formData.city}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <PublicIcon />
          <Typography variant="body1" ml={1}>
            Country: {formData.country}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() =>
            handleDialogOpen(
              { street: formData.street, city: formData.city, state: formData.state, country: formData.country },
              "address",
              true
            )
          }
        >
          Edit Address
        </Button>
      </Grid>
    </Grid>
  );

  const renderSocialLinks = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Social Links</Typography>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" alignItems="center">
          <LinkedInIcon />
          <Typography variant="body1" ml={1}>
            LinkedIn: {formData.linkedinId}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" alignItems="center">
          <TwitterIcon />
          <Typography variant="body1" ml={1}>
            Twitter: {formData.twitter}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" alignItems="center">
          <FacebookIcon />
          <Typography variant="body1" ml={1}>
            Facebook: {formData.facebook}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() =>
            handleDialogOpen(
              { linkedinId: formData.linkedinId, twitter: formData.twitter, facebook: formData.facebook },
              "social",
              true
            )
          }
        >
          Edit Social Links
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box m={4}>
      <Header title="ACCOUNT" subtitle="Manage Your Profile Details" />

      {/* Personal Details */}
      {renderPersonalDetails()}

      {/* Address Section */}
      {renderAddress()}

      {/* Social Links Section */}
      {renderSocialLinks()}

      {/* Education Section */}
      <Typography variant="h4" gutterBottom mt={4}>
        Education
      </Typography>
      {renderGrid(formData.education, "education", "Education", <SchoolIcon />)}

      {/* Experience Section */}
      <Typography variant="h4" gutterBottom mt={4}>
        Experience
      </Typography>
      {renderGrid(formData.experience, "experience", "Experience", <BusinessIcon />)}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEdit ? "Edit" : "Add"} {itemType === "education" ? "Education" : itemType === "experience" ? "Experience" : "Details"}</DialogTitle>
        <DialogContent>
          {itemType === "education" ? (
            <>
              <TextField
                label="Degree"
                fullWidth
                margin="dense"
                value={selectedItem?.degree || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, degree: e.target.value })}
              />
              <TextField
                label="Institution"
                fullWidth
                margin="dense"
                value={selectedItem?.institution || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, institution: e.target.value })}
              />
              <TextField
                label="Year"
                fullWidth
                margin="dense"
                value={selectedItem?.year || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, year: e.target.value })}
              />
            </>
          ) : itemType === "experience" ? (
            <>
              <TextField
                label="Company"
                fullWidth
                margin="dense"
                value={selectedItem?.company || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, company: e.target.value })}
              />
              <TextField
                label="Role"
                fullWidth
                margin="dense"
                value={selectedItem?.role || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
              />
              <TextField
                label="Years"
                fullWidth
                margin="dense"
                value={selectedItem?.years || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, years: e.target.value })}
              />
            </>
          ) : itemType === "personal" ? (
            <>
              <TextField
                label="Phone Number"
                fullWidth
                margin="dense"
                value={selectedItem?.phoneNumber || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, phoneNumber: e.target.value })}
              />
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                margin="dense"
                value={selectedItem?.birthday || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, birthday: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : itemType === "address" ? (
            <>
              <TextField
                label="Street"
                fullWidth
                margin="dense"
                value={selectedItem?.street || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, street: e.target.value })}
              />
              <TextField
                label="City"
                fullWidth
                margin="dense"
                value={selectedItem?.city || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, city: e.target.value })}
              />
              <TextField
                label="State"
                fullWidth
                margin="dense"
                value={selectedItem?.state || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, state: e.target.value })}
              />
              <TextField
                label="Country"
                fullWidth
                margin="dense"
                value={selectedItem?.country || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, country: e.target.value })}
              />
            </>
          ) : (
            <>
              <TextField
                label="LinkedIn"
                fullWidth
                margin="dense"
                value={selectedItem?.linkedinId || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, linkedinId: e.target.value })}
              />
              <TextField
                label="Twitter"
                fullWidth
                margin="dense"
                value={selectedItem?.twitter || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, twitter: e.target.value })}
              />
              <TextField
                label="Facebook"
                fullWidth
                margin="dense"
                value={selectedItem?.facebook || ""}
                onChange={(e) => setSelectedItem({ ...selectedItem, facebook: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default Account;
