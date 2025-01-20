import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { reclamationService } from '../../services/api.service';
import { analysisService } from '../../services/analysis.service';
import ImageAnalysisView from '../../components/analysis/ImageAnalysisView';
import ReclamationAnalysis from '../../components/analysis/ReclamationAnalysis';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    priority: 'NORMAL',
    estimatedResolutionTime: 72,
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [analysisError, setAnalysisError] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  const getFullName = (nom, prenom) => {
    const nameParts = [nom, prenom].filter(part => part && typeof part === 'string');
    return nameParts.length > 0 ? nameParts.join(' ') : '';
  };

  const columns = [
    { 
      field: 'idReclamation', 
      headerName: 'ID', 
      width: 90,
      valueGetter: (params) => params?.row?.idReclamation ?? ''
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 130,
      valueGetter: (params) => params?.row?.type ?? ''
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 200,
      valueGetter: (params) => params?.row?.description ?? ''
    },
    { 
      field: 'material', 
      headerName: 'Matériel', 
      width: 130,
      valueGetter: (params) => params?.row?.material ?? ''
    },
    { 
      field: 'etat', 
      headerName: 'État', 
      width: 130,
      valueGetter: (params) => params?.row?.etat ?? ''
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 130,
      valueGetter: (params) => params?.row?.date ?? '',
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      field: 'gerant', 
      headerName: 'Gérant', 
      width: 180,
      valueGetter: (params) => {
        if (!params?.row) return '';
        return getFullName(params.row.nom_gerant, params.row.prenom_gerant);
      }
    },
    { 
      field: 'commercial', 
      headerName: 'Commercial', 
      width: 180,
      valueGetter: (params) => {
        if (!params?.row) return '';
        return getFullName(params.row.nom_commercial, params.row.prenom_commercial);
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(params.row.idReclamation)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton 
            color="info" 
            onClick={() => handleAnalyze(params.row)}
            size="small"
          >
            <AnalyticsIcon />
          </IconButton>
        </Box>
      )
    },
  ];

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    setLoading(true);
    try {
      const response = await reclamationService.getUserReclamations();
      console.log('Réclamations reçues:', response.data);
      if (Array.isArray(response.data)) {
        setReclamations(response.data);
      } else {
        console.error('Format de données invalide:', response.data);
        setReclamations([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations:', error);
      setReclamations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedReclamation(null);
    setFormData({
      type: '',
      description: '',
      priority: 'NORMAL',
      estimatedResolutionTime: 72,
    });
    setOpenDialog(true);
  };

  const handleEdit = (reclamation) => {
    if (!reclamation) return;
    setSelectedReclamation(reclamation);
    setFormData({
      type: reclamation.type || '',
      description: reclamation.description || '',
      priority: reclamation.priority || 'NORMAL',
      estimatedResolutionTime: reclamation.estimatedResolutionTime || 72,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      return;
    }
    try {
      await reclamationService.deleteReclamation(id);
      fetchReclamations();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedReclamation) {
        await reclamationService.updateReclamation(selectedReclamation.idReclamation, formData);
      } else {
        const response = await reclamationService.createReclamation(formData);
        console.log('Réclamation créée:', response.data);
      }
      setOpenDialog(false);
      await fetchReclamations(); // Recharger les données après la création/modification
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la réclamation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAnalyze = async (reclamation) => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      setShowAnalysis(true);
      setSelectedReclamation(reclamation);
      setAnalysisData(null);

      console.log('Envoi de la réclamation pour analyse:', reclamation);
      const response = await analysisService.analyzeReclamation(reclamation);
      console.log('Réponse de l\'analyse:', response.data);
      
      if (!response.data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      setAnalysisData(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setAnalysisError(error.message || 'Une erreur est survenue lors de l\'analyse');
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Gestion des Réclamations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Nouvelle Réclamation
        </Button>how 
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <DataGrid
          rows={reclamations}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row?.idReclamation ?? Math.random()}
          autoHeight
          loading={loading}
          error={null}
          components={{
            NoRowsOverlay: () => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Typography>
                  {loading ? 'Chargement des réclamations...' : 'Aucune réclamation trouvée'}
                </Typography>
              </Box>
            )
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }
          }}
        />
      </Paper>

      <Dialog
        open={showAnalysis}
        onClose={() => {
          setShowAnalysis(false);
          setAnalysisData(null);
          setAnalysisError(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Analyse de la Réclamation #{selectedReclamation?.idReclamation}
        </DialogTitle>
        <DialogContent>
          {analysisError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {analysisError}
            </Alert>
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={selectedTab} 
                  onChange={(e, newValue) => setSelectedTab(newValue)}
                >
                  <Tab label="Analyse Générale" />
                  {selectedReclamation?.image_url && <Tab label="Analyse d'Image" />}
                </Tabs>
              </Box>

              {selectedTab === 0 && (
                <ReclamationAnalysis 
                  reclamation={selectedReclamation}
                  analysis={analysisData}
                  loading={analysisLoading}
                />
              )}

              {selectedTab === 1 && selectedReclamation?.image_url && (
                <ImageAnalysisView 
                  analysis={analysisData?.image_analysis}
                  loading={analysisLoading}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAnalysis(false);
            setAnalysisData(null);
            setAnalysisError(null);
          }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedReclamation ? 'Modifier la Réclamation' : 'Nouvelle Réclamation'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="TECHNIQUE">Technique</MenuItem>
                <MenuItem value="COMMERCIALE">Commerciale</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              name="material"
              label="Matériel"
              value={formData.material}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              name="idGerant"
              label="ID Gérant"
              type="number"
              value={formData.idGerant}
              onChange={handleChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedReclamation ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReclamationList;
