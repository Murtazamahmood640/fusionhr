import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPayment = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [payees, setPayees] = useState([]);  // Initialize as an array

    useEffect(() => {
        // Fetch the list of payees from the backend
        const fetchPayees = async () => {
            try {
                const response = await axios.get("https://murtaza011-abidipro.mdbgo.io/api/payees");
                console.log("Payees Data:", response.data); // Log the API response
                if (Array.isArray(response.data)) {
                    setPayees(response.data);  // Ensure it's an array before setting
                } else {
                    console.error("Unexpected API response:", response.data);
                    setPayees([]);  // Set an empty array if the response is not what you expect
                }
            } catch (error) {
                console.error("Error fetching payees:", error);
                toast.error("Error fetching payees");
            }
        };

        fetchPayees();
    }, []);

    const handleFormSubmit = async (values) => {
        const formData = {
            payee: values.payee,
            paymentAmount: values.paymentAmount,
            paymentDate: values.paymentDate,
            paymentMethod: values.paymentMethod,
            deductions: values.deductions,
            bonuses: values.bonuses,
        };
        console.log("Form Data: ", formData);
        try {
            const response = await axios.post(
                "https://murtaza011-abidipro.mdbgo.io/api/payments",
                formData
            );
            console.log("Payment added successfully:", response.data);
            toast.success("Payment added successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while adding the payment";
            console.error("Error adding payment:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <Box m="20px">
            <Header title="ADD PAYMENT" subtitle="Record a new payment" />
            <Formik
                initialValues={{
                    payee: "",
                    paymentAmount: "",
                    paymentDate: "",
                    paymentMethod: "",
                    deductions: "",
                    bonuses: "",
                }}
                validationSchema={yup.object().shape({
                    payee: yup.string().required("Payee is required"),
                    paymentAmount: yup
                        .number()
                        .min(0, "Payment Amount must be at least 0")
                        .required("Payment Amount is required"),
                    paymentDate: yup.date().required("Payment Date is required"),
                    paymentMethod: yup.string().required("Payment Method is required"),
                    deductions: yup
                        .number()
                        .min(0, "Deductions must be at least 0")
                        .optional(),
                    bonuses: yup
                        .number()
                        .min(0, "Bonuses must be at least 0")
                        .optional(),
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
                            <FormControl fullWidth sx={{ gridColumn: "span 6" }}>
                                <InputLabel>Payee</InputLabel>
                                <Select
                                    fullWidth
                                    variant="filled"
                                    label="Payee"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.payee}
                                    name="payee"
                                    error={!!touched.payee && !!errors.payee}
                                    helperText={touched.payee && errors.payee}
                                >
                                    {Array.isArray(payees) && payees.length > 0 ? (
                                        payees.map((payee) => (
                                            <MenuItem key={payee._id} value={payee._id}>
                                                {payee.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No payees available</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Payment Amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.paymentAmount}
                                name="paymentAmount"
                                error={!!touched.paymentAmount && !!errors.paymentAmount}
                                helperText={touched.paymentAmount && errors.paymentAmount}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Payment Date"
                                InputLabelProps={{ shrink: true }}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.paymentDate}
                                name="paymentDate"
                                error={!!touched.paymentDate && !!errors.paymentDate}
                                helperText={touched.paymentDate && errors.paymentDate}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <FormControl fullWidth sx={{ gridColumn: "span 6" }}>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    fullWidth
                                    variant="filled"
                                    label="Payment Method"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.paymentMethod}
                                    name="paymentMethod"
                                    error={!!touched.paymentMethod && !!errors.paymentMethod}
                                    helperText={touched.paymentMethod && errors.paymentMethod}
                                >
                                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Deductions"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.deductions}
                                name="deductions"
                                error={!!touched.deductions && !!errors.deductions}
                                helperText={touched.deductions && errors.deductions}
                                sx={{ gridColumn: "span 6" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Bonuses"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.bonuses}
                                name="bonuses"
                                error={!!touched.bonuses && !!errors.bonuses}
                                helperText={touched.bonuses && errors.bonuses}
                                sx={{ gridColumn: "span 6" }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="flex-end" mt="20px">
                            <Button type="submit" color="primary" variant="contained">
                                Add Payment
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <ToastContainer />
        </Box>
    );
};

export default AddPayment;
