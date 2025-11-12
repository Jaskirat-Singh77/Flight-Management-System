// import React, { useState } from 'react';
// import { searchFlights, bookFlight } from '../services/api';
// import FlightListUser from './FlightListUser';

// function FlightSearch() {
//   const [searchParams, setSearchParams] = useState({
//     source: '',
//     destination: '',
//     date: '',
//   });
//   const [flights, setFlights] = useState([]);
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
//   };

//   // Called when user clicks "Search"
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setFlights([]);
//     try {
//       const response = await searchFlights(
//         searchParams.source,
//         searchParams.destination,
//         searchParams.date
//       );
//       setFlights(response.data);
//       if (response.data.length === 0) {
//         setMessage('No flights found matching your criteria.');
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       setMessage('Error searching for flights. Please try again.');
//     }
//   };

//   // Passed to FlightListUser component, called when user clicks "Book"
//   const handleBook = async (flightId) => {
//     // Since we don't have user auth, we just prompt for a name.
//     const userName = prompt('Please enter your full name for the booking:');
//     if (!userName) {
//       alert('Booking cancelled. Name is required.');
//       return;
//     }

//     const seatsBooked = parseInt(prompt('How many seats do you want to book?', 1));
//     if (isNaN(seatsBooked) || seatsBooked <= 0) {
//         alert('Invalid number of seats.');
//         return;
//     }

//     try {
//         const bookingData = { flightId, userName, seatsBooked };
//         // Call the API to create the booking
//         await bookFlight(bookingData);
//         alert('Booking successful! Your booking is confirmed.');
        
//         // Refresh search to update available seats
//         handleSearch(new Event('submit')); 

//     } catch (err) {
//         console.error("Booking error:", err);
//         // The backend sends 409 Conflict if not enough seats
//         if (err.response && err.response.status === 409) {
//           alert('Booking failed. Not enough available seats.');
//         } else {
//           alert('An error occurred during booking. Please try again.');
//         }
//     }
//   };

//   return (
//     <div>
//       <h2>Search for Flights</h2>
//       <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
//         <input name="source" value={searchParams.source} onChange={handleChange} placeholder="Source (e.g., Delhi)" required />
//         <input name="destination" value={searchParams.destination} onChange={handleChange} placeholder="Destination (e.g., Mumbai)" required />
//         <input name="date" value={searchParams.date} onChange={handleChange} type="date" required />
//         <button type="submit">Search</button>
//       </form>

//       {message && <p style={{ color: 'blue' }}>{message}</p>}

//       {/* Pass search results and book function to the list component */}
//       <FlightListUser flights={flights} onBook={handleBook} />
//     </div>
//   );
// }

// export default FlightSearch;



import React, { useState } from 'react';
import { searchFlights, bookFlight } from '../services/api';
import FlightListUser from './FlightListUser';

