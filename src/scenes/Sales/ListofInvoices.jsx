import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Box, Typography, useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { tokens } from '../../theme'; 
import WatermarkImage from "../Sales/watermark.png"; 
import Header from '../../components/Header';

const ListofInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [employee, setEmployee] = useState({ name: '', email: '' });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchEmployeeData();
    fetchInvoices();
  }, []);

  const fetchEmployeeData = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    const name = data.name;
    const email = data.email;
    if (name && email) {
      setEmployee({ name, email });
    } else {
      toast.error("Employee information not found");
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/invoices");
      console.log("Invoices Data:", response);
      const invoicesData = response.data.map((invoice, index) => ({
        ...invoice,
        id: invoice._id || index, // Fallback to index if _id is missing
      }));
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Error fetching invoices");
    }
  };

  const handleViewPDF = (invoice) => {
    try {
      const doc = new jsPDF();

      const img = new Image();
      img.src = WatermarkImage;
      doc.addImage(img, 'PNG', 160, 10, 40, 40);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Abidi Solutions", 15, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Email: info@abidisolutions.com", 15, 28);
      doc.text("Address: Maryland, USA", 15, 36);

      doc.setDrawColor(0, 0, 0);
      doc.line(15, 45, 195, 45);

      doc.setFontSize(14);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 15, 55);
      doc.text(`Client: ${invoice.client.clientName}`, 15, 63);
      doc.text(`Recipient Name: ${employee.name || "N/A"}`, 15, 71);
      doc.text(`Recipient Email: ${employee.email || "N/A"}`, 15, 79);

      autoTable(doc, {
        startY: 90,
        head: [["Product Name", "Quantity", "Unit Price", "Tax (%)", "Discount (%)", "Total"]],
        body: invoice.products.map((product) => [
          product.product.productName,
          product.quantity,
          `$${product.unitPrice.toFixed(2)}`,
          `${product.tax}%`,
          `${product.discount}%`,
          `$${(
            product.quantity * product.unitPrice * (1 + product.tax / 100) -
            product.quantity * product.unitPrice * (product.discount / 100)
          ).toFixed(2)}`
        ]),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 11, halign: "center" },
        columnStyles: { 0: { halign: "left" }, 5: { halign: "right" } },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text(`Total Quotation: $${invoice.totalAmount.toFixed(2)}`, 15, finalY);

      doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/invoices/${id}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  const columns = [
    { field: "invoiceNumber", headerName: "Invoice Number", flex: 1 },
    {
      field: "client",
      headerName: "Client",
      flex: 1,
      valueGetter: (params) => params.row.client ? params.row.client.clientName : "No Client Assigned",
    },
    { field: "totalProducts", headerName: "No of Products", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => handleViewPDF(params.row)}>
            Download PDF
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row._id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="View Invoices" subtitle="Manage list of invoices" />

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
            alignItems: 'center',
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
          rows={invoices} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          getRowId={(row) => row.id} // Use `id` instead of `_id`
        />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ListofInvoices;
