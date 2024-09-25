import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

// Validation schema using yup
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Bill Title/Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Bill Title/Name must be alphabetic'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be a positive number'),
  dueDate: yup
    .date()
    .required('Due Date is required'),
    // .min(yup.ref('dateOfIssue'), 'Due Date cannot be before Date of Issue'),
  vendor: yup.string().required('Vendor Name is required'),
  category: yup.string().required('Category is required'),
  status: yup.string().required('Status is required'),
});

const AddBill = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  // Form submit handler
  const handleFormSubmit = async (values) => {
    try {
      await axios.post('https://murtaza011-abidipro.mdbgo.io/api/bills', values);
      toast.success('Bill added successfully');
      navigate('/billing/viewbills'); // Redirect to the List of Bills
    } catch (error) {
      console.error('Error adding bill:', error);
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Initial form values
  const initialValues = {
    title: '',
    amount: '',
    dueDate: '',
    vendor: '',
    category: '',
    status: '',
  };

  return (
    <Box m="20px">
      <Header title="ADD BILL" subtitle="Add a New Bill" />
      <Formik
        initialValues={initialValues}
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
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                label="Bill Title/Name"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
                aria-label="Bill Title or Name"
              />

              <TextField
                fullWidth
                variant="filled"
                label="Amount"
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
                aria-label="Bill Amount"
              />

             
              <TextField
                fullWidth
                variant="filled"
                label="Due Date"
                name="dueDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={values.dueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dueDate && !!errors.dueDate}
                helperText={touched.dueDate && errors.dueDate}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
                aria-label="Due Date"
              />

              <TextField
                fullWidth
                variant="filled"
                label="Vendor Name"
                name="vendor"
                value={values.vendor}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.vendor && !!errors.vendor}
                helperText={touched.vendor && errors.vendor}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
                aria-label="Vendor Name"
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && !!errors.category}
                  aria-label="Category"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                  <MenuItem value="Rent">Rent</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                </Select>
                {touched.category && errors.category && (
                  <FormHelperText error>{errors.category}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.status && !!errors.status}
                  aria-label="Status"
                >
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ gridColumn: 'span 12' }}
                aria-label="Save Bill"
              >
                Save Bill
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default AddBill;
