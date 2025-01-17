import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import ImageAnalysisResult from './ImageAnalysisResult';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const ReclamationDetailsDialog = ({ open, onClose, reclamation, onStatusUpdate }) => {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reclamation?.analysis_results) {
      try {
        setAnalysis(JSON.parse(reclamation.analysis_results));
      } catch (e) {
        console.error('Erreur lors du parsing des résultats d\'analyse:', e);
      }
    }
  }, [reclamation]);

  const analyzeImage = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/analysis/image/analyze/${reclamation.idReclamation}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError('Erreur lors de l\'analyse de l\'image');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!analysis) {
      return (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            Cliquez sur "Analyser l'image" pour obtenir les résultats de l'analyse.
          </Alert>
        </Box>
      );
    }

    const { faultAnalysis = {}, detectedObjects = [], classification = [] } = analysis;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats de l'analyse
        </Typography>
        
        <Grid container spacing={2}>
          {/* Analyse des défauts */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Diagnostic
                </Typography>
                {faultAnalysis && faultAnalysis.type && faultAnalysis.type !== 'inconnu' ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Type de panne : <Chip label={faultAnalysis.type.replace('_', ' ')} color="warning" />
                    </Typography>
                    {faultAnalysis.gravite && (
                      <Typography variant="subtitle1" gutterBottom>
                        Gravité : <Chip label={faultAnalysis.gravite} color={faultAnalysis.gravite === 'haute' ? 'error' : 'warning'} />
                      </Typography>
                    )}
                    {faultAnalysis.solution && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Solution recommandée :
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {faultAnalysis.solution}
                        </Typography>
                      </>
                    )}
                    {faultAnalysis.pieces && faultAnalysis.pieces.length > 0 && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Pièces concernées :
                        </Typography>
                        <List dense>
                          {faultAnalysis.pieces.map((piece, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={piece} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </>
                ) : (
                  <Typography color="text.secondary">
                    Aucun défaut spécifique n'a été identifié
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Objets détectés */}
          {detectedObjects && detectedObjects.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Objets détectés
                  </Typography>
                  <List dense>
                    {detectedObjects.map((obj, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={obj.label}
                            secondary={`Confiance: ${Math.round((obj.confidence || 0) * 100)}%`}
                          />
                        </ListItem>
                        {index < detectedObjects.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Classification générale */}
          {classification && classification.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Classification générale
                  </Typography>
                  <List dense>
                    {classification.map((cls, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={cls.label}
                            secondary={`Confiance: ${Math.round((cls.confidence || 0) * 100)}%`}
                          />
                        </ListItem>
                        {index < classification.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  if (!reclamation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Détails de la Réclamation #{reclamation.idReclamation}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Type: {reclamation.type}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              État: <Chip 
                label={reclamation.etat}
                color={reclamation.etat === 'Validée' ? 'success' : 'warning'}
                size="small"
              />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Priorité: <Chip 
                label={reclamation.priorite}
                color={reclamation.priorite === 'Haute' ? 'error' : 'default'}
                size="small"
              />
            </Typography>
            <Typography variant="body1">Description: {reclamation.description}</Typography>
            {reclamation.image_url && (
                <Box sx={{ my: 2, textAlign: 'center' }}>
                    <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/uploads/reclamations/${reclamation.image_url.split('/').pop()}`}
                        alt="Image de la réclamation"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginBottom: '16px',
                            backgroundColor: '#f5f5f5',
                            padding: '8px'
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AutoFixHighIcon />}
                            onClick={analyzeImage}
                            sx={{ 
                                backgroundColor: '#ffd700', 
                                '&:hover': { backgroundColor: '#ffc700' },
                                width: '200px'
                            }}
                        >
                            Analyser l'image
                        </Button>
                    </Box>
                </Box>
            )}
          </Grid>

          {/* Résultats de l'analyse */}
          <Grid item xs={12}>
            {analyzing && (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Box mt={2}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            {renderAnalysisResults()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {reclamation.etat !== 'Validée' && (
          <Button 
            onClick={() => onStatusUpdate(reclamation.idReclamation, 'Validée')}
            color="success"
          >
            Valider
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReclamationDetailsDialog;
