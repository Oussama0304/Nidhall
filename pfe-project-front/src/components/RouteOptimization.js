import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
  IconButton,
  Zoom,
  Popover,
  Slider,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Route as RouteIcon,
  Speed as SpeedIcon,
  LocalShipping as LocalShippingIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationOnIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  LocalGasStation as GasIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PanTool as PanIcon,
  Compare as CompareIcon,
  LocalShipping as TruckIcon,
  AccessTime as TimeIcon,
  Settings as SettingsIcon,
  EmojiTransportation as TransportIcon,
  Co2 as Co2Icon
} from '@mui/icons-material';
import axios from 'axios';

const VirtualMap = ({ stations, depot, routes, onStationSelect }) => {
  const theme = useTheme();
  const mapContainerRef = useRef(null);
  const svgRef = useRef(null);
  const [hoveredStation, setHoveredStation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [routeProgress, setRouteProgress] = useState({});
  const [mapBounds, setMapBounds] = useState({
    minLat: 30, // Sud de la Tunisie
    maxLat: 38, // Nord de la Tunisie
    minLng: 7,  // Ouest de la Tunisie
    maxLng: 12  // Est de la Tunisie
  });
  const [pinchDistance, setPinchDistance] = useState(null);

  // Convertir les coordonnées géographiques en coordonnées SVG
  const geoToSvg = (lat, lng) => {
    // Vérifier si les coordonnées sont valides
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.warn('Coordonnées invalides:', { lat, lng });
      return { x: 0, y: 0 }; // Valeurs par défaut
    }

    const width = 800;
    const height = 600;
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
    
    // Vérifier si les coordonnées calculées sont valides
    if (isNaN(x) || isNaN(y)) {
      console.warn('Coordonnées SVG invalides calculées pour:', { lat, lng });
      return { x: 0, y: 0 }; // Valeurs par défaut
    }
    
    return { x, y };
  };

  // Animation des routes
  useEffect(() => {
    routes.forEach((route) => {
      setRouteProgress(prev => ({
        ...prev,
        [route.id]: 0
      }));

      const interval = setInterval(() => {
        setRouteProgress(prev => ({
          ...prev,
          [route.id]: prev[route.id] >= 1 ? 0 : prev[route.id] + 0.02
        }));
      }, 50);

      return () => clearInterval(interval);
    });
  }, [routes]);

  // Gestion du zoom et du pan
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    const handleWheel = (e) => {
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(zoom + delta, 0.5), 4);
      setZoom(newZoom);
    };

    mapContainer.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      mapContainer.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y
      });
    } else if (e.touches.length === 2) {
      // Gestion du pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setPinchDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    } else if (e.touches.length === 2) {
      // Gestion du pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      if (pinchDistance) {
        const delta = (newDistance - pinchDistance) * 0.01;
        const newZoom = Math.min(Math.max(zoom + delta, 0.5), 4);
        setZoom(newZoom);
      }
      setPinchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPinchDistance(null);
  };

  // Styles améliorés
  const styles = {
    container: {
      background: 'linear-gradient(145deg, #f6f8fa 0%, #e9ecef 100%)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
      position: 'relative',
      width: '100%',
      height: '600px',
      overflow: 'hidden'
    },
    svg: {
      width: '100%',
      height: '100%',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: 'transform 0.1s ease-out'
    },
    station: {
      fill: theme.palette.primary.main,
      stroke: '#fff',
      strokeWidth: 2,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    },
    stationHovered: {
      fill: theme.palette.primary.dark,
      transform: 'scale(1.2)'
    },
    depot: {
      fill: theme.palette.secondary.main,
      stroke: '#fff',
      strokeWidth: 2,
      cursor: 'pointer',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
    },
    route: {
      stroke: theme.palette.success.main,
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      fill: 'none',
      strokeDasharray: '10,5'
    },
    vehicleMarker: {
      fill: theme.palette.info.main,
      stroke: '#fff',
      strokeWidth: 1
    }
  };

  // Rendu des stations
  const renderStations = () => {
    return stations.filter(station => {
      // Vérifier si la station a des coordonnées valides
      if (!station.latitude || !station.longitude || 
          isNaN(station.latitude) || isNaN(station.longitude)) {
        console.warn('Station avec coordonnées invalides:', station);
        return false;
      }
      return true;
    }).map((station) => {
      const pos = geoToSvg(station.latitude, station.longitude);
      return (
        <g key={station.idStation} transform={`translate(${pos.x}, ${pos.y})`}>
          <circle
            r="8"
            style={{
              ...styles.station,
              ...(hoveredStation === station.idStation ? styles.stationHovered : {})
            }}
            onMouseEnter={() => setHoveredStation(station.idStation)}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={() => {
              setSelectedStation(station);
              onStationSelect(station);
            }}
          />
          <text
            y="-12"
            textAnchor="middle"
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              fill: theme.palette.text.primary
            }}
          >
            {station.nom || 'Station sans nom'}
          </text>
        </g>
      );
    });
  };

  // Rendu des routes
  const renderRoutes = () => {
    return routes.filter(route => {
      // Vérifier si la route a des points valides
      if (!route.path || !Array.isArray(route.path) || route.path.length < 2) {
        console.warn('Route invalide:', route);
        return false;
      }
      return route.path.every(point => 
        point && !isNaN(point.lat) && !isNaN(point.lng)
      );
    }).map((route) => {
      const points = route.path.map(point => geoToSvg(point.lat, point.lng));
      const progress = routeProgress[route.id] || 0;
      const vehiclePos = calculateVehiclePosition(points, progress);

      return (
        <g key={route.id}>
          <path
            d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            style={styles.route}
          />
          <circle
            cx={vehiclePos.x}
            cy={vehiclePos.y}
            r="6"
            style={styles.vehicleMarker}
          >
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      );
    });
  };

  // Calcul de la position du véhicule
  const calculateVehiclePosition = (points, progress) => {
    if (points.length < 2) return points[0];
    
    const totalSegments = points.length - 1;
    const currentSegment = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) % 1;
    
    const start = points[currentSegment];
    const end = points[currentSegment + 1];
    
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress
    };
  };

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        ref={svgRef}
        style={{
          ...styles.svg,
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Grille de fond */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#eee"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {renderRoutes()}
        {renderStations()}
        
        {/* Dépôt */}
        {depot && (
          <g transform={`translate(${geoToSvg(depot.latitude, depot.longitude).x}, ${geoToSvg(depot.latitude, depot.longitude).y})`}>
            <circle
              r="10"
              style={styles.depot}
            />
            <text
              y="-15"
              textAnchor="middle"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                fill: theme.palette.text.primary
              }}
            >
              Dépôt
            </text>
          </g>
        )}
      </svg>

      {/* Contrôles */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Tooltip title="Zoom in">
          <IconButton 
            onClick={() => setZoom(z => Math.min(z + 0.2, 4))}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out">
          <IconButton 
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Légende */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          backgroundColor: 'background.paper',
          padding: 1,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Stack direction="row" spacing={2}>
          <Chip
            icon={<LocationOnIcon />}
            label="Station"
            size="small"
            color="primary"
          />
          <Chip
            icon={<HomeIcon />}
            label="Dépôt"
            size="small"
            color="secondary"
          />
          <Chip
            icon={<LocalShippingIcon />}
            label="Véhicule en route"
            size="small"
            color="info"
          />
        </Stack>
      </Box>
    </div>
  );
};

