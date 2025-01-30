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

                const [trendsRes, perfRes, timeRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.ANALYSIS.ANALYZE_RECLAMATION, config),
                    axios.get(API_ENDPOINTS.ANALYSIS.PERFORMANCE_METRICS, config),
                    axios.get(`${API_ENDPOINTS.BASE_URL}/analysis/reclamations/resolution-times`, config)
                ]);

                setTrends(trendsRes.data);
                setPerformance(perfRes.data);
                setResolutionTimes(timeRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des analytics:', error);
                setError("Erreur lors du chargement des données d'analyse");
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const trendsData = {
        labels: trends?.map(t => t.month) || [],
        datasets: [
            {
                label: 'Nombre de Réclamations',
                data: trends?.map(t => t.count) || [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1,
            },
        ],
    };

    const performanceData = {
        labels: performance?.map(p => `${p.nom} ${p.prenom}`) || [],
        datasets: [
            {
                label: 'Réclamations Totales',
                data: performance?.map(p => p.total_reclamations) || [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Réclamations Résolues',
                data: performance?.map(p => p.reclamations_resolues) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const resolutionData = {
        labels: resolutionTimes?.map(r => r.type) || [],
        datasets: [
            {
                label: 'Temps Moyen de Résolution (jours)',
                data: resolutionTimes?.map(r => r.avg_actual_time) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom component="h1">
                Analyse des Réclamations
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tendances des Réclamations
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar data={trendsData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Performance par Utilisateur
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar data={performanceData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Temps de Résolution par Type
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line data={resolutionData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReclamationAnalytics;
