// ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Grid } from '@mui/material'; // MUI for styling

const ProjectDetails = () => {
  const { projectId } = useParams(); // Get projectId from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`); // Fetch project details using the ID
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {project.projectName} Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Project Lead: {project.lead}</Typography>
          <Typography variant="body1">
            Start Date: {new Date(project.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            End Date: {new Date(project.endDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">Budget: ${project.budget}</Typography>
          <Typography variant="body1">Description: {project.description}</Typography>
          <Typography variant="h6" gutterBottom>
            Milestones:
          </Typography>
          {project.milestones.length > 0 ? (
            <Grid container spacing={2}>
              {project.milestones.map((milestone, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="body1">
                        <strong>{milestone.name}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">{milestone.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No milestones available.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
