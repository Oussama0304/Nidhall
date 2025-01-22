import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
// Modifié pour utiliser le nom exact du fichier
const AGILLogo = '/assets/agil-logo.png';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (sectionId) => {
    handleClose();
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Hauteur de la navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { label: 'Accueil', action: () => scrollToSection('hero-section') },
    { label: 'Services', action: () => scrollToSection('services-section') },
    { label: 'À Propos', action: () => scrollToSection('about-section') },
    { label: 'Contact', action: () => scrollToSection('contact-section') },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        backgroundColor: scrolled ? 'white' : 'transparent',
        boxShadow: scrolled ? 1 : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={AGILLogo} alt="AGIL Logo" style={{ height: '40px', marginRight: '10px' }} />
            <Typography
              variant="h6"
              sx={{
                color: scrolled ? 'primary.main' : 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              AGIL
            </Typography>
          </Link>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color={scrolled ? 'primary' : 'inherit'}
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={item.action}
                >
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem 
                onClick={handleClose}
                component={Link}
                to="/login"
                sx={{ color: 'primary.main' }}
              >
                Connexion
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={item.action}
                sx={{
                  color: scrolled ? 'text.primary' : 'white',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            >
              Connexion
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
