// import React from 'react';
// import { Link } from 'react-router-dom';

// function Header() {
//   return (
//     <nav style={{ 
//       background: '#007bff', 
//       padding: '1rem', 
//       marginBottom: '1rem' 
//     }}>
//       <Link to="/" style={navLinkStyle}>
//         Search Flights
//       </Link>
//       <Link to="/my-bookings" style={navLinkStyle}>
//         My Bookings
//       </Link>
//     </nav>
//   );
// }

// // Simple styling for the links
// const navLinkStyle = {
//   color: 'white',
//   marginRight: '1rem',
//   textDecoration: 'none',
//   fontWeight: 'bold',
// };

// export default Header;



import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div style={headerContainerStyle}>
      <div style={headerStyle}>
        <div style={logoStyle}>
          <span style={logoTextStyle}>✈️ SKYBOOKER</span>
          <span style={taglineStyle}>Classic Airline Reservation System</span>
        </div>
        <nav style={navStyle}>
          <Link to="/" style={navLinkStyle}>
            🔍 Search Flights
          </Link>
          <Link to="/my-bookings" style={navLinkStyle}>
            📋 My Bookings
          </Link>
        </nav>
      </div>
      <div style={statusBarStyle}>
        <span style={statusTextStyle}>System Status: ONLINE</span>
        <span style={statusTextStyle}>Local Time: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

const headerContainerStyle = {
  background: 'linear-gradient(135deg, #1a2f6b 0%, #2c4fa0 100%)',
  borderBottom: '3px solid #ff9900',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  marginBottom: '1rem',
  fontFamily: "'Courier New', monospace",
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 2rem',
  background: 'rgba(0,0,0,0.2)',
};

const logoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const logoTextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  letterSpacing: '1px',
};

const taglineStyle = {
  color: '#ffcc00',
  fontSize: '12px',
  fontStyle: 'italic',
  marginTop: '2px',
};

const navStyle = {
  display: 'flex',
  gap: '2rem',
};

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: '8px 16px',
  border: '2px solid #ff9900',
  borderRadius: '4px',
  background: 'rgba(255,153,0,0.2)',
  transition: 'all 0.3s ease',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const statusBarStyle = {
  background: 'rgba(0,0,0,0.3)',
  padding: '4px 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

const statusTextStyle = {
  color: '#00ff00',
  fontSize: '12px',
  fontFamily: "'Courier New', monospace",
  fontWeight: 'bold',
};

export default Header;