import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  LocationOn,
  LocalShipping,
  Home
} from '@mui/icons-material';

const VirtualMap = ({ stations, depot, routes, onStationSelect }) => {
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState(null);
  const [mapBounds, setMapBounds] = useState({
    minLat: 30, // Sud de la Tunisie
    maxLat: 38, // Nord de la Tunisie
    minLng: 7,  // Ouest de la Tunisie
    maxLng: 12  // Est de la Tunisie
  });

  // Convertir les coordonnées géographiques en coordonnées SVG
  const geoToSvg = (lat, lng) => {
    const width = 800;
    const height = 600;
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
    return { x, y };
  };

  // Gestion du zoom et du pan
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(zoom + delta, 0.5), 4);
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) { // Click gauche uniquement
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

  // Animation des routes
  const [routeProgress, setRouteProgress] = useState({});
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

  // Styles
  const styles = {
    mapContainer: {
      position: 'relative',
      width: '100%',
      height: '600px',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    svg: {
      width: '100%',
      height: '100%',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: 'transform 0.1s ease-out'
    },
    station: {
      fill: '#1976d2',
      stroke: '#fff',
      strokeWidth: 2,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    stationHovered: {
      fill: '#1565c0',
      transform: 'scale(1.2)'
    },
    depot: {
      fill: '#f44336',
      stroke: '#fff',
      strokeWidth: 2,
      cursor: 'pointer'
    },
    route: {
      stroke: '#4caf50',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      fill: 'none',
      strokeDasharray: '10,5'
    },
    vehicleMarker: {
      fill: '#2196f3',
      stroke: '#fff',
      strokeWidth: 1
    }
  };

  // Rendu des stations
  const renderStations = () => {
    return stations.map((station) => {
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
            onClick={() => onStationSelect(station)}
          />
          <text
            y="-12"
            textAnchor="middle"
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              fill: '#333'
            }}
          >
            {station.nom}
          </text>
        </g>
      );
    });
  };

  // Rendu des routes
  const renderRoutes = () => {
    return routes.map((route) => {
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
    <Paper sx={{ p: 2 }}>
      <Box sx={styles.mapContainer}>
        <svg
          ref={svgRef}
          style={{
            ...styles.svg,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
                  fill: '#333'
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
            <IconButton onClick={() => setZoom(z => Math.min(z + 0.2, 4))}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Légende */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 1,
            borderRadius: 1
          }}
        >
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<LocationOn />}
              label="Station"
              size="small"
              color="primary"
            />
            <Chip
              icon={<Home />}
              label="Dépôt"
              size="small"
              color="secondary"
            />
            <Chip
              icon={<LocalShipping />}
              label="Véhicule en route"
              size="small"
              color="info"
            />
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default VirtualMap;
