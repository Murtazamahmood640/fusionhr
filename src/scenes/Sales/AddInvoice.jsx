import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const AddInvoice = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("https://murtaza011-abidipro.mdbgo.io/api/clients");
      if (Array.isArray(response.data)) {
        const clientNames = response.data.map(client => ({
          name: client.clientName,
          id: client._id,
        }));
        setClients(clientNames);
      } else {
        toast.error("Unexpected data format for clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Error fetching clients");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://murtaza011-abidipro.mdbgo.io/api/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        toast.error("Unexpected data format for products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log('Submitting invoice with values:', values); // Log the form values before submission
  
    try {
      console.log('Invoice submission started'); // Log when the submission starts
      const response = await axios.post('https://murtaza011-abidipro.mdbgo.io/api/invoices', values);
      console.log('Invoice submitted successfully:', response.data); // Log the response from the server
      toast.success('Invoice created successfully');
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error creating invoice:', error.response?.data || error.message); // Log the error
      toast.error(error.response?.data?.error || 'Error creating invoice');
    }
  };
  
  

  const calculateTotal = (productList) => {
    return productList.reduce((total, product) => {
      const productDetails = products.find((p) => p._id === product.product);
      if (!productDetails) return total;

      const totalWithoutTax = product.quantity * productDetails.price;
      const taxAmount = (product.tax / 100) * totalWithoutTax;
      const discountAmount = (product.discount / 100) * totalWithoutTax;
      return total + totalWithoutTax + taxAmount - discountAmount;
    }, 0);
  };

  const validationSchema = yup.object().shape({
    client: yup.string().required("Client is required"),
    invoiceDate: yup.date().required("Invoice Date is required"),
    dueDate: yup.date().required("Due Date is required"),
    invoiceNumber: yup.string().required("Invoice Number is required"),
    products: yup
      .array()
      .of(
        yup.object().shape({
          product: yup.string().required("Product is required"),
          quantity: yup
            .number()
            .required("Quantity is required")
            .min(1, "Quantity must be at least 1"),
          tax: yup.number().min(0, "Tax must be positive").optional(),
          discount: yup.number().min(0, "Discount must be positive").optional(),
        })
      )
      .min(1, "At least one product/service is required"),
    totalAmount: yup
      .number()
      .required("Total Amount is required")
      .positive("Amount must be positive"),
  });

  const initialValues = {
    client: "",
    invoiceDate: new Date(),
    dueDate: new Date(),
    invoiceNumber: "",
    products: [],
    totalAmount: 0,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m="20px">
        <Header title="CREATE INVOICE" subtitle="Create a New Invoice" />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
                 {({ values, errors, touched, handleChange, handleBlur, handleSubmit,setFieldValue, isSubmitting }) => (

            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(12, 1fr)"
              >
                <FormControl
                  fullWidth
                  variant="filled"
                  error={touched.client && !!errors.client}
                  sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}
                >
                  <InputLabel>Client</InputLabel>
                  <Select
                    label="Client"
                    name="client"
                    value={values.client}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {clients.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.client && errors.client}
                  </FormHelperText>
                </FormControl>

                <TextField
                  fullWidth
                  variant="filled"
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={values.invoiceNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}
                />
                <Box sx={{ display: "flex", gap: 2, gridColumn: "span 12" }}>
                  <DatePicker
                    label="Invoice Date"
                    value={values.invoiceDate}
                    onChange={(newValue) =>
                      setFieldValue("invoiceDate", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        fullWidth
                        InputProps={{
                          endAdornment: <CalendarTodayIcon />,
                        }}
                      />
                    )}
                    error={touched.invoiceDate && !!errors.invoiceDate}
                    helperText={touched.invoiceDate && errors.invoiceDate}
                  />
                  <DatePicker
                    label="Due Date"
                    value={values.dueDate}
                    onChange={(newValue) => setFieldValue("dueDate", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        fullWidth
                        InputProps={{
                          endAdornment: <CalendarTodayIcon />,
                        }}
                      />
                    )}
                    error={touched.dueDate && !!errors.dueDate}
                    helperText={touched.dueDate && errors.dueDate}
                  />
                </Box>
                <Box sx={{ gridColumn: "span 12" }}>
                  <FieldArray name="products">
                    {({ remove, push }) => (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            push({
                              product: "",
                              quantity: 1,
                              unitPrice: 0,
                              tax: 0,
                              discount: 0,
                            })
                          }
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#424242"
                                : "#f5f5f5",
                            color: (theme) =>
                              theme.palette.mode === "dark" ? "#fff" : "#000",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark" ? "#fff" : "#000",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#333"
                                  : "#e0e0e0",
                            },
                            alignSelf: "center",
                          }}
                        >
                          Add Product
                        </Button>
                        {values.products.map((product, index) => {
                          const productDetails = products.find(
                            (p) => p._id === product.product
                          );
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                gridColumn: "span 12",
                              }}
                            >
                              <FormControl
                                fullWidth
                                variant="filled"
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 4" },
                                }}
                              >
                                <InputLabel>Product/Service</InputLabel>
                                <Select
                                  name={`products.${index}.product`}
                                  value={product.product}
                                  onChange={(e) => {
                                    const selectedProduct = products.find(
                                      (p) => p._id === e.target.value
                                    );
                                    setFieldValue(
                                      `products.${index}.product`,
                                      e.target.value
                                    );
                                    setFieldValue(
                                      `products.${index}.unitPrice`,
                                      selectedProduct ? selectedProduct.price : 0
                                    );
                                  }}
                                >
                                  {products.map((product) => (
                                    <MenuItem
                                      key={product._id}
                                      value={product._id}
                                    >
                                      {product.productName}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>
                                  {touched.products?.[index]?.product &&
                                    errors.products?.[index]?.product}
                                </FormHelperText>
                              </FormControl>
                              <TextField
                                fullWidth
                                variant="filled"
                                label="Quantity"
                                name={`products.${index}.stockQuantity`}
                                type="number"
                                value={product.quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 2" },
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="filled"
                                label="Unit Price"
                                name={`products.${index}.unitPrice`}
                                value={
                                  product.unitPrice ||
                                  (productDetails ? productDetails.price : 0)
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputProps={{ readOnly: true }}
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 2" },
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="filled"
                                label="Tax (%)"
                                name={`products.${index}.tax`}
                                type="number"
                                value={product.tax}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 2" },
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="filled"
                                label="Discount (%)"
                                name={`products.${index}.discount`}
                                type="number"
                                value={product.discount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 2" },
                                }}
                              />
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => remove(index)}
                                sx={{
                                  gridColumn: { xs: "span 12", sm: "span 1" },
                                }}
                              >
                                Remove
                              </Button>
                            </Box>
                          );
                        })}
                      </>
                    )}
                  </FieldArray>
                </Box>
                               {/* Total Amount */}
                               <TextField
                  fullWidth
                  variant="filled"
                  label="Total Amount"
                  name="totalAmount"
                  value={calculateTotal(values.products)}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    gridColumn: "span 12",
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ gridColumn: 'span 12' }}
                disabled={isSubmitting} // Disable the button while submitting
              >
                {isSubmitting ? 'Saving...' : 'Save Invoice'}
              </Button>
              </Box>
            </form>
          )}
        </Formik>
        <ToastContainer />
      </Box>
    </LocalizationProvider>
  );
};

export default AddInvoice;

   