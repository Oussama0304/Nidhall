import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Alert,
    Grid,
    ListItemIcon
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const severityColors = {
    HAUTE: 'error',
    MOYENNE: 'warning',
    FAIBLE: 'success'
};

const priorityIcons = {
    URGENT: <ErrorIcon color="error" />,
    MOYEN: <WarningIcon color="warning" />,
    NORMAL: <CheckCircleIcon color="success" />
};

const ImageAnalysisResult = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <Card sx={{ mt: 2, mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Analyse Technique de l'Image
                </Typography>

                {/* Qualité de l'image */}
                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Qualité de l'Image
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip
                                label={`Qualité: ${analysis.imageQuality.quality}`}
                                color={analysis.imageQuality.isAdequate ? "success" : "warning"}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                label={`Résolution: ${analysis.imageQuality.resolution}`}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Gravité globale */}
                <Box mb={2}>
                    <Alert severity={severityColors[analysis.severity.level]}>
                        Gravité: {analysis.severity.level} - 
                        {analysis.severity.urgentCount} problèmes urgents, 
                        {analysis.severity.mediumCount} problèmes moyens
                    </Alert>
                </Box>

                {/* Problèmes détectés */}
                <Typography variant="subtitle1" gutterBottom>
                    Problèmes Détectés
                </Typography>
                <List>
                    {analysis.technicalAnalysis.issues.map((issue, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemIcon>
                                    {priorityIcons[issue.priority]}
                                </ListItemIcon>
                                <ListItemText
                                    primary={issue.type}
                                    secondary={`Confiance: ${(issue.confidence * 100).toFixed(1)}% - Priorité: ${issue.priority}`}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                {/* Recommandations */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Recommandations de Maintenance
                </Typography>
                <List>
                    {analysis.maintenanceRecommendations.map((rec, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemIcon>
                                    {priorityIcons[rec.priority]}
                                </ListItemIcon>
                                <ListItemText
                                    primary={rec.category}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {rec.action}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Temps estimé: {rec.estimatedTime} minutes
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Expert requis: {rec.requiredExpertise}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default ImageAnalysisResult;
