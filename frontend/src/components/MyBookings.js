// import React, { useState } from 'react';
// import { getMyBookings, cancelBooking } from '../services/api';

// function MyBookings() {
//   const [userName, setUserName] = useState('');
//   const [bookings, setBookings] = useState([]);
//   const [message, setMessage] = useState('');

//   const handleFetchBookings = async () => {
//     if (!userName) {
//       alert('Please enter your name to find your bookings.');
//       return;
//     }
//     setMessage('');
//     setBookings([]);
//     try {
//       const response = await getMyBookings(userName);
//       setBookings(response.data);
//       if (response.data.length === 0) {
//         setMessage('No bookings found for this name.');
//       }
//     } catch (err) {
//       console.error("Fetch bookings error:", err);
//       setMessage('Error fetching bookings.');
//     }
//   };

//   const handleCancel = async (bookingId) => {
//     if (window.confirm('Are you sure you want to cancel this booking?')) {
//       try {
//         await cancelBooking(bookingId);
//         alert('Booking cancelled successfully.');
//         // Refresh bookings list
//         handleFetchBookings();
//       } catch (err) {
//         console.error("Cancel booking error:", err);
//         alert('Failed to cancel booking. Please try again.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>My Bookings</h2>
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
//         <input
//           type="text"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           placeholder="Enter your full name"
//           style={{ padding: '5px' }}
//         />
//         <button onClick={handleFetchBookings}>Get My Bookings</button>
//       </div>

//       {message && <p style={{ color: 'blue' }}>{message}</p>}

//       {bookings.length > 0 && (
//         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
//           <thead>
//             <tr style={{ background: '#f4f4f4' }}>
//               <th style={tableHeaderStyle}>Booking ID</th>
//               <th style={tableHeaderStyle}>Flight No.</th>
//               <th style={tableHeaderStyle}>From-To</th>
//               <th style={tableHeaderStyle}>Departure</th>
//               <th style={tableHeaderStyle}>Seats</th>
//               <th style={tableHeaderStyle}>Booking Date</th>
//               <th style={tableHeaderStyle}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking) => (
//               <tr key={booking.bookingId}>
//                 <td style={tableCellStyle}>{booking.bookingId}</td>
//                 {/* We can access joined flight data here */}
//                 <td style={tableCellStyle}>{booking.flight.flightNumber}</td>
//                 <td style={tableCellStyle}>{booking.flight.source} to {booking.flight.destination}</td>
//                 <td style={tableCellStyle}>{new Date(booking.flight.departureTime).toLocaleString()}</td>
//                 <td style={tableCellStyle}>{booking.seatsBooked}</td>
//                 <td style={tableCellStyle}>{new Date(booking.bookingDate).toLocaleString()}</td>
//                 <td style={tableCellStyle}>
//                   <button onClick={() => handleCancel(booking.bookingId)}>
//                     Cancel Booking
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// // Simple styling
// const tableHeaderStyle = {
//   padding: '8px',
//   border: '1px solid #ddd',
//   textAlign: 'left',
// };
// const tableCellStyle = {
//   padding: '8px',
//   border: '1px solid #ddd',
// };

// export default MyBookings;

import React, { useState } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';

