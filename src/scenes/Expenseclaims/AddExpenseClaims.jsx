import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseClaims = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        const formData = {
          claimName: values.claimName,
          claimType: values.claimType,
          contactInformation: {
            phone: values.phone,
            email: values.email,
            address: values.address,
          },
          claimAmount: values.claimAmount,
          Date: values.Date,
          ClaimDescription: values.ClaimDescription,
          notes: values.notes,
        };
    
        try {
          const response = await axios.post("https://murtaza011-abidipro.mdbgo.io/api/expense-claims", formData);
          console.log("Claim added successfully:", response.data);
          toast.success("Claim added successfully");
        } catch (error) {
          const errorMessage =
            error.response?.data?.details ||
            "An error occurred while adding the expense claim";
          console.error("Error adding claim:", error);
          toast.error(errorMessage);
        }
      };
    
    return (
        <Box m="20px">
            <Header title="ADD CLAIM" subtitle="Provide Brief Details" />
            <Formik
                initialValues={{
                    claimName: "",
                    claimType: "",
                    phone: "",
                    email: "",
                    address: "",
                    claimAmount: "",
                    Date: "",
                    ClaimDescription: "",
                    notes: "",
                }}
                validationSchema={yup.object().shape({
                    claimName: yup.string().required("Claim Name is required"),
                    claimType: yup.string().required("Service Type is required"),
                    phone: yup.string().required("Phone number is required"),
                    email: yup.string().email("Invalid email format").required("Email is required"),
                    address: yup.string().required("Address is required"),
                    claimAmount: yup.string().required("Claimed Project Name is required"),
                    Date: yup.date().required("Claim Date is required"),
                    ClaimDescription: yup.string().required("Claim Description is required"),
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
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
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
                                label="Claim Type"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.claimType}
                                name="claimType"
                                error={!!touched.claimType && !!errors.claimType}
                                helperText={touched.claimType && errors.claimType}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="Medical ">Medical </MenuItem>
                                <MenuItem value="Financial">Financial</MenuItem>
                                <MenuItem value="Travel">Travel</MenuItem>
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
                                label="Claimed Amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.claimAmount}
                                name="claimAmount"
                                error={!!touched.claimAmount && !!errors.claimAmount}
                                helperText={touched.claimAmount && errors.claimAmount}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Claim Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.Date}
                                name="Date"
                                InputLabelProps={{ shrink: true }}
                                error={!!touched.Date && !!errors.Date}
                                helperText={touched.Date && errors.Date}
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
                                error={!!touched.ClaimDescription && !!errors.ClaimDescription}
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
                                Add Claim
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default ExpenseClaims;
