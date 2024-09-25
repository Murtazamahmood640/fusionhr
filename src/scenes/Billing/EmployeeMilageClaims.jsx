import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MilageClaims = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    const formData = {
      claimName: values.claimName,
      serviceType: values.serviceType,
      contactInformation: {
        phone: values.phone,
        email: values.email,
        address: values.address,
      },
      ClaimedProjectFees: values.ClaimedProjectFees,
      contractStartDate: values.contractStartDate,
      contractEndDate: values.contractEndDate,
      hourlyRate: values.hourlyRate,
      ClaimDescription: values.ClaimDescription,
      notes: values.notes,
    };

    try {
      const response = await axios.post(
        "https://murtaza011-abidipro.mdbgo.io/api/mileage-claims",
        formData
      );
      console.log("Claim added successfully:", response.data);
      toast.success("Claim added successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while adding the claim";
      console.error("Error adding Claim:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD MILEAGE CLAIM" subtitle="Provide Brief Details" />
      <Formik
        initialValues={{
          claimName: "",
          serviceType: "",
          phone: "",
          email: "",
          address: "",
          ClaimedProjectFees: "",
          contractStartDate: "",
          contractEndDate: "",
          hourlyRate: "",
          ClaimDescription: "",
          notes: "",
        }}
        validationSchema={yup.object().shape({
          claimName: yup.string().required("Claim Name is required"),
          serviceType: yup.string().required("Service Type is required"),
          phone: yup.string().required("Phone number is required"),
          email: yup
            .string()
            .email("Invalid email format")
            .required("Email is required"),
          address: yup.string().required("Address is required"),
          ClaimedProjectFees: yup
            .string()
            .required("Claimed Project Fees are required"),
          contractStartDate: yup
            .date()
            .required("Contract Start Date is required"),
          contractEndDate: yup.date().required("Contract End Date is required"),
          hourlyRate: yup
            .number()
            .required("Hourly Rate is required")
            .positive("Hourly Rate must be positive"),
          ClaimDescription: yup
            .string()
            .required("Claim Description is required"),
          notes: yup.string(),
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(12, 1fr)"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 12",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Claim Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.claimName}
                name="claimName"
                error={!!touched.claimName && !!errors.claimName}
                helperText={touched.claimName && errors.claimName}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                select
                label="Service Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceType}
                name="serviceType"
                error={!!touched.serviceType && !!errors.serviceType}
                helperText={touched.serviceType && errors.serviceType}
                sx={{ gridColumn: "span 6" }}
              >
                <MenuItem value="Software Development">
                  Software Development
                </MenuItem>
                <MenuItem value="Consulting">Consulting</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Claimed Project Fees"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ClaimedProjectFees}
                name="ClaimedProjectFees"
                error={!!touched.ClaimedProjectFees && !!errors.ClaimedProjectFees}
                helperText={touched.ClaimedProjectFees && errors.ClaimedProjectFees}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Contract Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contractStartDate}
                name="contractStartDate"
                InputLabelProps={{ shrink: true }}
                error={
                  !!touched.contractStartDate && !!errors.contractStartDate
                }
                helperText={touched.contractStartDate && errors.contractStartDate}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Contract End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contractEndDate}
                name="contractEndDate"
                InputLabelProps={{ shrink: true }}
                error={!!touched.contractEndDate && !!errors.contractEndDate}
                helperText={touched.contractEndDate && errors.contractEndDate}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Hourly Rate (in $)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hourlyRate}
                name="hourlyRate"
                error={!!touched.hourlyRate && !!errors.hourlyRate}
                helperText={touched.hourlyRate && errors.hourlyRate}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Claim Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ClaimDescription}
                name="ClaimDescription"
                error={
                  !!touched.ClaimDescription && !!errors.ClaimDescription
                }
                helperText={touched.ClaimDescription && errors.ClaimDescription}
                sx={{ gridColumn: "span 6" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Notes/Comments"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.notes}
                name="notes"
                error={!!touched.notes && !!errors.notes}
                helperText={touched.notes && errors.notes}
                sx={{ gridColumn: "span 6" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Add Mileage
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <ToastContainer />
    </Box>
  );
};

export default MilageClaims;
