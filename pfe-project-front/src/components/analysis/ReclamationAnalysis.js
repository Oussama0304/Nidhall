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
    LinearProgress,
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import {
    Sentiment,
    SentimentVeryDissatisfied,
    SentimentDissatisfied,
    SentimentNeutral,
    SentimentSatisfied,
    SentimentVerySatisfied,
    Category,
    Timer,
    PriorityHigh,
    Lightbulb,
} from '@mui/icons-material';

const ReclamationAnalysis = ({ reclamation, analysis, loading }) => {
    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography sx={{ mt: 1 }}>Analyse de la réclamation en cours...</Typography>
            </Box>
        );
    }

    // Vérifier si l'analyse est disponible et a la bonne structure
    if (!analysis || !analysis.text_analysis || !analysis.predictions) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <Typography color="error">
                    Aucune analyse disponible pour cette réclamation.
                </Typography>
            </Box>
        );
    }

    const getSentimentIcon = (score) => {
        if (score <= -0.6) return <SentimentVeryDissatisfied color="error" />;
        if (score <= -0.2) return <SentimentDissatisfied color="warning" />;
        if (score <= 0.2) return <SentimentNeutral color="info" />;
        if (score <= 0.6) return <SentimentSatisfied color="success" />;
        return <SentimentVerySatisfied color="success" />;
    };

    const getSentimentColor = (score) => {
        if (score <= -0.6) return 'error';
        if (score <= -0.2) return 'warning';
        if (score <= 0.2) return 'info';
        return 'success';
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toUpperCase()) {
            case 'HAUTE':
                return 'error';
            case 'MOYEN':
                return 'warning';
            case 'NORMAL':
            default:
                return 'info';
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Grid container spacing={3}>
                {/* Analyse de sentiment */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Analyse de Sentiment
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {getSentimentIcon(analysis.text_analysis.sentiment_score)}
                                <Chip
                                    label={`Score: ${analysis.text_analysis.sentiment_score.toFixed(2)}`}
                                    color={getSentimentColor(analysis.text_analysis.sentiment_score)}
                                    sx={{ ml: 1 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Catégorie et Urgence */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Classification
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Category />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Catégorie"
                                        secondary={analysis.text_analysis.category}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <PriorityHigh />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Urgence"
                                        secondary={analysis.text_analysis.urgency}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Prédictions */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Prédictions et Recommandations
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Timer />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Temps de Résolution Estimé"
                                        secondary={`${analysis.predictions.estimatedTime} heures`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <PriorityHigh />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Priorité Suggérée"
                                        secondary={
                                            <Chip 
                                                label={analysis.predictions.suggestedPriority}
                                                color={getPriorityColor(analysis.predictions.suggestedPriority)}
                                                size="small"
                                            />
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Suggestions AI */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Suggestions d'Actions
                            </Typography>
                            <Timeline>
                                {analysis.predictions.aiSuggestions.map((suggestion, index) => (
                                    <TimelineItem key={index}>
                                        <TimelineSeparator>
                                            <TimelineDot color="primary">
                                                <Lightbulb />
                                            </TimelineDot>
                                            {index < analysis.predictions.aiSuggestions.length - 1 && (
                                                <TimelineConnector />
                                            )}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography>{suggestion}</Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReclamationAnalysis;
