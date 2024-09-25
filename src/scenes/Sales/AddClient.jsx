import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';

const AddClient = () => {
  const validationSchema = yup.object().shape({
    clientName: yup.string().required('Client Name is required').matches(/^[a-zA-Z\s]+$/, 'Client Name must be alphabetic'),
    clientId: yup.string().required('Client ID is required').matches(/^[a-zA-Z0-9]+$/, 'Client ID must be alphanumeric'),
    contactNumber: yup.string().required('Contact Number is required').matches(/^[0-9]{10}$/, 'Invalid phone number'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    address: yup.string().required('Address is required'),
    companyName: yup.string().matches(/^[a-zA-Z\s]*$/, 'Company Name must be alphabetic').optional(),
    billingAddress: yup.string().required('Billing Address is required'),
    shippingAddress: yup.string().optional(),
    taxId: yup.string().required('Tax ID is required'),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log('Submitting form with values:', values); // Log the form values before submission

    try {
      console.log('Form submission started'); // Log when the submission starts
      const response = await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/clients', values);
      console.log('Form submitted successfully:', response.data); // Log the response from the server
      toast.success('Client added successfully');
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error adding client:', error.response?.data || error.message); // Log the error
      toast.error(error.response?.data?.error || 'Error adding client');
    }
  };
  

  const initialValues = {
    clientName: '',
    clientId: '',
    contactNumber: '',
    email: '',
    address: '',
    companyName: '',
    billingAddress: '',
    shippingAddress: '',
    taxId: '',
  };

  return (
    <Box m="20px">
      <Header title="ADD CLIENT" subtitle="Add a New Client" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                label="Client Name"
                name="clientName"
                value={values.clientName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.clientName && !!errors.clientName}
                helperText={touched.clientName && errors.clientName}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Client ID"
                name="clientId"
                value={values.clientId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.clientId && !!errors.clientId}
                helperText={touched.clientId && errors.clientId}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Contact Number"
                name="contactNumber"
                value={values.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contactNumber && !!errors.contactNumber}
                helperText={touched.contactNumber && errors.contactNumber}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Company Name"
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyName && !!errors.companyName}
                helperText={touched.companyName && errors.companyName}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Billing Address"
                name="billingAddress"
                value={values.billingAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.billingAddress && !!errors.billingAddress}
                helperText={touched.billingAddress && errors.billingAddress}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Shipping Address"
                name="shippingAddress"
                value={values.shippingAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shippingAddress && !!errors.shippingAddress}
                helperText={touched.shippingAddress && errors.shippingAddress}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Tax ID"
                name="taxId"
                value={values.taxId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.taxId && !!errors.taxId}
                helperText={touched.taxId && errors.taxId}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ gridColumn: 'span 12' }}
                disabled={isSubmitting} // Disable the button while submitting
              >
                {isSubmitting ? 'Saving...' : 'Save Client'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default AddClient;