const AdvancedOptimizationOptions = ({ open, onClose, onApply, currentSettings }) => {
  const [settings, setSettings] = useState(currentSettings || {
    timeWindow: [8, 18],
    priorityLevel: 'balanced',
    vehicleCapacity: 100,
    maxDistance: 200,
    considerTraffic: true,
    optimizeForFuel: true,
    avoidTolls: false,
    maxStopsPerRoute: 10,
    restTimeRequired: 30,
    co2Reduction: true
  });

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  const timeWindows = [
    { label: "8h - 18h", value: [8, 18] },
    { label: "6h - 22h", value: [6, 22] },
    { label: "24h/24", value: [0, 24] }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsIcon color="primary" />
          <Typography variant="h6">Options d'Optimisation Avancées</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Fenêtre de temps */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Fenêtre de Temps</InputLabel>
              <Select
                value={settings.timeWindow}
                onChange={handleChange('timeWindow')}
                label="Fenêtre de Temps"
              >
                {timeWindows.map((window) => (
                  <MenuItem key={window.label} value={window.value}>
                    {window.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Niveau de priorité */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priorité d'Optimisation</InputLabel>
              <Select
                value={settings.priorityLevel}
                onChange={handleChange('priorityLevel')}
                label="Priorité d'Optimisation"
              >
                <MenuItem value="speed">Vitesse de livraison</MenuItem>
                <MenuItem value="balanced">Équilibré</MenuItem>
                <MenuItem value="eco">Économie de carburant</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Capacité du véhicule */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Capacité maximale du véhicule (kg)"
              value={settings.vehicleCapacity}
              onChange={handleChange('vehicleCapacity')}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* Distance maximale */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Distance maximale par route (km)"
              value={settings.maxDistance}
              onChange={handleChange('maxDistance')}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* Arrêts maximum */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Nombre maximum d'arrêts par route"
              value={settings.maxStopsPerRoute}
              onChange={handleChange('maxStopsPerRoute')}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          {/* Temps de repos */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Temps de repos requis (minutes)"
              value={settings.restTimeRequired}
              onChange={handleChange('restTimeRequired')}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Options supplémentaires
            </Typography>
          </Grid>

          {/* Options booléennes */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.considerTraffic}
                    onChange={handleChange('considerTraffic')}
                  />
                }
                label="Prendre en compte le trafic"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.optimizeForFuel}
                    onChange={handleChange('optimizeForFuel')}
                  />
                }
                label="Optimiser la consommation de carburant"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.avoidTolls}
                    onChange={handleChange('avoidTolls')}
                  />
                }
                label="Éviter les péages"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.co2Reduction}
                    onChange={handleChange('co2Reduction')}
                  />
                }
                label="Priorité à la réduction de CO2"
              />
            </Stack>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2 }}>
          Ces paramètres seront utilisés pour optimiser les routes en fonction de vos besoins spécifiques.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onApply(settings);
            onClose();
          }}
        >
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RouteOptimization = () => {
  const [stations, setStations] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const [stationsResponse, commandesResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/stations', config),
          axios.get('http://localhost:3000/api/commandes', config)
        ]);

        // Vérifier et filtrer les stations avec des coordonnées valides
        const validStations = stationsResponse.data.filter(station => 
          station && 
          !isNaN(station.latitude) && 
          !isNaN(station.longitude) &&
          station.latitude >= 30 &&
          station.latitude <= 38 &&
          station.longitude >= 7 &&
          station.longitude <= 12
        );

        setStations(validStations);
        setCommandes(commandesResponse.data);

        // Créer les routes optimisées seulement pour les stations valides
        const routes = commandesResponse.data
          .filter(commande => {
            const station = validStations.find(s => s.idStation === commande.idStation);
            return !!station;
          })
          .map(commande => {
            const station = validStations.find(s => s.idStation === commande.idStation);
            return {
              id: commande.idCommande,
              path: [
                { lat: 36.8065, lng: 10.1815 }, // Position du dépôt central
                { lat: station.latitude, lng: station.longitude }
              ]
            };
          });

        setOptimizedRoutes(routes);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.response?.data?.message || "Erreur lors du chargement des données. Veuillez vous reconnecter.");
        setLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, []);

  const handleStationSelect = (station) => {
    console.log('Station sélectionnée:', station);
    // Ajoutez ici la logique pour gérer la sélection d'une station
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Optimisation des Livraisons
          </Typography>
          
          <VirtualMap
            stations={stations}
            depot={{
              latitude: 36.8065,
              longitude: 10.1815,
              nom: "Dépôt Central"
            }}
            routes={optimizedRoutes}
            onStationSelect={handleStationSelect}
          />
          
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalShippingIcon />
                    <Typography>
                      {commandes.length} Commandes en cours
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOnIcon />
                    <Typography>
                      {stations.length} Stations actives
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SpeedIcon />
                    <Typography>
                      Temps moyen de livraison: 45 min
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RouteOptimization;
