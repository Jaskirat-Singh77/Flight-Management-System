// import React from 'react';

// function FlightListUser({ flights, onBook }) {
//   if (flights.length === 0) {
//     return null; // Don't render anything if no flights
//   }

//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
//       <thead>
//         <tr style={{ background: '#f4f4f4' }}>
//           <th style={tableHeaderStyle}>Flight No.</th>
//           <th style={tableHeaderStyle}>From</th>
//           <th style={tableHeaderStyle}>To</th>
//           <th style={tableHeaderStyle}>Departure</th>
//           <th style={tableHeaderStyle}>Arrival</th>
//           <th style={tableHeaderStyle}>Price</th>
//           <th style={tableHeaderStyle}>Seats Available</th>
//           <th style={tableHeaderStyle}>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {flights.map((flight) => (
//           <tr key={flight.flightId}>
//             <td style={tableCellStyle}>{flight.flightNumber}</td>
//             <td style={tableCellStyle}>{flight.source}</td>
//             <td style={tableCellStyle}>{flight.destination}</td>
//             <td style={tableCellStyle}>{new Date(flight.departureTime).toLocaleString()}</td>
//             <td style={tableCellStyle}>{new Date(flight.arrivalTime).toLocaleString()}</td>
//             <td style={tableCellStyle}>₹{flight.price.toFixed(2)}</td>
//             <td style={tableCellStyle}>{flight.availableSeats}</td>
//             <td style={tableCellStyle}>
//               <button 
//                 onClick={() => onBook(flight.flightId)}
//                 disabled={flight.availableSeats === 0}
//               >
//                 {flight.availableSeats === 0 ? 'Sold Out' : 'Book'}
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
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

// export default FlightListUser;



import React from 'react';

function FlightListUser({ flights, onBook, searchParams }) {
  if (flights.length === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={resultsHeaderStyle}>
        <h3 style={resultsTitleStyle}>
          📊 SEARCH RESULTS ({flights.length} flights found)
        </h3>
        <div style={searchSummaryStyle}>
          {searchParams.source} → {searchParams.destination} • {new Date(searchParams.date).toLocaleDateString()} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''} • {searchParams.class}
        </div>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <th style={tableHeaderStyle}>FLIGHT</th>
              <th style={tableHeaderStyle}>ROUTE</th>
              <th style={tableHeaderStyle}>DEPARTURE</th>
              <th style={tableHeaderStyle}>ARRIVAL</th>
              <th style={tableHeaderStyle}>DURATION</th>
              <th style={tableHeaderStyle}>PRICE</th>
              <th style={tableHeaderStyle}>SEATS</th>
              <th style={tableHeaderStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => (
              <FlightRow 
                key={flight.flightId} 
                flight={flight} 
                onBook={onBook}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FlightRow = ({ flight, onBook, index }) => {
  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);
  const duration = Math.round((arrival - departure) / (1000 * 60));
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const isLowAvailability = flight.availableSeats < 10;
  const isLastSeat = flight.availableSeats === 1;

  return (
    <tr style={{
      ...tableRowStyle,
      background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
      borderLeft: isLowAvailability ? '4px solid #dc3545' : '4px solid transparent'
    }}>
      <td style={tableCellStyle}>
        <div style={flightNumberStyle}>{flight.flightNumber}</div>
        <div style={airlineStyle}>SkyBooker Airlines</div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={routeStyle}>
          <span style={cityStyle}>{flight.source}</span>
          <span style={arrowStyle}>➝</span>
          <span style={cityStyle}>{flight.destination}</span>
        </div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={timeStyle}>{departure.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div style={dateStyle}>{departure.toLocaleDateString()}</div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={timeStyle}>{arrival.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div style={dateStyle}>{arrival.toLocaleDateString()}</div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={durationStyle}>
          {hours}h {minutes}m
        </div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={priceStyle}>₹{flight.price.toFixed(2)}</div>
        <div style={priceSubtextStyle}>per person</div>
      </td>
      
      <td style={tableCellStyle}>
        <div style={{
          ...seatsStyle,
          color: isLowAvailability ? '#dc3545' : '#28a745',
          fontWeight: isLowAvailability ? 'bold' : 'normal'
        }}>
          {flight.availableSeats}
          {isLastSeat && <span style={lastSeatStyle}> • LAST SEAT!</span>}
        </div>
        <div style={seatsSubtextStyle}>available</div>
      </td>
      
      <td style={tableCellStyle}>
        <button 
          onClick={() => onBook(flight.flightId)}
          disabled={flight.availableSeats === 0}
          style={flight.availableSeats === 0 ? soldOutButtonStyle : bookButtonStyle}
        >
          {flight.availableSeats === 0 ? 'SOLD OUT' : 'BOOK NOW'}
        </button>
        {isLowAvailability && flight.availableSeats > 0 && (
          <div style={warningStyle}>Selling fast!</div>
        )}
      </td>
    </tr>
  );
};

const containerStyle = {
  marginTop: '20px',
};

const resultsHeaderStyle = {
  background: 'linear-gradient(135deg, #1a2f6b, #2c4fa0)',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '8px 8px 0 0',
  border: '2px solid #1a2f6b',
  borderBottom: 'none',
};

const resultsTitleStyle = {
  margin: '0 0 5px 0',
  fontSize: '18px',
};

const searchSummaryStyle = {
  fontSize: '12px',
  opacity: '0.9',
};

const tableContainerStyle = {
  border: '2px solid #1a2f6b',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  overflow: 'hidden',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'white',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const tableHeaderRowStyle = {
  background: 'linear-gradient(135deg, #495057, #6c757d)',
};

const tableHeaderStyle = {
  padding: '12px 8px',
  border: '1px solid #dee2e6',
  textAlign: 'left',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tableRowStyle = {
  borderBottom: '1px solid #dee2e6',
  transition: 'background 0.2s ease',
};

const tableCellStyle = {
  padding: '12px 8px',
  border: '1px solid #dee2e6',
  verticalAlign: 'middle',
};

const flightNumberStyle = {
  fontWeight: 'bold',
  color: '#1a2f6b',
  fontSize: '14px',
};

const airlineStyle = {
  fontSize: '11px',
  color: '#666',
  marginTop: '2px',
};

const routeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const cityStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
};

const arrowStyle = {
  color: '#ff9900',
  fontSize: '16px',
};

const timeStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#333',
};

const dateStyle = {
  fontSize: '11px',
  color: '#666',
  marginTop: '2px',
};

const durationStyle = {
  fontWeight: 'bold',
  color: '#495057',
  fontSize: '13px',
};

const priceStyle = {
  fontWeight: 'bold',
  color: '#1a2f6b',
  fontSize: '16px',
};

const priceSubtextStyle = {
  fontSize: '10px',
  color: '#666',
  marginTop: '2px',
};

const seatsStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
  textAlign: 'center',
};

const seatsSubtextStyle = {
  fontSize: '10px',
  color: '#666',
  textAlign: 'center',
  marginTop: '2px',
};

const lastSeatStyle = {
  color: '#dc3545',
  fontSize: '10px',
  fontWeight: 'bold',
};

const bookButtonStyle = {
  background: 'linear-gradient(135deg, #28a745, #20c997)',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  width: '100%',
};

const soldOutButtonStyle = {
  ...bookButtonStyle,
  background: 'linear-gradient(135deg, #6c757d, #495057)',
  cursor: 'not-allowed',
  opacity: '0.6',
};

const warningStyle = {
  fontSize: '10px',
  color: '#dc3545',
  fontWeight: 'bold',
  marginTop: '4px',
  textAlign: 'center',
};

export default FlightListUser;