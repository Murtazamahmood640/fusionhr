import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Tooltip, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const validationSchema = yup.object({
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
});

const VendorList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [vendors, setVendors] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [reFetch, setReFetch] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, [reFetch]);

    const fetchVendors = async () => {
        try {
            const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/vendors');
            
            // Ensure each vendor has an 'id' field (use '_id' if available, else fallback to index)
            const vendorsWithIds = response.data.map((vendor, index) => ({
                ...vendor,
                id: vendor._id || index // Use _id if available, else fallback to index
            }));
    
            setVendors(vendorsWithIds);
        } catch (error) {
            toast.error("Failed to fetch vendors");
        }
    };
    

    const handleEditClick = (vendor) => {
        setEditingVendor(vendor);
        setPopupOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/vendors/${id}`);
            setReFetch(!reFetch);
            toast.success("Vendor deleted successfully");
        } catch (error) {
            toast.error("Failed to delete vendor");
        }
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
        setEditingVendor(null);
    };

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
            if (editingVendor) {
                await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/vendors/${editingVendor._id}`, formData);
                toast.success("Vendor updated successfully");
            } else {
                await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/vendors', formData);
                toast.success("Vendor created successfully");
            }
            fetchVendors();
            handlePopupClose();
        } catch (error) {
            toast.error("Failed to save the vendor");
        }
    };

    const columns = [
        {
            field: "vendorName",
            headerName: "Vendor Name",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "vendorType",
            headerName: "Vendor Type",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "contactPerson",
            headerName: "Contact Person",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "contactInformation.phone",
            headerName: "Phone",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => (
                <Tooltip title={params.row.contactInformation?.phone || ''}>
                    <span>{params.row.contactInformation?.phone || ''}</span>
                </Tooltip>
            ),
        },
        {
            field: "serviceProvided",
            headerName: "Service Provided",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Tooltip title={params.row.serviceProvided || ''}>
                    <span>{params.row.serviceProvided || ''}</span>
                </Tooltip>
            ),
        },
        {
            field: "paymentTerms",
            headerName: "Payment Terms",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(params.row._id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="VENDOR LIST" subtitle="Manage Vendors" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none", whiteSpace: 'normal' },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                }}
            >
                <DataGrid
                    rows={vendors}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                />
            </Box>

            <Dialog open={isPopupOpen} onClose={handlePopupClose}>
                <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            vendorName: editingVendor ? editingVendor.vendorName : '',
                            vendorType: editingVendor ? editingVendor.vendorType : '',
                            contactPerson: editingVendor ? editingVendor.contactPerson : '',
                            phone: editingVendor ? editingVendor.contactInformation.phone : '',
                            email: editingVendor ? editingVendor.contactInformation.email : '',
                            address: editingVendor ? editingVendor.contactInformation.address : '',
                            serviceProvided: editingVendor ? editingVendor.serviceProvided : '',
                            contractStartDate: editingVendor ? editingVendor.contractStartDate.slice(0, 10) : '',
                            contractEndDate: editingVendor ? editingVendor.contractEndDate.slice(0, 10) : '',
                            paymentTerms: editingVendor ? editingVendor.paymentTerms : '',
                            notes: editingVendor ? editingVendor.notes : '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <Form onSubmit={handleSubmit}>
                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="vendorName"
                                            label="Vendor Name"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.vendorName}
                                            error={touched.vendorName && Boolean(errors.vendorName)}
                                            helperText={touched.vendorName && errors.vendorName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="vendorType-label">Vendor Type</InputLabel>
                                            <Field
                                                as={Select}
                                                name="vendorType"
                                                labelId="vendorType-label"
                                                id="vendorType"
                                                label="Vendor Type"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.vendorType}
                                                error={touched.vendorType && Boolean(errors.vendorType)}
                                            >
                                                <MenuItem value="Supplier">Supplier</MenuItem>
                                                <MenuItem value="Contractor">Contractor</MenuItem>
                                                <MenuItem value="Consultant">Consultant</MenuItem>
                                            </Field>
                                            {touched.vendorType && errors.vendorType && (
                                                <div style={{ color: 'red' }}>{errors.vendorType}</div>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="contactPerson"
                                            label="Contact Person"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.contactPerson}
                                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                                            helperText={touched.contactPerson && errors.contactPerson}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="phone"
                                            label="Phone"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.phone}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="email"
                                            label="Email"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.email}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="address"
                                            label="Address"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.address}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="serviceProvided"
                                            label="Service Provided"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.serviceProvided}
                                            error={touched.serviceProvided && Boolean(errors.serviceProvided)}
                                            helperText={touched.serviceProvided && errors.serviceProvided}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="contractStartDate"
                                            label="Contract Start Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.contractStartDate}
                                            error={touched.contractStartDate && Boolean(errors.contractStartDate)}
                                            helperText={touched.contractStartDate && errors.contractStartDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="contractEndDate"
                                            label="Contract End Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.contractEndDate}
                                            error={touched.contractEndDate && Boolean(errors.contractEndDate)}
                                            helperText={touched.contractEndDate && errors.contractEndDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="paymentTerms"
                                            label="Payment Terms"
                                            variant="outlined"
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.paymentTerms}
                                            error={touched.paymentTerms && Boolean(errors.paymentTerms)}
                                            helperText={touched.paymentTerms && errors.paymentTerms}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="notes"
                                            label="Notes"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.notes}
                                            error={touched.notes && Boolean(errors.notes)}
                                            helperText={touched.notes && errors.notes}
                                        />
                                    </Grid> */}
                                </Grid>
                                <DialogActions>
                                    <Button onClick={handlePopupClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary">
                                        {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </Box>
    );
};

export default VendorList;
