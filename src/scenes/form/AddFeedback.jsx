import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sentiment from 'sentiment';
import { Bar, Pie } from 'react-chartjs-2';
import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Feedback.css'; // Import the CSS file
 
// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
 
// Define initial values and validation schema
const initialValues = {
  subject: '',
  feedback: '',
};
 
const feedbackSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  feedback: yup.string().min(10, 'Feedback must be at least 10 characters long').required('Required'),
});
 
const Feedback = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const sentimentChartRef = useRef(null);
  const subcategoriesChartRef = useRef(null);
 
  const MIN_FEEDBACK_LENGTH = 10;
 
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('feedbackHistory')) || [];
    setFeedbackHistory(storedHistory);
  }, []);
 
  const analyzeSentiment = (text) => {
    const sentimentAnalyzer = new Sentiment();
    const result = sentimentAnalyzer.analyze(text);
    if (result.score > 0) return 'Positive';
    if (result.score < 0) return 'Negative';
    return 'Neutral';
  };
 
  const categorizeFeedback = (text) => {
    const categories = {
      UI: ['ui', 'interface', 'design', 'layout'],
      Functionality: ['functionality', 'feature', 'bug', 'error'],
      Management: ['management', 'admin', 'leadership'],
      'Employee Behavior': ['employee', 'staff', 'service', 'behavior']
    };
 
    for (const category in categories) {
      for (const keyword of categories[category]) {
        if (text.toLowerCase().includes(keyword)) {
          return category;
        }
      }
    }
    return 'General';
  };
 
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage('');
 
    if (values.feedback.length < MIN_FEEDBACK_LENGTH) {
      setErrorMessage(`Feedback must be at least ${MIN_FEEDBACK_LENGTH} characters long.`);
      setSubmitting(false);
      return;
    }
 
    const feedbackSentiment = analyzeSentiment(values.feedback);
    const feedbackCategory = categorizeFeedback(values.feedback);
 
    const payload = {
      subject: values.subject,
      feedback: values.feedback,
      sentiment: feedbackSentiment,
      sentimentScore: feedbackSentiment === 'Positive' ? 1 : (feedbackSentiment === 'Negative' ? -1 : 0),
      category: feedbackCategory
    };
 
    try {
      console.log("Submitting feedback:", payload); // Log payload
      const response = await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/feedback', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
 
      console.log("Response from server:", response); // Log response
      alert('Feedback submitted successfully');
 
      const newFeedback = { ...payload };
      const updatedHistory = [...feedbackHistory, newFeedback];
      setFeedbackHistory(updatedHistory);
      localStorage.setItem('feedbackHistory', JSON.stringify(updatedHistory));
 
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error.response ? error.response.data : error.message); // Log detailed error
      if (error.response) {
        setErrorMessage(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };
 
  const clearAllHistory = () => {
    setFeedbackHistory([]);
    localStorage.removeItem('feedbackHistory');
  };
 
  const downloadFeedbackHistory = () => {
    const doc = new jsPDF();
    let yOffset = 10;
 
    feedbackHistory.forEach((item, index) => {
      doc.text(`Feedback ${index + 1}`, 10, yOffset);
      doc.text(`Subject: ${item.subject}`, 10, yOffset + 10);
      doc.text(`Feedback: ${item.feedback}`, 10, yOffset + 20);
      doc.text(`Sentiment: ${item.sentiment} (Score: ${item.sentimentScore})`, 10, yOffset + 30);
      yOffset += 40;
 
      if (yOffset > 270) { // Move to the next page if content overflows
        doc.addPage();
        yOffset = 10;
      }
    });
 
    doc.save('feedback_history.pdf');
  };
 
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [
        feedbackHistory.filter(f => f.sentiment === 'Positive').length,
        feedbackHistory.filter(f => f.sentiment === 'Neutral').length,
        feedbackHistory.filter(f => f.sentiment === 'Negative').length,
      ],
      backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
    }]
  };
 
  const categorizedData = {
    labels: ['UI', 'Functionality', 'Management', 'Employee Behavior'],
    datasets: [
      {
        label: 'Positive',
        data: [
          feedbackHistory.filter(f => f.sentiment === 'Positive' && f.category === 'UI').length,
          feedbackHistory.filter(f => f.sentiment === 'Positive' && f.category === 'Functionality').length,
          feedbackHistory.filter(f => f.sentiment === 'Positive' && f.category === 'Management').length,
          feedbackHistory.filter(f => f.sentiment === 'Positive' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#4caf50',
      },
      {
        label: 'Neutral',
        data: [
          feedbackHistory.filter(f => f.sentiment === 'Neutral' && f.category === 'UI').length,
          feedbackHistory.filter(f => f.sentiment === 'Neutral' && f.category === 'Functionality').length,
          feedbackHistory.filter(f => f.sentiment === 'Neutral' && f.category === 'Management').length,
          feedbackHistory.filter(f => f.sentiment === 'Neutral' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#ffeb3b',
      },
      {
        label: 'Negative',
        data: [
          feedbackHistory.filter(f => f.sentiment === 'Negative' && f.category === 'UI').length,
          feedbackHistory.filter(f => f.sentiment === 'Negative' && f.category === 'Functionality').length,
          feedbackHistory.filter(f => f.sentiment === 'Negative' && f.category === 'Management').length,
          feedbackHistory.filter(f => f.sentiment === 'Negative' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#f44336',
      }
    ]
  };
 
  return (
    <Box m="20px">
      <Header title="FEEDBACK" subtitle="Provide your valuable feedback" />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={feedbackSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(12, 1fr)"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
              }}
            >
              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                type="text"
                label="Subject"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.subject}
                name="subject"
                error={!!touched.subject && !!errors.subject}
                helperText={touched.subject && errors.subject}
                sx={{ gridColumn: "span 12" }}
              />
              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                type="text"
                label="Feedback"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.feedback}
                name="feedback"
                error={!!touched.feedback && !!errors.feedback}
                helperText={touched.feedback && errors.feedback}
                sx={{ gridColumn: "span 12" }}
                inputProps={{ minLength: MIN_FEEDBACK_LENGTH }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained" sx={{ backgroundColor: '#007BFF' }} disabled={isSubmitting}>
                Submit Feedback
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Button
        onClick={() => setShowHistory(!showHistory)}
        sx={{ mt: 2, backgroundColor: showHistory ? '#f50057' : '#4caf50', color: '#ffffff', '&:hover': { backgroundColor: showHistory ? '#c51162' : '#388e3c' } }}>
        {showHistory ? 'Hide Feedback History' : 'Show Feedback History'}
      </Button>
      {showHistory && (
        <Box mt={2}>
          <ul>
            {feedbackHistory.map((item, index) => (
              <li key={index}>
                <p>Subject: {item.subject}</p>
                <p>Feedback: {item.feedback}</p>
                <p>Sentiment: {item.sentiment} (Score: {item.sentimentScore})</p>
              </li>
            ))}
          </ul>
          <Button onClick={clearAllHistory} variant="contained" color="error" sx={{ mt: 2 }}>
            Clear All History
          </Button>
          <Button onClick={downloadFeedbackHistory} variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
            Download Feedback History
          </Button>
        </Box>
      )}
      <div className='Char-size'>
          <div className="chart-container" ref={sentimentChartRef}>
          <h4>Sentiment Distribution</h4>
            <Pie
              data={sentimentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                layout: {
                  padding: {
                    top: 10,
                    bottom: 10,
                  },
                },
              }}
            />
          </div>
          <div className="chart-container" ref={subcategoriesChartRef}>
          <h4>Subcategories Distribution</h4>
            <Bar
              data={categorizedData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                layout: {
                  padding: {
                    top: 10,
                    bottom: 10,
                  },
                },
              }}
            />
          </div>
      </div>
    </Box>
  );
};
 
export default Feedback;