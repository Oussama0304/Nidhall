import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress
} from '@mui/material';
import {
    PhotoCamera,
    CheckCircle,
    Warning,
    Error
} from '@mui/icons-material';

const ImageAnalysisView = ({ analysis, loading }) => {
    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography sx={{ mt: 1 }}>Analyse de l'image en cours...</Typography>
            </Box>
        );
    }

    if (!analysis) {
        return null;
    }

    const getQualityColor = (quality) => {
        switch (quality) {
            case 'BONNE':
                return 'success';
            case 'MOYENNE':
                return 'warning';
            case 'FAIBLE':
                return 'error';
            default:
                return 'default';
        }
    };

    const getQualityIcon = (quality) => {
        switch (quality) {
            case 'BONNE':
                return <CheckCircle color="success" />;
            case 'MOYENNE':
                return <Warning color="warning" />;
            case 'FAIBLE':
                return <Error color="error" />;
            default:
                return <PhotoCamera />;
        }
    };

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Analyse de l'Image
                </Typography>

                <Grid container spacing={3}>
                    {/* Informations techniques */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Informations Techniques
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Format"
                                            secondary={analysis.format}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Dimensions"
                                            secondary={`${analysis.width} x ${analysis.height} pixels`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Taille"
                                            secondary={`${Math.round(analysis.size / 1024)} KB`}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Qualité et Suggestions */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Qualité de l'Image
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ListItemIcon>
                                        {getQualityIcon(analysis.quality)}
                                    </ListItemIcon>
                                    <Chip 
                                        label={analysis.quality}
                                        color={getQualityColor(analysis.quality)}
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Problèmes Suggérés */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Problèmes Potentiels Détectés
                                </Typography>
                                <List dense>
                                    {analysis.suggestedIssues.map((issue, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Warning color="warning" />
                                            </ListItemIcon>
                                            <ListItemText primary={issue} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ImageAnalysisView;
