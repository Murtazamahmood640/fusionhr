import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVendor = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        const formData = {
            vendorName: values.vendorName,
            vendorType: values.vendorType,
            contactPerson: values.contactPerson,
            contactInformation: {
                phone: values.phone,
                email: values.email,
                address: values.address,
            },
            serviceProvided: values.serviceProvided,
            contractStartDate: values.contractStartDate,
            contractEndDate: values.contractEndDate,
            paymentTerms: values.paymentTerms,
            notes: values.notes,
        };

        try {
            const response = await axios.post(
                "https://murtaza011-abidipro.mdbgo.io/api/vendors",
                formData
            );
            console.log("Vendor added successfully:", response.data);
            toast.success("Vendor added successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while adding the vendor";
            console.error("Error adding vendor:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <Box m="20px">
            <Header title="ADD VENDOR" subtitle="Add Vendor" />
            <Formik
                initialValues={{
                    vendorName: "",
                    vendorType: "",
                    contactPerson: "",
                    phone: "",
                    email: "",
                    address: "",
                    serviceProvided: "",
                    contractStartDate: "",
                    contractEndDate: "",
                    paymentTerms: "",
                    notes: "",
                }}
                validationSchema={yup.object().shape({
                    vendorName: yup.string().required("Vendor Name is required"),
                    vendorType: yup.string().required("Vendor Type is required"),
                    contactPerson: yup.string().required("Contact Person is required"),
                    phone: yup.string().required("Phone number is required"),
                    email: yup.string().email("Invalid email format").required("Email is required"),
                    address: yup.string().required("Address is required"),
                    serviceProvided: yup.string().required("Service Provided is required"),
                    contractStartDate: yup.date().required("Contract Start Date is required"),
                    contractEndDate: yup.date().required("Contract End Date is required"),
                    paymentTerms: yup.string().required("Payment Terms are required"),
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
                                label="Vendor Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.vendorName}
                                name="vendorName"
                                error={!!touched.vendorName && !!errors.vendorName}
                                helperText={touched.vendorName && errors.vendorName}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Vendor Type"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.vendorType}
                                name="vendorType"
                                error={!!touched.vendorType && !!errors.vendorType}
                                helperText={touched.vendorType && errors.vendorType}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="IT Services">IT Services</MenuItem>
                                <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                                <MenuItem value="Consulting">Consulting</MenuItem>
                                <MenuItem value="Maintenance">Maintenance</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Contact Person"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contactPerson}
                                name="contactPerson"
                                error={!!touched.contactPerson && !!errors.contactPerson}
                                helperText={touched.contactPerson && errors.contactPerson}
                                sx={{ gridColumn: "span 6" }}
                            />

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
                                label="Service Provided"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.serviceProvided}
                                name="serviceProvided"
                                error={!!touched.serviceProvided && !!errors.serviceProvided}
                                helperText={touched.serviceProvided && errors.serviceProvided}
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
                                error={!!touched.contractStartDate && !!errors.contractStartDate}
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
                                type="text"
                                label="Payment Terms"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.paymentTerms}
                                name="paymentTerms"
                                error={!!touched.paymentTerms && !!errors.paymentTerms}
                                helperText={touched.paymentTerms && errors.paymentTerms}
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
                                Add Vendor
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default AddVendor;
