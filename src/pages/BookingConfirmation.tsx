import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useCachedData } from '../hook'; // Import the caching hook

interface Booking {
  bookingId: string;
  userId: string;
  fullName: string;
  studentId: string;
  carPlate: string;
  timeIn: string;
  timeOut: string;
  duration: string;
  zone: string;
  lotNumber: string;
  bookedBayType: string;
  parkingType: string;
  status?: string;
}

const BookingConfirmation: React.FC = () => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the caching hook for bookings data
  const { data: allBookings, loading: dataLoading } = useCachedData({
    collectionName: 'parkingBookings',
    storageKey: 'cachedBookings',
  });

  useEffect(() => {
    console.log('🟢 BookingConfirmation loaded');

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user logged in');
      window.location.replace('/login');
      return;
    }

    if (dataLoading) {
      setLoading(true);
      return;
    }

    try {
      // Filter bookings by current user
      const filteredBookings = allBookings.filter((booking: Booking) => 
        booking.userId === currentUser.uid
      );

      console.log('📦 Loaded bookings for user:', filteredBookings.length);
      setUserBookings(filteredBookings);

      if (filteredBookings.length > 0) {
        const latest = filteredBookings[filteredBookings.length - 1];
        setCurrentBooking(latest);
        console.log('✅ Now showing:', latest.fullName);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error processing bookings:', error);
      setLoading(false);
    }
  }, [allBookings, dataLoading]);

  const handleEdit = (booking: Booking) => {
    console.log('✏️ Edit clicked for:', booking.fullName);
    localStorage.setItem('editingBooking', JSON.stringify(booking));
    window.location.replace('/booking');
  };

  const handleDeleteClick = (booking: Booking) => {
    console.log('🗑️ Delete clicked for:', booking.fullName);
    localStorage.setItem('deletingBooking', JSON.stringify(booking));
    window.location.replace('/delete-confirmation');
  };

  const handleDone = () => {
    console.log('✅ Done clicked');
    window.location.replace('/');
  };

  const styles = `
    .booking-confirmation {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow: hidden;
    }

    .booking-confirmation::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    }

    .confirmation-container {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .confirmation-card {
      max-width: 440px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 40px 32px;
      box-shadow: 
        0 20px 40px rgba(0,0,0,0.1),
        0 8px 32px rgba(0,0,0,0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .confirmation-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #FFD700, #F97316, #FF6B6B);
    }

    .success-icon {
      text-align: center;
      margin-bottom: 20px;
    }

    .success-icon-inner {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #4ADE80, #22C55E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 8px 25px rgba(74, 222, 128, 0.4);
    }

    .success-icon-inner span {
      font-size: 36px;
      color: white;
    }

    .card-title {
      font-size: 32px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      text-align: center;
      background: linear-gradient(135deg, #1a1a1a, #4a5568);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-subtitle {
      font-size: 16px;
      color: #666;
      text-align: center;
      margin-bottom: 32px;
      font-weight: 400;
    }

    .status-badge {
      background: linear-gradient(135deg, #FFD700, #F97316);
      color: white;
      padding: 16px 24px;
      border-radius: 16px;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 32px;
      box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-name {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 32px;
      text-align: center;
      padding: 16px;
      background: rgba(255, 215, 0, 0.1);
      border-radius: 12px;
      border-left: 4px solid #FFD700;
    }

    .details-container {
      background: rgba(255, 255, 255, 0.6);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
    }

    .detail-row:hover {
      background: rgba(162, 252, 193, 0.8);
      padding-left: 12px;
      padding-right: 12px;
      margin: 0 -12px;
      border-radius: 8px;
    }

    .detail-row:last-of-type {
      border-bottom: none;
    }

    .detail-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-label::before {
      content: '•';
      color: #F97316;
      font-size: 20px;
    }

    .detail-value {
      color: #1a1a1a;
      font-size: 15px;
      font-weight: 600;
      text-align: right;
      background: rgba(255, 215, 0, 0.1);
      padding: 6px 12px;
      border-radius: 8px;
      min-width: 120px;
    }

    .button-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 32px;
    }

    .action-btn {
      height: 52px;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .action-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .action-btn:hover::before {
      left: 100%;
    }

    .btn-edit {
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      color: white;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
    }

    .btn-delete {
      background: linear-gradient(135deg, #EF4444, #DC2626);
      color: white;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    .btn-delete:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
    }

    .btn-done {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-done:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
    }

    .university-logo {
      margin-top: 40px;
      text-align: center;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 20px 30px;
      border-radius: 20px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .logo-ru {
      font-size: 42px;
      font-weight: 900;
      background: linear-gradient(135deg, #FFD700, #F97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin: 0 0 8px 0;
    }

    .logo-text {
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.4;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .no-bookings {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .no-bookings-icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .floating-element {
      position: absolute;
      font-size: 24px;
      opacity: 0.1;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .booking-count {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .confirmation-card {
        margin: 20px;
        padding: 30px 20px;
      }
      
      .button-group {
        grid-template-columns: 1fr;
      }
      
      .detail-value {
        min-width: 100px;
        font-size: 14px;
      }
    }
  `;

  // Inject styles
  if (typeof document !== 'undefined') {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }

  if (loading) {
    return (
      <IonPage>
        <IonContent className="booking-confirmation">
          <div className="floating-elements">
            <div className="floating-element" style={{ top: '15%', left: '10%' }}>🚗</div>
            <div className="floating-element" style={{ top: '25%', right: '15%' }}>🅿️</div>
            <div className="floating-element" style={{ bottom: '30%', left: '15%' }}>📍</div>
          </div>
          <div className="confirmation-container">
            <div className="loading">
              <div className="loading-spinner"></div>
              <h2 style={{ marginBottom: '8px' }}>Loading Your Booking</h2>
              <p style={{ opacity: 0.8 }}>Getting your parking details ready...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!currentBooking || userBookings.length === 0) {
    return (
      <IonPage>
        <IonContent className="booking-confirmation">
          <div className="floating-elements">
            <div className="floating-element" style={{ top: '20%', left: '15%' }}>🚗</div>
            <div className="floating-element" style={{ top: '35%', right: '20%' }}>🅿️</div>
          </div>
          <div className="confirmation-container">
            <div className="no-bookings">
              <div className="no-bookings-icon">📋</div>
              <h2 style={{ marginBottom: '12px' }}>No Bookings Found</h2>
              <p style={{ opacity: 0.8, marginBottom: '30px' }}>Create your first parking reservation</p>
              <IonButton 
                color="primary" 
                onClick={() => window.location.replace('/booking')}
                style={{
                  '--background': 'linear-gradient(135deg, #FFD700, #F97316)',
                  '--border-radius': '12px',
                  '--padding-top': '16px',
                  '--padding-bottom': '16px'
                }}
              >
                Book Parking Now
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="booking-confirmation">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element" style={{ top: '10%', left: '5%' }}>🚗</div>
          <div className="floating-element" style={{ top: '15%', right: '8%' }}>🅿️</div>
          <div className="floating-element" style={{ bottom: '25%', left: '8%' }}>📍</div>
          <div className="floating-element" style={{ bottom: '15%', right: '10%' }}>⏱️</div>
        </div>

        {/* Booking Count Badge */}
        <div className="booking-count">
          {userBookings.length} Booking{userBookings.length !== 1 ? 's' : ''}
        </div>

        <div className="confirmation-container">
          <div className="confirmation-card">
            {/* Success Icon */}
            <div className="success-icon">
              <div className="success-icon-inner">
                <span>✓</span>
              </div>
            </div>

            <h1 className="card-title">Booking Confirmed!</h1>
            <p className="card-subtitle">Your parking spot is reserved and ready</p>
            
            <div className="status-badge">
              🅿️ {currentBooking.zone} • Lot {currentBooking.lotNumber} • {currentBooking.status || 'Confirmed'}
            </div>
            
            <div className="user-name">
              👤 {currentBooking.fullName}
            </div>
            
            <div className="details-container">
              <div className="detail-row">
                <span className="detail-label">Student ID</span>
                <span className="detail-value">🎓 {currentBooking.studentId}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Parking Type</span>
                <span className="detail-value">🚙 {currentBooking.bookedBayType}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Car Plate</span>
                <span className="detail-value">🚘 {currentBooking.carPlate}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Time In</span>
                <span className="detail-value">⏰ {currentBooking.timeIn}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Time Out</span>
                <span className="detail-value">⏱️ {currentBooking.timeOut}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">📅 {currentBooking.duration}</span>
              </div>
            </div>
            
            <div className="button-group">
              <button 
                className="action-btn btn-edit"
                onClick={() => handleEdit(currentBooking)}
              >
                <span>✏️</span> Edit
              </button>
              
              <button 
                className="action-btn btn-delete"
                onClick={() => handleDeleteClick(currentBooking)}
              >
                <span>🗑️</span> Delete
              </button>
              
              <button 
                className="action-btn btn-done"
                onClick={handleDone}
              >
                <span>✅</span> All Done
              </button>
            </div>
          </div>
          
          <div className="university-logo">
            <p className="logo-ru">RU</p>
            <p className="logo-text">Raffles University<br/>Campus Parking</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingConfirmation;