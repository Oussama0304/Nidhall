import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    CircularProgress
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ReclamationAnalytics = () => {
    const [trends, setTrends] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [resolutionTimes, setResolutionTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const [trendsRes, performanceRes, resolutionTimesRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.ANALYTICS.TRENDS, config),
                    axios.get(API_ENDPOINTS.ANALYTICS.PERFORMANCE, config),
                    axios.get(API_ENDPOINTS.ANALYTICS.RESOLUTION_TIMES, config)
                ]);

                setTrends(trendsRes.data);
                setPerformance(performanceRes.data);
                setResolutionTimes(resolutionTimesRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Erreur lors de la récupération des données analytiques');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const trendsData = {
        labels: trends?.map(t => t.month) || [],
        datasets: [
            {
                label: 'Total',
                data: trends?.map(t => t.total) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'En cours',
                data: trends?.map(t => t.en_cours) || [],
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1
            },
            {
                label: 'Résolu',
                data: trends?.map(t => t.resolu) || [],
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }
        ]
    };

    const resolutionTimesData = {
        labels: resolutionTimes?.map(r => r.type) || [],
        datasets: [{
            label: 'Temps moyen de résolution (heures)',
            data: resolutionTimes?.map(r => r.avg_resolution_time) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }]
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Analytique des Réclamations
            </Typography>

            <Grid container spacing={3}>
                {/* Performance Metrics */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Métriques de Performance
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    Temps moyen de résolution
                                </Typography>
                                <Typography variant="h4">
                                    {performance?.avg_resolution_time?.toFixed(1) || 0} heures
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    Taux de résolution
                                </Typography>
                                <Typography variant="h4">
                                    {performance?.resolution_rate?.toFixed(1) || 0}%
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1">
                                    Total des réclamations
                                </Typography>
                                <Typography variant="h4">
                                    {performance?.total_reclamations || 0}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Trends Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tendances des Réclamations
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line
                                data={trendsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Tendances sur 6 mois'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Resolution Times Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Temps de Résolution par Type
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar
                                data={resolutionTimesData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Temps moyen de résolution par type de réclamation'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReclamationAnalytics;
