import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSpinner,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useCachedData } from '../hook';  // Import the caching hook
import { car, navigate, sparkles, location } from "ionicons/icons";

type Zone = {
  id: string;
  name: string;
  availableSpots: number;
};

const ZonePage: React.FC = () => {
  const history = useHistory();

  // Use the caching hook: Load from cache immediately, then fetch live data from Firestore
  const { data: zones, loading } = useCachedData({
    collectionName: 'zones',  // Your Firestore collection name
    storageKey: 'cachedZones',  // Unique key for local storage
  });

  const handleZoneClick = (zoneId: string, zoneName: string) => {
    // Navigate to BookingForm and pass zone information
    history.push({
      pathname: '/booking',
      state: {
        selectedZoneId: zoneId,
        selectedZoneName: zoneName
      }
    });
  };

  const getZoneColor = (spots: number) => {
    if (spots === 0) return "#EF4444";
    if (spots < 5) return "#F59E0B";
    return "#10B981";
  };

  const getZoneIcon = (zoneName: string) => {
    if (zoneName.toLowerCase().includes("premium")) return sparkles;
    if (zoneName.toLowerCase().includes("faculty")) return car;
    return location;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar 
          style={{
            "--background": "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
            "--border-color": "transparent"
          }}
        >
          <IonTitle 
            className="ion-text-center" 
            style={{ 
              color: "white",
              fontWeight: "700",
              fontSize: "20px",
              letterSpacing: "0.5px"
            }}
          >
            Select Parking Zone
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        style={{ 
          "--background": "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
          minHeight: "100vh" 
        }}
      >
        {/* Hero Section */}
        <div 
          style={{ 
            textAlign: "center", 
            padding: "32px 24px 24px",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
            borderRadius: "0 0 32px 32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "8px"
          }}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(249, 115, 22, 0.3)"
            }}
          >
            <IonIcon 
              icon={car} 
              style={{ fontSize: "32px", color: "white" }} 
            />
          </div>
          
          <h1 
            style={{ 
              fontSize: "32px", 
              fontWeight: "800", 
              color: "#0F172A",
              margin: "0 0 4px",
              background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            CampusPark
          </h1>
          
          <IonText color="medium">
            <p style={{ 
              margin: "0 0 16px", 
              fontSize: "16px",
              fontWeight: "500",
              color: "#64748B"
            }}>
              Raffles University
            </p>
          </IonText>
          
          <div 
            style={{
              background: "rgba(249, 115, 22, 0.1)",
              padding: "12px 20px",
              borderRadius: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(249, 115, 22, 0.2)"
            }}
          >
            <IonIcon 
              icon={navigate} 
              style={{ color: "#F97316", fontSize: "18px" }} 
            />
            <span 
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#F97316"
              }}
            >
              Available Zones
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="ion-padding" style={{ paddingTop: "8px" }}>
          {loading && zones.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                gap: "16px"
              }}
            >
              <IonSpinner 
                name="crescent" 
                style={{ 
                  width: "48px", 
                  height: "48px",
                  color: "#F97316" 
                }} 
              />
              <IonText color="medium">
                <p style={{ margin: 0, fontWeight: "500" }}>Loading zones...</p>
              </IonText>
            </div>
          ) : (
            <IonGrid style={{ padding: "0" }}>
              <IonRow>
                {zones.map((zone) => (
                  <IonCol size="12" key={zone.id} style={{ padding: "8px" }}>
                    <IonCard
                      button
                      onClick={() => handleZoneClick(zone.id, zone.name)}
                      style={{
                        borderRadius: "20px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        background: "white",
                        margin: "0",
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.05)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                      }}
                    >
                      <IonCardContent
                        style={{
                          padding: "20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div
                            style={{
                              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                              width: "48px",
                              height: "48px",
                              borderRadius: "14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)"
                            }}
                          >
                            <IonIcon 
                              icon={getZoneIcon(zone.name)} 
                              style={{ fontSize: "24px", color: "white" }} 
                            />
                          </div>
                          
                          <div>
                            <h2
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#0F172A",
                                margin: "0 0 4px",
                              }}
                            >
                              {zone.name}
                            </h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: getZoneColor(zone.availableSpots),
                                  animation: zone.availableSpots > 0 ? "pulse 2s infinite" : "none"
                                }}
                              />
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#64748B",
                                  margin: 0,
                                  fontWeight: "500",
                                }}
                              >
                                {zone.availableSpots} spots available
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px" 
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              color: getZoneColor(zone.availableSpots),
                              fontWeight: "700",
                              padding: "4px 12px",
                              background: `${getZoneColor(zone.availableSpots)}15`,
                              borderRadius: "12px",
                              border: `1px solid ${getZoneColor(zone.availableSpots)}30`
                            }}
                          >
                            {zone.availableSpots === 0 ? "Full" : 
                             zone.availableSpots < 5 ? "Limited" : "Available"}
                          </span>
                          <IonIcon 
                            icon={navigate} 
                            style={{ 
                              fontSize: "20px", 
                              color: "#64748B" 
                            }} 
                          />
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 24px 24px" }}>
          <IonText color="medium">
            <p style={{ 
              margin: 0, 
              fontSize: "14px",
              color: "#94A3B8",
              fontWeight: "500"
            }}>
              {zones.length} parking zones • Real-time availability
            </p>
          </IonText>
        </div>
      </IonContent>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </IonPage>
  );
};

export default ZonePage;