function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: '',
    class: 'economy',
    passengers: 1
  });
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setFlights([]);
    setLoading(true);
    
    try {
      const response = await searchFlights(
        searchParams.source,
        searchParams.destination,
        searchParams.date
      );
      setFlights(response.data);
      if (response.data.length === 0) {
        setMessage('❌ No flights found matching your search criteria.');
      }
    } catch (err) {
      console.error("Search error:", err);
      setMessage('⚠️ Error searching for flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId) => {
    const userName = prompt('📝 Please enter your full name for the booking:');
    if (!userName) {
      alert('❌ Booking cancelled. Name is required.');
      return;
    }

    const seatsBooked = parseInt(prompt(`How many seats do you want to book? (1-${searchParams.passengers})`, searchParams.passengers));
    if (isNaN(seatsBooked) || seatsBooked <= 0 || seatsBooked > searchParams.passengers) {
        alert('❌ Invalid number of seats.');
        return;
    }

    try {
        const bookingData = { flightId, userName, seatsBooked };
        await bookFlight(bookingData);
        alert('✅ Booking successful! Your booking is confirmed.');
        handleSearch(new Event('submit'));
    } catch (err) {
        console.error("Booking error:", err);
        if (err.response && err.response.status === 409) {
          alert('❌ Booking failed. Not enough available seats.');
        } else {
          alert('⚠️ An error occurred during booking. Please try again.');
        }
    }
  };

  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai' },
    { from: 'Bangalore', to: 'Delhi' },
    { from: 'Mumbai', to: 'Chennai' },
    { from: 'Kolkata', to: 'Delhi' }
  ];

  const handleQuickRoute = (from, to) => {
    setSearchParams({ ...searchParams, source: from, destination: to });
  };

  return (
    <div style={containerStyle}>
      <div style={searchCardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={titleStyle}>🛫 FLIGHT SEARCH</h2>
          <div style={subtitleStyle}>Find your perfect flight</div>
        </div>

        <form onSubmit={handleSearch} style={formStyle}>
          <div style={inputGroupStyle}>
            <div style={inputContainerStyle}>
              <label style={labelStyle}>From</label>
              <input 
                name="source" 
                value={searchParams.source} 
                onChange={handleChange} 
                placeholder="Departure City" 
                style={inputStyle}
                required 
              />
            </div>
            
            <div style={swapButtonContainerStyle}>
              <button type="button" style={swapButtonStyle} onClick={() => {
                setSearchParams({
                  ...searchParams,
                  source: searchParams.destination,
                  destination: searchParams.source
                });
              }}>
                ⇄
              </button>
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>To</label>
              <input 
                name="destination" 
                value={searchParams.destination} 
                onChange={handleChange} 
                placeholder="Destination City" 
                style={inputStyle}
                required 
              />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Departure Date</label>
              <input 
                name="date" 
                value={searchParams.date} 
                onChange={handleChange} 
                type="date" 
                style={inputStyle}
                required 
              />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Passengers</label>
              <select 
                name="passengers" 
                value={searchParams.passengers} 
                onChange={handleChange} 
                style={inputStyle}
              >
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Class</label>
              <select 
                name="class" 
                value={searchParams.class} 
                onChange={handleChange} 
                style={inputStyle}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={searchButtonStyle}>
            {loading ? '🔍 SEARCHING...' : '🔍 SEARCH FLIGHTS'}
          </button>
        </form>

        <div style={quickRoutesStyle}>
          <div style={quickRoutesTitleStyle}>Popular Routes:</div>
          <div style={quickRoutesListStyle}>
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                type="button"
                style={quickRouteButtonStyle}
                onClick={() => handleQuickRoute(route.from, route.to)}
              >
                {route.from} → {route.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      {loading && (
        <div style={loadingStyle}>
          <div style={loadingTextStyle}>📡 Searching for flights...</div>
          <div style={loadingBarStyle}>
            <div style={loadingProgressStyle}></div>
          </div>
        </div>
      )}

      <FlightListUser flights={flights} onBook={handleBook} searchParams={searchParams} />
    </div>
  );
}

const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const searchCardStyle = {
  background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
  border: '2px solid #1a2f6b',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
};

const cardHeaderStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  borderBottom: '2px solid #1a2f6b',
  paddingBottom: '10px',
};

const titleStyle = {
  color: '#1a2f6b',
  margin: '0 0 5px 0',
  fontSize: '24px',
  fontWeight: 'bold',
};

const subtitleStyle = {
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputGroupStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr 1fr 1fr 1fr',
  gap: '10px',
  alignItems: 'end',
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#333',
  fontSize: '12px',
  textTransform: 'uppercase',
};

const inputStyle = {
  padding: '8px 12px',
  border: '2px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  background: '#fff',
  transition: 'border-color 0.3s ease',
};

const swapButtonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingBottom: '5px',
};

const swapButtonStyle = {
  background: '#1a2f6b',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
};

const searchButtonStyle = {
  background: 'linear-gradient(135deg, #ff9900, #ff6600)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const quickRoutesStyle = {
  marginTop: '20px',
  paddingTop: '15px',
  borderTop: '1px dashed #ccc',
};

const quickRoutesTitleStyle = {
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#333',
  fontSize: '14px',
};

const quickRoutesListStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const quickRouteButtonStyle = {
  background: 'transparent',
  border: '1px solid #1a2f6b',
  color: '#1a2f6b',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const messageStyle = {
  background: '#fff3cd',
  border: '1px solid #ffeaa7',
  color: '#856404',
  padding: '12px',
  borderRadius: '4px',
  marginBottom: '15px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const loadingStyle = {
  background: '#e9ecef',
  border: '1px solid #ced4da',
  padding: '15px',
  borderRadius: '4px',
  marginBottom: '15px',
  textAlign: 'center',
};

const loadingTextStyle = {
  marginBottom: '10px',
  color: '#495057',
  fontWeight: 'bold',
};

const loadingBarStyle = {
  width: '100%',
  height: '4px',
  background: '#dee2e6',
  borderRadius: '2px',
  overflow: 'hidden',
};

const loadingProgressStyle = {
  height: '100%',
  background: 'linear-gradient(90deg, #1a2f6b, #ff9900)',
  animation: 'loading 1.5s infinite',
};

export default FlightSearch;