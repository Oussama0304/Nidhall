import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import RouteOptimization from '../components/RouteOptimization';
import { 
  getDeliveryRecommendations, 
  predictDeliveryTime 
} from '../utils/deliveryOptimization';

const DepotDashboard = () => {
  // États existants
  const [commandes, setCommandes] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [selectedStation, setSelectedStation] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCommandes: 0,
    commandesAffectees: 0,
    commandesEnAttente: 0
  });

  // Nouveaux états pour le système intelligent
  const [recommendations, setRecommendations] = useState([]);
  const [optimizationSettings, setOptimizationSettings] = useState({
    prioritizeUrgent: true,
    considerTraffic: true,
    balanceLoad: true
  });
  const [deliveryTimes, setDeliveryTimes] = useState({});

  // Ajout de la localisation du dépôt (à remplacer par vos coordonnées réelles)
  const depotLocation = {
    lat: 36.8065, // Exemple pour Tunis
    lon: 10.1815
  };

  // Effet pour charger les recommandations
  useEffect(() => {
    if (commandes.length > 0 && stations.length > 0) {
      loadRecommendations();
    }
  }, [commandes, stations]);

  // Charger les recommandations
  const loadRecommendations = async () => {
    try {
      const recs = await getDeliveryRecommendations(commandes, stations, depotLocation);
      setRecommendations(recs);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    }
  };

  // Prédire le temps de livraison
  const loadDeliveryTime = async (commande, station) => {
    try {
      const time = await predictDeliveryTime(commande, station, depotLocation);
      setDeliveryTimes(prev => ({
        ...prev,
        [`${commande.id}_${station.id}`]: time
      }));
    } catch (error) {
      console.error('Erreur lors de la prédiction du temps:', error);
    }
  };

  // Gérer le changement des paramètres d'optimisation
  const handleOptimizationChange = (setting, value) => {
    setOptimizationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    loadRecommendations();
  };

  // Afficher le temps de livraison estimé
  const DeliveryTimeChip = ({ commande, station }) => {
    const time = deliveryTimes[`${commande.id}_${station.id}`];
    return time ? (
      <Chip
        icon={<TimerIcon />}
        label={`${Math.round(time)} min`}
        color="primary"
        size="small"
      />
    ) : null;
  };

  // Composant pour les paramètres d'optimisation
  const OptimizationSettings = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Paramètres d'Optimisation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={optimizationSettings.prioritizeUrgent}
                onChange={(e) => handleOptimizationChange('prioritizeUrgent', e.target.checked)}
              />
            }
            label="Prioriser Urgent"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={optimizationSettings.considerTraffic}
                onChange={(e) => handleOptimizationChange('considerTraffic', e.target.checked)}
              />
            }
            label="Considérer Trafic"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={optimizationSettings.balanceLoad}
                onChange={(e) => handleOptimizationChange('balanceLoad', e.target.checked)}
              />
            }
            label="Équilibrer Charges"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  // Tableau des commandes amélioré
  const CommandesTable = () => {
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Aucune commande à afficher
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Référence</TableCell>
              <TableCell>Station Recommandée</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Temps Estimé</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map((rec) => {
              if (!rec?.commande?.idCommande) {
                console.warn('Commande invalide détectée:', rec);
                return null;
              }

              const recommendation = rec.recommendations?.[0];
              const score = recommendation?.score;
              const station = recommendation?.station;

              return (
                <TableRow key={rec.commande.idCommande}>
                  <TableCell>{rec.commande.RefCommande || 'N/A'}</TableCell>
                  <TableCell>
                    {station?.nom ? (
                      <>
                        {station.nom}
                        {score && (
                          <Chip
                            size="small"
                            label={`Score: ${score.toFixed(2)}`}
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </>
                    ) : (
                      <Typography color="error" variant="caption">
                        Aucune station recommandée
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                      {score ? score.toFixed(2) : 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {station && (
                      <DeliveryTimeChip
                        commande={rec.commande}
                        station={station}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAffectation(rec.commande, station)}
                      disabled={!station}
                    >
                      Affecter
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Charger les données initiales
  useEffect(() => {
    fetchData();
  }, []);

  // Mettre à jour les statistiques
  useEffect(() => {
    // Vérifier si une commande a une livraison associée
    const affectees = commandes.filter(c => c.etat === 'En livraison').length;
    const total = commandes.length;
    setStats({
      totalCommandes: total,
      commandesAffectees: affectees,
      commandesEnAttente: total - affectees
    });
  }, [commandes]);

  // Fonction pour rafraîchir toutes les données
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCommandes(),
        fetchStations()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
    setLoading(false);
  };

  // Récupérer les commandes validées
  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filtrer pour ne garder que les commandes avec l'état "Validée"
      const commandesValidees = response.data.filter(cmd => 
        (cmd.etat === 'Validée' || cmd.etat === 'validée' || cmd.etat === 'En livraison')
      );
      console.log('Commandes récupérées:', commandesValidees);
      setCommandes(commandesValidees);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      showAlert('Erreur lors de la récupération des commandes', 'error');
    }
  };

  // Récupérer les stations
  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/stations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des stations:', error);
      showAlert('Erreur lors de la récupération des stations', 'error');
    }
  };

  // Affecter une commande à une station
  const handleAffectation = async (commande, station) => {
    try {
      const token = localStorage.getItem('token');
      
      // Créer la livraison et mettre à jour l'état de la commande en une seule opération
      await axios.post(
        `http://localhost:3000/api/commandes/${commande.idCommande}/livraison`,
        { 
          idStation: station.id,
          etat: 'En livraison'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCommandes();
      setOpenDialog(false);
      showAlert('Commande affectée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'affectation:', error);
      showAlert(error.response?.data?.error || 'Erreur lors de l\'affectation de la commande', 'error');
    }
  };

  // Ouvrir le dialog d'affectation
  const openAffectationDialog = (commande) => {
    setSelectedCommande(commande);
    setSelectedStation('');
    setOpenDialog(true);
  };

  // Afficher une alerte
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  // Composant pour les statistiques
  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Box sx={{ mr: 2 }}>{icon}</Box>
      <Box>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2">{title}</Typography>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de Bord Dépôt
        </Typography>
        <OptimizationSettings />
        <CommandesTable />
      </Box>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Dashboard Dépôt
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            variant="outlined"
          >
            Rafraîchir
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total des Commandes"
              value={stats.totalCommandes}
              icon={<AssignmentIcon fontSize="large" />}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Commandes Affectées"
              value={stats.commandesAffectees}
              icon={<CheckCircleIcon fontSize="large" />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="En Attente d'Affectation"
              value={stats.commandesEnAttente}
              icon={<WarningIcon fontSize="large" />}
              color="#ff9800"
            />
          </Grid>
        </Grid>

        {/* Liste des commandes */}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3, mb: 4 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Référence</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Station</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commandes.map((commande) => (
                  <TableRow key={commande.idCommande} hover>
                    <TableCell>{commande.RefCommande}</TableCell>
                    <TableCell>{new Date(commande.date).toLocaleDateString()}</TableCell>
                    <TableCell>{commande.nomClient || 'Client'}</TableCell>
                    <TableCell>{commande.montant} DT</TableCell>
                    <TableCell>
                      {commande.etat === 'En livraison' ? (
                        <Chip
                          icon={<LocationOnIcon />}
                          label="En livraison"
                          color="primary"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      ) : (
                        <Chip
                          icon={<WarningIcon />}
                          label="Non affectée"
                          color="warning"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LocalShippingIcon />}
                        onClick={() => openAffectationDialog(commande)}
                        disabled={commande.etat === 'En livraison'}
                        sx={{ borderRadius: 1 }}
                      >
                        Affecter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Section d'optimisation des routes */}
        <Box sx={{ mt: 6 }}>
          <RouteOptimization />
        </Box>
      </Box>
      {/* Dialog d'affectation */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          Affecter la commande à une station
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Station</InputLabel>
            <Select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              label="Station"
            >
              {stations.map((station) => (
                <MenuItem key={station.idStation} value={station.idStation}>
                  {station.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleAffectation}
            variant="contained"
            disabled={!selectedStation}
            startIcon={<CheckCircleIcon />}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerte */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DepotDashboard;
