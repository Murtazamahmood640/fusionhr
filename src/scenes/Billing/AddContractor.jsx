import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddContractor = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        const formData = {
            contractorName: values.contractorName,
            serviceType: values.serviceType,
            contactInformation: {
                phone: values.phone,
                email: values.email,
                address: values.address,
            },
            projectAssigned: values.projectAssigned,
            contractStartDate: values.contractStartDate,
            contractEndDate: values.contractEndDate,
            hourlyRate: values.hourlyRate,
            paymentSchedule: values.paymentSchedule,
            notes: values.notes,
        };

        try {
            const response = await axios.post(
                "https://murtaza011-abidipro.mdbgo.io/api/contractors",
                formData
            );
            console.log("Contractor added successfully:", response.data);
            toast.success("Contractor added successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while adding the contractor";
            console.error("Error adding contractor:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <Box m="20px">
            <Header title="ADD CONTRACTOR" subtitle="Add Contractor" />
            <Formik
                initialValues={{
                    contractorName: "",
                    serviceType: "",
                    phone: "",
                    email: "",
                    address: "",
                    projectAssigned: "",
                    contractStartDate: "",
                    contractEndDate: "",
                    hourlyRate: "",
                    paymentSchedule: "",
                    notes: "",
                }}
                validationSchema={yup.object().shape({
                    contractorName: yup.string().required("Contractor Name is required"),
                    serviceType: yup.string().required("Service Type is required"),
                    phone: yup.string().required("Phone number is required"),
                    email: yup.string().email("Invalid email format").required("Email is required"),
                    address: yup.string().required("Address is required"),
                    projectAssigned: yup.string().required("Project Assigned is required"),
                    contractStartDate: yup.date().required("Contract Start Date is required"),
                    contractEndDate: yup.date().required("Contract End Date is required"),
                    hourlyRate: yup.number().required("Hourly Rate/Salary is required").positive("Hourly Rate/Salary must be positive"),
                    paymentSchedule: yup.string().required("Payment Schedule is required"),
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
                                label="Contractor Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contractorName}
                                name="contractorName"
                                error={!!touched.contractorName && !!errors.contractorName}
                                helperText={touched.contractorName && errors.contractorName}
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
                                <MenuItem value="Software Development">Software Development</MenuItem>
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
                                label="Project Assigned"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.projectAssigned}
                                name="projectAssigned"
                                error={!!touched.projectAssigned && !!errors.projectAssigned}
                                helperText={touched.projectAssigned && errors.projectAssigned}
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
                                type="number"
                                label="Hourly Rate/Salary"
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
                                label="Payment Schedule"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.paymentSchedule}
                                name="paymentSchedule"
                                error={!!touched.paymentSchedule && !!errors.paymentSchedule}
                                helperText={touched.paymentSchedule && errors.paymentSchedule}
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
                                Add Contractor
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default AddContractor;
