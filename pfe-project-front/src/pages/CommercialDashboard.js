import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Menu,
  Snackbar,
  Alert,
  Drawer,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Warning,
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  Settings,
  LocalShipping,
  LocationOn,
  AccessTime,
  Check,
  Event,
  EuroSymbol,
  Assessment,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import ImageAnalysisResult from '../components/ImageAnalysisResult';
import ReclamationAnalysis from '../components/analysis/ReclamationAnalysis';
import ReclamationDetailsDialog from '../components/ReclamationDetailsDialog';
import imageAnalysisService from '../services/imageAnalysis.service';
import api from '../services/api.config';
import { API_URL } from '../config';

const CommercialDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const [reclamationDetailsOpen, setReclamationDetailsOpen] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedImageAnalysis, setSelectedImageAnalysis] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalReclamations: 0,
    resolvedToday: 0,
    averageResolutionTime: 0,
    resolutionRate: 0,
    reclamationsByStatus: {},
    reclamationsByType: {},
    weeklyTrends: []
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: 'all',
    priority: 'all',
    status: 'all',
    type: 'all',
    assignedTo: 'all'
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem('token');

  const [showAnalysis, setShowAnalysis] = useState(false);

  const filterOptions = {
    dateRange: [
      { value: 'all', label: 'Toutes les périodes' },
      { value: 'today', label: 'Aujourd\'hui' },
      { value: 'week', label: 'Cette semaine' },
      { value: 'month', label: 'Ce mois' }
    ],
    priority: [
      { value: 'all', label: 'Toutes les priorités' },
      { value: 'URGENT', label: 'Urgent' },
      { value: 'MOYEN', label: 'Moyen' },
      { value: 'FAIBLE', label: 'Faible' }
    ],
    status: [
      { value: 'all', label: 'Tous les statuts' },
      { value: 'En instance', label: 'En instance' },
      { value: 'En cours', label: 'En cours' },
      { value: 'Validée', label: 'Validée' },
      { value: 'Rejetée', label: 'Rejetée' }
    ],
    type: [
      { value: 'all', label: 'Tous les types' },
      { value: 'COMMERCIALE', label: 'Commerciale' },
      { value: 'TECHNIQUE', label: 'Technique' }
    ]
  };

  const priorityColors = {
    'URGENT': 'error',
    'MOYEN': 'warning',
    'FAIBLE': 'success'
  };

  const statusColors = {
    'En instance': 'warning',
    'Validée': 'success',
    'En cours': 'info',
    'Rejetée': 'error',
  };

  const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return (
      compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear()
    );
  };

  const initializeTodayNotifications = (reclamationsList) => {
    const todayNotifications = reclamationsList
      .filter(rec => isToday(rec.date))
      .map(rec => ({
        id: rec.idReclamation,
        timestamp: new Date(rec.date),
        read: false,
        message: `Nouvelle réclamation #${rec.idReclamation} - ${rec.type}`,
        severity: 'info',
        title: 'Réclamation du jour',
        details: `Type: ${rec.type}, État: ${rec.etat}`
      }));

    setNotifications(todayNotifications);
    setUnreadCount(todayNotifications.length);
  };

  useEffect(() => {
    if (reclamations.length > 0) {
      initializeTodayNotifications(reclamations);
    }
  }, [reclamations]);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showNotification = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const addNotification = (notification) => {
    if (isToday(notification.timestamp || new Date())) {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date(),
        read: false,
        ...notification
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showNotification(notification.message, notification.severity);
    }
  };

  const handleStatusChange = (item, newStatus, itemType) => {
    const message = itemType === 'commande' 
      ? `La commande #${item.RefCommande} a été ${newStatus.toLowerCase()}`
      : `La réclamation #${item.idReclamation} a été ${newStatus.toLowerCase()}`;
    
    addNotification({
      message,
      severity: newStatus === 'Validée' ? 'success' : 
               newStatus === 'Rejetée' ? 'error' : 'info',
      title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} mise à jour`,
      details: `Statut changé à ${newStatus}`
    });
  };

  useEffect(() => {
    // Connexion Socket.IO
    const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      cors: {
        origin: socketUrl,
        methods: ["GET", "POST"]
      }
    });
    setSocket(newSocket);

    // Écouter les nouvelles commandes
    newSocket.on('nouvelle-commande', (commande) => {
      console.log('Nouvelle commande reçue:', commande);
      addNotification({
        message: `Nouvelle commande #${commande.RefCommande} reçue`,
        severity: 'info',
        title: 'Nouvelle Commande',
        details: `Date: ${new Date(commande.date).toLocaleDateString()}`
      });
      fetchCommandes();
    });

    // Écouter les nouvelles réclamations
    newSocket.on('nouvelle-reclamation', (reclamation) => {
      console.log('Nouvelle réclamation reçue:', reclamation);
      addNotification({
        message: `Nouvelle réclamation #${reclamation.idReclamation} reçue`,
        severity: 'info',
        title: 'Nouvelle Réclamation',
        details: `Type: ${reclamation.type}`
      });
      fetchReclamations();
    });

    // Charger les réclamations au démarrage
    fetchReclamations();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Socket.IO event listeners for notifications
    if (socket) {
      socket.on('statusUpdate', ({ item, newStatus, itemType }) => {
        handleStatusChange(item, newStatus, itemType);
      });

      socket.on('newReclamation', (reclamation) => {
        addNotification({
          message: `Nouvelle réclamation #${reclamation.idReclamation} reçue`,
          severity: 'info',
          title: 'Nouvelle Réclamation',
          details: `Type: ${reclamation.type}`
        });
      });

      socket.on('newCommande', (commande) => {
        addNotification({
          message: `Nouvelle commande #${commande.RefCommande} reçue`,
          severity: 'info',
          title: 'Nouvelle Commande',
          details: `Date: ${new Date(commande.date).toLocaleDateString()}`
        });
      });

      return () => {
        socket.off('statusUpdate');
        socket.off('newReclamation');
        socket.off('newCommande');
      };
    }
  }, [socket]);

  useEffect(() => {
    // Mettre à jour les analytics quand les réclamations changent
    if (reclamations.length > 0) {
      fetchAnalytics();
    }
  }, [reclamations]);

  const fetchReclamations = async () => {
    try {
      setLoading(true);
      console.log('Fetching reclamations...');
      const response = await api.get('/reclamations/user');
      console.log('Reclamations received:', response.data);
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réclamations:', error);
      showNotification('Erreur lors de la récupération des réclamations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReclamationClick = (reclamation) => {
    console.log('Réclamation sélectionnée:', reclamation); // Debug log
    setSelectedReclamation(reclamation);
    setReclamationDetailsOpen(true);
  };

  const fetchRecommendations = async (reclamationId) => {
    try {
      const response = await api.get(`/recommendations/${reclamationId}`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      setNotification({
        message: 'Erreur lors de la récupération des recommandations',
        severity: 'error'
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Calculer les analytics à partir des réclamations existantes
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const resolvedToday = reclamations.filter(rec => {
        const recDate = new Date(rec.dateResolution);
        recDate.setHours(0, 0, 0, 0);
        return recDate.getTime() === today.getTime() && rec.etat === 'Validée';
      }).length;

      const reclamationsByStatus = reclamations.reduce((acc, rec) => {
        acc[rec.etat] = (acc[rec.etat] || 0) + 1;
        return acc;
      }, {});

      const reclamationsByType = reclamations.reduce((acc, rec) => {
        acc[rec.type] = (acc[rec.type] || 0) + 1;
        return acc;
      }, {});

      // Calculer le temps moyen de résolution
      const resolvedReclamations = reclamations.filter(rec => rec.etat === 'Validée' && rec.dateResolution);
      const totalResolutionTime = resolvedReclamations.reduce((acc, rec) => {
        const creationDate = new Date(rec.date);
        const resolutionDate = new Date(rec.dateResolution);
        const hours = (resolutionDate - creationDate) / (1000 * 60 * 60);
        return acc + hours;
      }, 0);

      const averageResolutionTime = resolvedReclamations.length > 0 
        ? (totalResolutionTime / resolvedReclamations.length).toFixed(1)
        : 0;

      // Calculer le taux de résolution
      const resolutionRate = reclamations.length > 0
        ? ((resolvedReclamations.length / reclamations.length) * 100).toFixed(1)
        : 0;

      // Mettre à jour les analytics
      setAnalytics({
        totalReclamations: reclamations.length,
        resolvedToday,
        averageResolutionTime,
        resolutionRate,
        reclamationsByStatus,
        reclamationsByType,
        weeklyTrends: [] // À implémenter si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors du calcul des analytics:', error);
      setNotification({
        message: 'Erreur lors du calcul des analytics',
        severity: 'error'
      });
    }
  };

  const fetchCommandes = async () => {
    try {
      const response = await api.get('/commandes');
      setCommandes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setNotification({
        message: 'Erreur lors du chargement des commandes',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    const fetchCommandesData = async () => {
      try {
        const response = await api.get('/commandes');
        setCommandes(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      }
    };

    const fetchReclamationsData = async () => {
      try {
        const response = await api.get('/reclamations');
        setReclamations(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des réclamations:', error);
      }
    };

    fetchUserData();
    fetchCommandesData();
    fetchReclamationsData();

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    handleFilterClose();
  };

  const handleAdvancedFilterChange = (filterType, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyAdvancedFilters = (items) => {
    return items.filter(item => {
      // Filter by date range
      if (advancedFilters.dateRange !== 'all') {
        const itemDate = new Date(item.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch (advancedFilters.dateRange) {
          case 'today':
            if (itemDate < today) return false;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (itemDate < monthAgo) return false;
            break;
          default:
            break;
        }
      }

      // Debug logs for status filtering
      console.log('Item status:', item.etat);
      console.log('Filter status:', advancedFilters.status);
      console.log('Status match:', item.etat === advancedFilters.status);

      // Filter by status
      if (advancedFilters.status !== 'all') {
        const statusMatch = item.etat === advancedFilters.status;
        if (!statusMatch) {
          return false;
        }
      }

      // Debug logs for priority filtering
      console.log('Item priority:', item.priority);
      console.log('Filter priority:', advancedFilters.priority);
      console.log('Priority match:', item.priority === advancedFilters.priority);

      // Filter by priority
      if (advancedFilters.priority !== 'all') {
        const priorityMatch = item.priority === advancedFilters.priority;
        if (!priorityMatch) {
          return false;
        }
      }

      return true;
    });
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleCommandeClick = (commande) => {
    setSelectedCommande(commande);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = async (commandeId, newStatus) => {
    try {
      await api.put(`/commandes/${commandeId}/status`, { etat: newStatus });
      
      const updatedCommande = commandes.find(cmd => cmd.idCommande === commandeId);
      setCommandes(prev => prev.map(cmd => 
        cmd.idCommande === commandeId ? { ...cmd, etat: newStatus } : cmd
      ));

      // Trigger notification
      handleStatusChange(updatedCommande, newStatus, 'commande');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      showNotification('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleUpdateReclamationStatus = async (reclamationId, newStatus) => {
    try {
      await api.put(`/reclamations/${reclamationId}/status`, { etat: newStatus });
      
      const updatedReclamation = reclamations.find(rec => rec.idReclamation === reclamationId);
      setReclamations(prev => prev.map(rec => 
        rec.idReclamation === reclamationId ? { ...rec, etat: newStatus } : rec
      ));

      // Trigger notification
      handleStatusChange(updatedReclamation, newStatus, 'reclamation');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      showNotification('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleViewImage = async (claim) => {
    try {
      setAnalysisLoading(true);
      const response = await axios.get(`${API_URL}/reclamations/image/${claim.idReclamation}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const imageUrl = URL.createObjectURL(response.data);
      setSelectedImage(imageUrl);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await imageAnalysisService.analyzeImage(
            reader.result,
            claim.idReclamation,
            claim.type
          );
          
          setImageAnalysis(result.analysis);
          
          // Add notification for critical issues
          if (result.analysis.severity.level === 'HAUTE') {
            addNotification({
              title: 'Problème Critique Détecté',
              message: `Maintenance urgente requise pour la réclamation #${claim.idReclamation}`,
              severity: 'error',
              type: 'reclamation'
            });
          }
        } catch (error) {
          console.error('Error analyzing image:', error);
          showNotification('Erreur lors de l\'analyse de l\'image', 'error');
        }
      };
      reader.readAsDataURL(response.data);
      
    } catch (error) {
      console.error('Error fetching image:', error);
      showNotification('Erreur lors du chargement de l\'image', 'error');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const renderAnalysisResults = () => {
    if (analysisLoading) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Analyse en cours...
          </Typography>
        </Box>
      );
    }

    if (!imageAnalysis) return null;

    const recommendations = imageAnalysisService.getMaintenanceRecommendations(imageAnalysis);

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Analyse Technique et Recommandations
        </Typography>
        
        {/* Problèmes Détectés */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Problèmes Détectés
          </Typography>
          <List dense>
            {imageAnalysis.technicalAnalysis.issues.map((issue, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Warning color={issue.includes('Fuite') ? 'error' : 'warning'} />
                </ListItemIcon>
                <ListItemText 
                  primary={issue}
                  secondary={`Sévérité: ${imageAnalysisService.getIssuePriority(issue)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Recommandations */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Recommandations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Actions Requises
              </Typography>
              <List dense>
                {recommendations.actions.map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={action.action}
                      secondary={`Priorité: ${action.priority}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Mesures Préventives
              </Typography>
              <List dense>
                {recommendations.preventive.map((measure, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AssignmentIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={measure} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          {/* Planning et Coûts */}
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Planning d'Intervention
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Délai d'Intervention"
                      secondary={recommendations.timeline.estimatedDuration}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Event />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date Limite"
                      secondary={new Date(recommendations.timeline.deadline).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Estimation des Coûts
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EuroSymbol />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Coût Total Estimé"
                      secondary={`${recommendations.costs.estimatedCost} ${recommendations.costs.currency}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Priorité"
                      secondary={recommendations.timeline.priority}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  };

  const filteredCommandes = commandes
    .filter(commande => {
      const matchesSearch = commande.RefCommande.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || commande.etat === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const filteredReclamations = applyAdvancedFilters(reclamations)
    .filter(reclamation => {
      const searchFields = [
        reclamation.idReclamation?.toString(),
        reclamation.description,
        reclamation.type,
        reclamation.etat
      ].filter(Boolean);
      
      return searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const getCommandeStats = () => {
    return commandes.reduce((acc, commande) => {
      acc[commande.etat] = (acc[commande.etat] || 0) + 1;
      return acc;
    }, {});
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  const handleCloseReclamationDetails = () => {
    setReclamationDetailsOpen(false);
    setSelectedReclamation(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Dashboard Commercial
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Assessment />}
            onClick={() => navigate('/analytics')}
          >
            Analyse des Réclamations
          </Button>
        </Box>

        {/* Notification Icon */}
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{ ml: 2 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 350, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" component="div">
              Notifications du {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="caption" component="div" color="text.secondary">
              {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
            </Typography>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <ListItemText 
                primary={
                  <Typography variant="body2" component="span">
                    Aucune notification aujourd'hui
                  </Typography>
                }
              />
            </MenuItem>
          ) : (
            notifications
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((notification) => (
                <MenuItem 
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  sx={{ 
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderBottom: '1px solid #eee',
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    <CircleIcon 
                      sx={{ 
                        color: notification.severity === 'success' ? 'success.main' :
                              notification.severity === 'error' ? 'error.main' : 'info.main',
                        fontSize: 12,
                        opacity: notification.read ? 0.5 : 1
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle2" component="span">
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" component="span" display="block" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" component="span" display="block" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                </MenuItem>
              ))
          )}
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          {/* En-tête */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h4" component="h1">
                Dashboard Commercial
              </Typography>
            </Paper>
          </Grid>

          {/* Analytics Dashboard */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analytics des Réclamations
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    bgcolor: '#e3f2fd', 
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#bbdefb',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    },
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography sx={{ color: '#1976d2', fontWeight: 'bold' }} variant="subtitle2">
                      Total Réclamations
                    </Typography>
                    <Typography sx={{ color: '#1976d2', mt: 2 }} variant="h4">
                      {analytics.totalReclamations}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    bgcolor: '#e8f5e9',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#c8e6c9',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    },
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }} variant="subtitle2">
                      Résolues Aujourd'hui
                    </Typography>
                    <Typography sx={{ color: '#2e7d32', mt: 2 }} variant="h4">
                      {analytics.resolvedToday}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    bgcolor: '#fff3e0',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#ffe0b2',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    },
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography sx={{ color: '#ed6c02', fontWeight: 'bold' }} variant="subtitle2">
                      Temps Moyen de Résolution
                    </Typography>
                    <Typography sx={{ color: '#ed6c02', mt: 2 }} variant="h4">
                      {analytics.averageResolutionTime}h
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    bgcolor: '#f3e5f5',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#e1bee7',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    },
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography sx={{ color: '#7b1fa2', fontWeight: 'bold' }} variant="subtitle2">
                      Taux de Résolution
                    </Typography>
                    <Typography sx={{ color: '#7b1fa2', mt: 2 }} variant="h4">
                      {analytics.resolutionRate}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Advanced Filters */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Filtres Avancés</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ({filteredReclamations.length} réclamations affichées sur {reclamations.length})
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    select
                    fullWidth
                    label="Période"
                    value={advancedFilters.dateRange}
                    onChange={(e) => handleAdvancedFilterChange('dateRange', e.target.value)}
                    size="small"
                  >
                    {filterOptions.dateRange.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    select
                    fullWidth
                    label="Priorité"
                    value={advancedFilters.priority}
                    onChange={(e) => handleAdvancedFilterChange('priority', e.target.value)}
                    size="small"
                  >
                    {filterOptions.priority.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    select
                    fullWidth
                    label="Statut"
                    value={advancedFilters.status}
                    onChange={(e) => handleAdvancedFilterChange('status', e.target.value)}
                    size="small"
                  >
                    {filterOptions.status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    value={advancedFilters.type}
                    onChange={(e) => handleAdvancedFilterChange('type', e.target.value)}
                    size="small"
                  >
                    {filterOptions.type.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => setAdvancedFilters({
                      dateRange: 'all',
                      priority: 'all',
                      status: 'all',
                      type: 'all',
                      assignedTo: 'all'
                    })}
                    size="medium"
                    sx={{ height: '40px' }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Commandes récentes */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Commandes Récentes
              </Typography>
              <List>
                {filteredCommandes.map((commande, index) => (
                  <React.Fragment key={`commande-${commande.idCommande}-${index}`}>
                    <ListItem
                      component="div"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleCommandeClick(commande)}
                      secondaryAction={
                        <Chip
                          label={commande.etat}
                          color={statusColors[commande.etat]}
                          icon={commande.etat === 'En instance' ? <Warning /> : <Check />}
                        />
                      }
                    >
                      <ListItemText
                        primary={`Commande #${commande.RefCommande}`}
                        secondary={`Date: ${new Date(commande.date).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Section des réclamations commerciales */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Réclamations Commerciales
              </Typography>
              <List>
                {filteredReclamations.map((reclamation, index) => (
                  <React.Fragment key={`reclamation-${reclamation.idReclamation}-${index}`}>
                    <ListItem
                      component="div"
                      onClick={() => handleReclamationClick(reclamation)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemText
                        primary={`Réclamation #${reclamation.idReclamation} - ${reclamation.type}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(reclamation.date).toLocaleDateString()}
                            </Typography>
                            {` - ${reclamation.description}`}
                          </>
                        }
                      />
                      <Chip
                        label={reclamation.etat}
                        color={reclamation.etat === 'Validée' ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Dialog pour les détails de réclamation */}
          <ReclamationDetailsDialog
            open={reclamationDetailsOpen}
            onClose={handleCloseReclamationDetails}
            reclamation={selectedReclamation}
            onStatusUpdate={handleUpdateReclamationStatus}
          />

          {/* Dialog des détails de commande */}
          <Dialog
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Détails de la Commande #{selectedCommande?.RefCommande}
            </DialogTitle>
            <DialogContent>
              {selectedCommande && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    État: {selectedCommande.etat}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Date: {new Date(selectedCommande.date).toLocaleString()}
                  </Typography>
                  {selectedCommande.etat === 'En instance' && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus(selectedCommande.idCommande, 'Validée')}
                      >
                        Valider
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(selectedCommande.idCommande, 'Rejetée')}
                      >
                        Rejeter
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Fermer
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog pour l'analyse */}
          <Dialog
            open={showAnalysis}
            onClose={() => setShowAnalysis(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Analyse Détaillée de la Réclamation
              <IconButton
                aria-label="close"
                onClick={() => setShowAnalysis(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedReclamation && (
                <ReclamationAnalysis reclamation={selectedReclamation} />
              )}
            </DialogContent>
          </Dialog>
        </Grid>
      </Container>
    </Box>
  );
};

export default CommercialDashboard;
