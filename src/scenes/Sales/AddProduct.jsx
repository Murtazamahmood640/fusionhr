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
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';

const AddProduct = () => {
  // Validation schema using yup
  const validationSchema = yup.object().shape({
    productName: yup.string().required('Product Name is required').matches(/^[a-zA-Z\s]+$/, 'Product Name must be alphabetic'),
    productId: yup.string().required('Product ID is required').matches(/^[a-zA-Z0-9]+$/, 'Product ID must be alphanumeric'),
    category: yup.string().optional(),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    stockQuantity: yup.number().optional().positive('Stock Quantity must be a positive number'),
  });

  // Form submit handler
  const handleFormSubmit = async (values) => {
    try {
      await axios.post('https://murtaza011-abidipro.mdbgo.io/api/products', values);
      toast.success('Product added successfully');
      window.location.href = '/sales/viewproduct'; // Redirect to the List of Products
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    }
  };

  // Initial form values
  const initialValues = {
    productName: '',
    productId: '',
    category: '',
    price: '',
    stockQuantity: '',
  };

  return (
    <Box m="20px">
      <Header title="ADD PRODUCT" subtitle="Add a New Product" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                label="Product Name"
                name="productName"
                value={values.productName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.productName && !!errors.productName}
                helperText={touched.productName && errors.productName}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Product ID"
                name="productId"
                value={values.productId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.productId && !!errors.productId}
                helperText={touched.productId && errors.productId}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <FormControl fullWidth variant="filled" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && !!errors.category}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                </Select>
                {touched.category && errors.category && (
                  <FormHelperText error>{errors.category}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                label="Price"
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={values.stockQuantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.stockQuantity && !!errors.stockQuantity}
                helperText={touched.stockQuantity && errors.stockQuantity}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ gridColumn: 'span 12' }}
              >
                Save Product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default AddProduct;