function MyBookings() {
  const [userName, setUserName] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchBookings = async () => {
    if (!userName.trim()) {
      alert('⚠️ Please enter your name to find your bookings.');
      return;
    }
    setMessage('');
    setBookings([]);
    setLoading(true);
    
    try {
      const response = await getMyBookings(userName);
      setBookings(response.data);
      if (response.data.length === 0) {
        setMessage('📭 No bookings found for this name.');
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setMessage('❌ Error fetching bookings. Please check the name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId, flightNumber) => {
    if (!window.confirm(`❓ Are you sure you want to cancel booking for flight ${flightNumber}?`)) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      alert('✅ Booking cancelled successfully.');
      handleFetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert('❌ Failed to cancel booking. Please try again.');
    }
  };

  const getStatusStyle = (departureTime) => {
    const now = new Date();
    const departure = new Date(departureTime);
    const timeDiff = departure - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) return { status: 'DEPARTED', color: '#6c757d', bg: '#e9ecef' };
    if (hoursDiff < 2) return { status: 'BOARDING', color: '#dc3545', bg: '#f8d7da' };
    if (hoursDiff < 24) return { status: 'UPCOMING', color: '#ffc107', bg: '#fff3cd' };
    return { status: 'CONFIRMED', color: '#28a745', bg: '#d4edda' };
  };

  return (
    <div style={containerStyle}>
      <div style={headerCardStyle}>
        <h2 style={titleStyle}>📋 MY BOOKINGS</h2>
        <div style={subtitleStyle}>Retrieve and manage your flight reservations</div>
      </div>

      <div style={searchCardStyle}>
        <div style={inputGroupStyle}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Passenger Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name as on booking"
              style={inputStyle}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchBookings()}
            />
          </div>
          <button 
            onClick={handleFetchBookings} 
            disabled={loading}
            style={searchButtonStyle}
          >
            {loading ? '🔍 SEARCHING...' : '🔍 FIND MY BOOKINGS'}
          </button>
        </div>
        
        <div style={tipStyle}>
          💡 Tip: Enter your full name exactly as you did when making the booking
        </div>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      {bookings.length > 0 && (
        <div style={resultsContainerStyle}>
          <div style={resultsHeaderStyle}>
            <h3 style={resultsTitleStyle}>
              📊 BOOKING SUMMARY ({bookings.length} booking{bookings.length > 1 ? 's' : ''} found)
            </h3>
            <div style={passengerStyle}>Passenger: {userName}</div>
          </div>

          <div style={bookingsGridStyle}>
            {bookings.map((booking, index) => {
              const statusInfo = getStatusStyle(booking.flight.departureTime);
              return (
                <div key={booking.bookingId} style={bookingCardStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={bookingIdStyle}>Booking #: {booking.bookingId}</div>
                    <div style={{
                      ...statusStyle,
                      color: statusInfo.color,
                      background: statusInfo.bg
                    }}>
                      {statusInfo.status}
                    </div>
                  </div>

                  <div style={flightInfoStyle}>
                    <div style={routeSectionStyle}>
                      <div style={citiesStyle}>
                        <span style={cityStyle}>{booking.flight.source}</span>
                        <span style={arrowStyle}>➝</span>
                        <span style={cityStyle}>{booking.flight.destination}</span>
                      </div>
                      <div style={flightNumberStyle}>
                        Flight: {booking.flight.flightNumber}
                      </div>
                    </div>

                    <div style={timingSectionStyle}>
                      <div style={timeGroupStyle}>
                        <div style={timeLabelStyle}>Departure</div>
                        <div style={timeValueStyle}>
                          {new Date(booking.flight.departureTime).toLocaleString()}
                        </div>
                      </div>
                      <div style={timeGroupStyle}>
                        <div style={timeLabelStyle}>Arrival</div>
                        <div style={timeValueStyle}>
                          {new Date(booking.flight.arrivalTime).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={detailsSectionStyle}>
                      <div style={detailGroupStyle}>
                        <span style={detailLabelStyle}>Seats:</span>
                        <span style={detailValueStyle}>{booking.seatsBooked}</span>
                      </div>
                      <div style={detailGroupStyle}>
                        <span style={detailLabelStyle}>Booked on:</span>
                        <span style={detailValueStyle}>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={detailGroupStyle}>
                        <span style={detailLabelStyle}>Total:</span>
                        <span style={totalPriceStyle}>
                          ₹{(booking.flight.price * booking.seatsBooked).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={actionsStyle}>
                    <button 
                      onClick={() => handleCancel(booking.bookingId, booking.flight.flightNumber)}
                      style={cancelButtonStyle}
                      disabled={statusInfo.status === 'DEPARTED'}
                    >
                      {statusInfo.status === 'DEPARTED' ? 'FLIGHT DEPARTED' : '✖ CANCEL BOOKING'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerCardStyle = {
  background: 'linear-gradient(135deg, #1a2f6b, #2c4fa0)',
  color: 'white',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  textAlign: 'center',
  border: '2px solid #ff9900',
};

const titleStyle = {
  margin: '0 0 5px 0',
  fontSize: '24px',
  fontWeight: 'bold',
};

const subtitleStyle = {
  opacity: '0.9',
  fontSize: '14px',
};

const searchCardStyle = {
  background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
  border: '2px solid #1a2f6b',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const inputGroupStyle = {
  display: 'flex',
  gap: '15px',
  alignItems: 'end',
  marginBottom: '10px',
};

const inputContainerStyle = {
  flex: '1',
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
  padding: '10px 12px',
  border: '2px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  background: '#fff',
};

const searchButtonStyle = {
  background: 'linear-gradient(135deg, #ff9900, #ff6600)',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
  height: 'fit-content',
};

const tipStyle = {
  fontSize: '12px',
  color: '#666',
  fontStyle: 'italic',
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

const resultsContainerStyle = {
  marginTop: '20px',
};

const resultsHeaderStyle = {
  background: 'linear-gradient(135deg, #495057, #6c757d)',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '8px 8px 0 0',
  marginBottom: '0',
};

const resultsTitleStyle = {
  margin: '0 0 5px 0',
  fontSize: '18px',
};

const passengerStyle = {
  fontSize: '14px',
  opacity: '0.9',
};

const bookingsGridStyle = {
  display: 'grid',
  gap: '15px',
  marginTop: '0',
};

const bookingCardStyle = {
  background: 'white',
  border: '2px solid #dee2e6',
  borderRadius: '0 0 8px 8px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid #e9ecef',
};

const bookingIdStyle = {
  fontWeight: 'bold',
  color: '#1a2f6b',
  fontSize: '16px',
};

const statusStyle = {
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const flightInfoStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '20px',
  marginBottom: '15px',
};

const routeSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const citiesStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '18px',
  fontWeight: 'bold',
};

const cityStyle = {
  color: '#1a2f6b',
};

const arrowStyle = {
  color: '#ff9900',
  fontSize: '20px',
};

const flightNumberStyle = {
  color: '#666',
  fontSize: '14px',
};

const timingSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const timeGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const timeLabelStyle = {
  fontSize: '12px',
  color: '#666',
  textTransform: 'uppercase',
  fontWeight: 'bold',
};

const timeValueStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
};

const detailsSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'center',
};

const detailGroupStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const detailLabelStyle = {
  fontSize: '12px',
  color: '#666',
  fontWeight: 'bold',
};

const detailValueStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
};

const totalPriceStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a2f6b',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: '15px',
  borderTop: '1px solid #e9ecef',
};

const cancelButtonStyle = {
  background: 'linear-gradient(135deg, #dc3545, #c82333)',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
};

export default MyBookings;