import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPayee = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        const formData = {
            name: values.name,
            employeeId: values.employeeId,
            department: values.department,
            bankAccount: values.bankAccount,
            taxInformation: {
                taxId: values.taxId,
                taxCategory: values.taxCategory,
                taxPercentage: values.taxPercentage,
            },
        };

        try {
            const response = await axios.post(
                "https://a-khuhro-abidipro.mdbgo.io/api/payees",
                formData
            );
            console.log("Payee added successfully:", response.data);
            toast.success("Payee added successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while adding the payee";
            console.error("Error adding payee:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <Box m="20px">
            <Header title="ADD PAYEE" subtitle="Add Payee" />
            <Formik
                initialValues={{
                    name: "",
                    employeeId: "",
                    department: "",
                    bankAccount: "",
                    taxId: "",
                    taxCategory: "",
                    taxPercentage: "",
                }}
                validationSchema={yup.object().shape({
                    name: yup.string().required("Name is required"),
                    employeeId: yup.string().required("Employee ID is required"),
                    department: yup.string().required("Department is required"),
                    bankAccount: yup
                        .string()
                        .matches(/^\d+$/, "Bank Account must be numeric")
                        .required("Bank Account is required"),
                    taxId: yup.string().required("Tax ID is required"),
                    taxCategory: yup.string().required("Tax Category is required"),
                    taxPercentage: yup
                        .number()
                        .min(0, "Tax Percentage must be at least 0")
                        .max(100, "Tax Percentage can't exceed 100")
                        .required("Tax Percentage is required"),
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
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Employee ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.employeeId}
                                name="employeeId"
                                error={!!touched.employeeId && !!errors.employeeId}
                                helperText={touched.employeeId && errors.employeeId}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Department"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.department}
                                name="department"
                                error={!!touched.department && !!errors.department}
                                helperText={touched.department && errors.department}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="HR">HR</MenuItem>
                                <MenuItem value="Finance">Finance</MenuItem>
                                <MenuItem value="Development">Development</MenuItem>
                                <MenuItem value="Marketing">Marketing</MenuItem>
                                <MenuItem value="Testing">Testing</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Bank Account"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.bankAccount}
                                name="bankAccount"
                                error={!!touched.bankAccount && !!errors.bankAccount}
                                helperText={touched.bankAccount && errors.bankAccount}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Tax ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.taxId}
                                name="taxId"
                                error={!!touched.taxId && !!errors.taxId}
                                helperText={touched.taxId && errors.taxId}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Tax Category"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.taxCategory}
                                name="taxCategory"
                                error={!!touched.taxCategory && !!errors.taxCategory}
                                helperText={touched.taxCategory && errors.taxCategory}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="Exempt">Exempt</MenuItem>
                                <MenuItem value="Standard Rate">Standard Rate</MenuItem>
                                <MenuItem value="Reduced Rate">Reduced Rate</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Tax Percentage"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.taxPercentage}
                                name="taxPercentage"
                                error={!!touched.taxPercentage && !!errors.taxPercentage}
                                helperText={touched.taxPercentage && errors.taxPercentage}
                                sx={{ gridColumn: "span 6" }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="flex-end" mt="20px">
                            <Button type="submit" color="primary" variant="contained">
                                Add Payee
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default AddPayee;
