import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme'; // Assuming you have a tokens file for theme-based colors
import Header from '../../components/Header';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    category: '',
    price: '',
    stockQuantity: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch products data from the server
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/products');
        console.log('Products response:', response.data);

        // Add a fallback for rows that don't have an _id
        const productsData = response.data.map((product, index) => ({
          ...product,
          id: product._id || index,  // Fallback to index if _id is not available
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      productId: product.productId,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/products/${selectedProduct._id}`, formData);
      setProducts(products.map((product) =>
        product._id === selectedProduct._id ? { ...product, ...formData } : product
      ));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'productId', headerName: 'Product ID', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'stockQuantity', headerName: 'Stock Quantity', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="View Products" subtitle="Manage list of all Products" />

      <Box
        height="600px"
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            border: 'none',
            color: colors.grey[100],
          },
          '& .MuiDataGrid-cell': {
            padding: '8px',
            fontSize: '12px',
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            borderTop: 'none',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          checkboxSelection
          getRowId={(row) => row.id} // Using id instead of _id to avoid errors
        />
      </Box>

      {/* Update Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Product ID"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
