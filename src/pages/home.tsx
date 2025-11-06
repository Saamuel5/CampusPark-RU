import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonProgressBar,
} from "@ionic/react";
import { 
  car, 
  timeOutline, 
  locationOutline, 
  navigateOutline,
  calendarOutline,
  trophyOutline,
  flashOutline,
  starOutline,
  speedometerOutline,
  shieldCheckmarkOutline,
  sparklesOutline
} from "ionicons/icons";

const Home: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [remainingTime, setRemainingTime] = useState(75); // Minutes

  const handleEndSession = () => {
    setIsSessionActive(false);
    setRemainingTime(0);
  };

  const handleExtendTime = () => {
    setRemainingTime((prev) => prev + 30);
  };

  const styles = `
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .home-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      padding: 16px;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .welcome-title {
      color: white;
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .welcome-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      margin: 0;
      font-weight: 400;
    }

    .card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 
        0 20px 40px rgba(0,0,0,0.1),
        0 8px 32px rgba(0,0,0,0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 25px 50px rgba(0,0,0,0.15),
        0 12px 40px rgba(0,0,0,0.1);
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #FFD700, #F97316, #667eea);
    }

    .card-content {
      padding: 24px;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-icon {
      background: linear-gradient(135deg, #FFD700, #F97316);
      border-radius: 12px;
      padding: 8px;
      margin-right: 12px;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
    }

    .parking-session {
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 2px solid rgba(249, 115, 22, 0.2);
    }

    .session-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .session-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .session-icon {
      background: linear-gradient(135deg, #F97316, #EA580C);
      color: white;
      border-radius: 50%;
      padding: 8px;
    }

    .session-details {
      display: grid;
      gap: 12px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-icon {
      color: #F97316;
      font-size: 1.2rem;
      min-width: 24px;
    }

    .detail-text {
      color: #1a1a1a;
      font-weight: 500;
    }

    .zone-badge {
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 1.1rem;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }

    .time-remaining {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }

    .action-btn {
      --border-radius: 12px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .end-btn {
      --background: linear-gradient(135deg, #EF4444, #DC2626);
      --box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    .extend-btn {
      --background: linear-gradient(135deg, #10B981, #059669);
      --box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    .end-btn:hover {
      --box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
    }

    .extend-btn:hover {
      --box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
    }

    .quick-access-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .access-card {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 20px;
      padding: 24px 16px;
      text-align: center;
      color: white;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }

    .access-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
    }

    .access-card.find-parking {
      background: linear-gradient(135deg, #F97316, #EA580C);
      box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
    }

    .access-card.find-parking:hover {
      box-shadow: 0 12px 35px rgba(249, 115, 22, 0.6);
    }

    .access-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .access-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }

    .zones-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .zone-card {
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      border-radius: 16px;
      padding: 20px 12px;
      text-align: center;
      color: white;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .zone-card:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
    }

    .zone-card.zone-b {
      background: linear-gradient(135deg, #10B981, #059669);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .zone-card.zone-b:hover {
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
    }

    .zone-card.zone-c {
      background: linear-gradient(135deg, #8B5CF6, #7C3AED);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }

    .zone-card.zone-c:hover {
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
    }

    .zone-icon {
      font-size: 1.8rem;
      margin-bottom: 8px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }

    .zone-name {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }

    .stats-card {
      background: linear-gradient(135deg, #1F2937, #111827);
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 8px 0;
      background: linear-gradient(135deg, #FFD700, #F97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value.time-saved {
      background: linear-gradient(135deg, #10B981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #9CA3AF;
      margin: 0;
      font-weight: 500;
    }

    .maintenance-alert {
      background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alert-indicator {
      width: 6px;
      height: 40px;
      background: linear-gradient(135deg, #EF4444, #DC2626);
      border-radius: 3px;
      flex-shrink: 0;
    }

    .alert-text {
      color: #DC2626;
      font-weight: 600;
      margin: 0;
      font-size: 0.95rem;
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
      font-size: 2rem;
      opacity: 0.1;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    .progress-container {
      margin-top: 12px;
    }

    .custom-progress {
      --progress-background: linear-gradient(135deg, #10B981, #059669);
      height: 8px;
      border-radius: 4px;
    }

    @media (max-width: 480px) {
      .quick-access-grid,
      .zones-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `;

  // Inject styles
  if (typeof document !== 'undefined') {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }

  return (
    <IonPage>
      <IonContent className="home-container">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element" style={{ top: '10%', left: '5%' }}>🚗</div>
          <div className="floating-element" style={{ top: '15%', right: '8%' }}>🅿️</div>
          <div className="floating-element" style={{ bottom: '25%', left: '8%' }}>📍</div>
          <div className="floating-element" style={{ bottom: '15%', right: '10%' }}>⏱️</div>
        </div>

        <div className="content-wrapper">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome Back! 👋</h1>
            <p className="welcome-subtitle">Your parking journey starts here</p>
          </div>

          {/* Current Parking Session */}
          {isSessionActive && (
            <div className="card parking-session">
              <div className="card-content">
                <div className="session-header">
                  <div className="session-title">
                    <IonIcon icon={car} className="session-icon" />
                    <IonText>
                      <h2 className="section-title">Currently Parked</h2>
                    </IonText>
                  </div>
                  <div className="zone-badge">Zone B • Lot 124</div>
                </div>

                <div className="session-details">
                  <div className="detail-item">
                    <IonIcon icon={timeOutline} className="detail-icon" />
                    <IonText className="detail-text">
                      {remainingTime} minutes remaining
                    </IonText>
                    <div className="time-remaining">
                      {remainingTime}m left
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <IonIcon icon={shieldCheckmarkOutline} className="detail-icon" />
                    <IonText className="detail-text">Status: Active & Secure</IonText>
                  </div>
                </div>

                <div className="progress-container">
                  <IonProgressBar 
                    value={remainingTime / 100}
                    className="custom-progress"
                  />
                </div>

                <div className="action-buttons">
                  <IonButton 
                    className="action-btn extend-btn"
                    onClick={handleExtendTime}
                  >
                    <IonIcon icon={flashOutline} slot="start" />
                    Extend Time
                  </IonButton>
                  <IonButton 
                    className="action-btn end-btn"
                    onClick={handleEndSession}
                  >
                    <IonIcon icon={speedometerOutline} slot="start" />
                    End Session
                  </IonButton>
                </div>
              </div>
            </div>
          )}

          {/* Quick Access */}
          <div className="card">
            <div className="card-content">
              <div className="section-header">
                <div className="section-icon">
                  <IonIcon icon={navigateOutline} style={{ color: 'white' }} />
                </div>
                <IonText>
                  <h2 className="section-title">Quick Access</h2>
                </IonText>
              </div>

              <div className="quick-access-grid">
                <div
                  className="access-card find-parking"
                  onClick={() => window.location.href = '/zone'}
                >
                  <IonIcon icon={locationOutline} className="access-icon" />
                  <IonText>
                    <p className="access-title">Find Parking</p>
                  </IonText>
                </div>

                <div 
                  className="access-card"
                  onClick={() => window.location.href = '/sessions'}
                >
                  <IonIcon icon={calendarOutline} className="access-icon" />
                  <IonText>
                    <p className="access-title">View Sessions</p>
                  </IonText>
                </div>
              </div>
            </div>
          </div>

          {/* Parking Zones */}
          <div className="card">
            <div className="card-content">
              <div className="section-header">
                <div className="section-icon">
                  <IonIcon icon={trophyOutline} style={{ color: 'white' }} />
                </div>
                <IonText>
                  <h2 className="section-title">Parking Zones</h2>
                </IonText>
              </div>

              <div className="zones-grid">
                <div className="zone-card">
                  <IonIcon icon={car} className="zone-icon" />
                  <IonText>
                    <p className="zone-name">Zone A</p>
                  </IonText>
                </div>

                <div className="zone-card zone-b">
                  <IonIcon icon={car} className="zone-icon" />
                  <IonText>
                    <p className="zone-name">Zone B</p>
                  </IonText>
                </div>

                <div className="zone-card zone-c">
                  <IonIcon icon={car} className="zone-icon" />
                  <IonText>
                    <p className="zone-name">Zone C</p>
                  </IonText>
                </div>
              </div>
            </div>
          </div>



          {/* Maintenance Alert */}
          <div className="maintenance-alert">
            <div className="alert-indicator"></div>
            <IonText>
              <p className="alert-text">
                🚧 Zone D closed for maintenance until Dec 15
              </p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;