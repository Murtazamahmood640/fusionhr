import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddExpenses = () => {
    const [vendors, setVendors] = useState([]);  // Ensure vendors is initialized as an array
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // Fetch vendor data from the API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/vendors");
                console.log("Vendors Data:", response.data);  // Log the API response
                if (Array.isArray(response.data)) {
                    setVendors(response.data);  // Ensure it's an array before setting
                } else {
                    console.error("Unexpected API response:", response.data);
                    setVendors([]);
                    // Set an empty array if the response is not what you expect
                }
            } catch (error) {
                console.error("Error fetching vendors:", error);
                toast.error("Failed to load vendors");
            }
        };

        fetchVendors();
    }, []);

    const handleFormSubmit = async (values) => {
        const formData = {
            title: values.title,
            amount: values.amount,
            category: values.category,
            date: values.date,
            description: values.description,
            vendor: values.vendor,
            paymentMethod: values.paymentMethod,
            status: values.status,
        };

        try {
            const response = await axios.post(
                "https://a-khuhro-abidipro.mdbgo.io/api/expenses",
                formData
            );
            console.log("Expense added successfully:", response.data);
            toast.success("Expense added successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while adding the expense";
            console.error("Error adding expense:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <Box m="20px">
            <Header title="ADD EXPENSE" subtitle="Add Expense" />
            <Formik
                initialValues={{
                    title: "",
                    amount: "",
                    category: "",
                    date: "",
                    description: "",
                    vendor: "",
                    paymentMethod: "",
                    status: "",
                }}
                validationSchema={yup.object().shape({
                    title: yup.string().required("Expense Title is required"),
                    amount: yup.number().required("Amount is required").positive("Amount must be positive"),
                    category: yup.string().required("Category is required"),
                    date: yup.date().required("Date is required"),
                    description: yup.string(),
                    vendor: yup.string(),
                    paymentMethod: yup.string().required("Payment Method is required"),
                    status: yup.string().required("Status is required"),
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
                                label="Expense Title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                name="title"
                                error={!!touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.amount}
                                name="amount"
                                error={!!touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Category"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.category}
                                name="category"
                                error={!!touched.category && !!errors.category}
                                helperText={touched.category && errors.category}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="Travel">Travel</MenuItem>
                                <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                                <MenuItem value="Marketing">Marketing</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.date}
                                name="date"
                                InputLabelProps={{ shrink: true }}
                                error={!!touched.date && !!errors.date}
                                helperText={touched.date && errors.date}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Vendor"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.vendor}
                                name="vendor"
                                error={!!touched.vendor && !!errors.vendor}
                                helperText={touched.vendor && errors.vendor}
                                sx={{ gridColumn: "span 6" }}
                            >
                                {vendors.length > 0 ? (
                                    vendors.map((vendor) => (
                                        <MenuItem key={vendor.id} value={vendor.vendorName}>
                                            {vendor.vendorName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No vendors available</MenuItem>
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Payment Method"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.paymentMethod}
                                name="paymentMethod"
                                error={!!touched.paymentMethod && !!errors.paymentMethod}
                                helperText={touched.paymentMethod && errors.paymentMethod}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.status}
                                name="status"
                                error={!!touched.status && !!errors.status}
                                helperText={touched.status && errors.status}
                                sx={{ gridColumn: "span 6" }}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </TextField>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" mt="20px">
                            <Button type="submit" color="primary" variant="contained">
                                Add Expense
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default AddExpenses;

