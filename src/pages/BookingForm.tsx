import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToast,
  IonIcon,
  IonText,
} from '@ionic/react';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { car, time, calendar, person, card, navigate, checkmarkCircle, alertCircle } from 'ionicons/icons';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  
  .app-container { 
    min-height: 100vh; 
    padding: 20px 16px; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
  }
  
  .app-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    z-index: 1;
  }
  
  .form-container { 
    max-width: 500px; 
    margin: 0 auto; 
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px; 
    padding: 32px 24px; 
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 2;
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .form-icon {
    background: linear-gradient(135deg, #FFD700, #F97316);
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  }
  
  .form-title { 
    font-size: 28px; 
    font-weight: 800; 
    color: #0F172A;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .form-subtitle {
    color: #64748B;
    font-size: 16px;
    font-weight: 500;
  }
  
  .input-group {
    margin-bottom: 20px;
    position: relative;
  }
  
  .input-label { 
    font-size: 14px; 
    color: #374151; 
    margin: 0 0 8px 0; 
    display: block; 
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-box { 
    width: 100%; 
    padding: 16px 16px 16px 48px; 
    border: 2px solid #E5E7EB; 
    border-radius: 16px; 
    font-size: 16px; 
    background: white; 
    transition: all 0.3s ease; 
    color: #1F2937;
    font-weight: 500;
  }
  
  .input-box:focus { 
    outline: none; 
    border-color: #F97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    background: white; 
  }
  
  .input-box.error-input { 
    border-color: #EF4444; 
    background: #FEF2F2; 
  }
  
  .input-box.success-input {
    border-color: #10B981;
    background: #F0FDF4;
  }
  
  .input-box.readonly { 
    background: #F9FAFB; 
    color: #6B7280; 
    cursor: not-allowed;
    border-color: #D1D5DB;
  }
  
  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF;
    font-size: 20px;
    z-index: 3;
  }
  
  .input-box:focus + .input-icon {
    color: #F97316;
  }
  
  .input-box.error-input + .input-icon {
    color: #EF4444;
  }
  
  .input-box.success-input + .input-icon {
    color: #10B981;
  }
  
  .time-row { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
  }
  
  .parking-type-label { 
    font-size: 14px; 
    color: #374151; 
    margin: 24px 0 12px 0; 
    display: block; 
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .parking-buttons { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 12px; 
    margin-bottom: 24px; 
  }
  
  .parking-btn { 
    height: 56px; 
    border-radius: 16px; 
    font-size: 16px; 
    font-weight: 600; 
    border: 2px solid; 
    cursor: pointer; 
    background: white; 
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .parking-btn.normal { 
    border-color: #E5E7EB; 
    color: #6B7280; 
  }
  
  .parking-btn.normal:hover {
    border-color: #F97316;
    color: #F97316;
  }
  
  .parking-btn.normal.selected { 
    background: linear-gradient(135deg, #FFD700, #F97316);
    border-color: transparent;
    color: white;
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  }
  
  .parking-btn.oku { 
    border-color: #E5E7EB;
    color: #6B7280;
  }
  
  .parking-btn.oku:hover {
    border-color: #10B981;
    color: #10B981;
  }
  
  .parking-btn.oku.selected { 
    background: linear-gradient(135deg, #10B981, #059669);
    border-color: transparent;
    color: white;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }
  
  .action-buttons { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 12px; 
    margin-top: 32px; 
  }
  
  .btn { 
    height: 56px; 
    border-radius: 16px; 
    font-size: 16px; 
    font-weight: 600; 
    border: none; 
    cursor: pointer; 
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .btn-back { 
    background: white; 
    border: 2px solid #E5E7EB; 
    color: #6B7280; 
  }
  
  .btn-back:hover { 
    background: #F9FAFB; 
    border-color: #D1D5DB;
  }
  
  .btn-submit { 
    background: linear-gradient(135deg, #FFD700, #F97316);
    color: white;
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  }
  
  .btn-submit:hover { 
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
  }
  
  .btn-submit:disabled { 
    background: #9CA3AF;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn:disabled { 
    opacity: 0.6; 
    cursor: not-allowed;
    transform: none !important;
  }
  
  .error { 
    color: #EF4444; 
    font-size: 13px; 
    margin: 8px 0 0 8px; 
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .success { 
    color: #10B981; 
    font-size: 13px; 
    margin: 8px 0 0 8px; 
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .duration { 
    color: #10B981; 
    font-weight: 600; 
    text-align: center; 
    margin: 16px 0; 
    font-size: 16px;
    background: rgba(16, 185, 129, 0.1);
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  .zone-info {
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    color: white;
    padding: 16px;
    border-radius: 16px;
    margin: 20px 0;
    text-align: center;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
  
  .zone-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  
  .zone-subtitle {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
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

  @media (max-width: 480px) {
    .form-container {
      padding: 24px 16px;
    }
    
    .time-row {
      grid-template-columns: 1fr;
    }
    
    .parking-buttons {
      grid-template-columns: 1fr;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

interface BookingData {
  bookingId?: string;
  userId: string;
  fullName: string;
  studentId: string;
  carPlate: string;
  date: string;
  timeIn: string;
  timeOut: string;
  duration: string;
  zone: string;
  lotNumber: string;
  parkingType: string;
  bookedBayType: string;
  isOKUBay: boolean;
  status: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Errors {
  fullName?: string;
  studentId?: string;
  carPlate?: string;
  time?: string;
}

const BookingForm: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeIn, setTimeIn] = useState('12:00');
  const [timeOut, setTimeOut] = useState('13:00');
  const [parkingType, setParkingType] = useState('Normal');
  
  // Get zone data from navigation state
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [selectedLot, setSelectedLot] = useState('43');
  
  const [errors, setErrors] = useState<Errors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Check if we have zone data from navigation
    const zoneData = history.state?.selectedZoneId || 'Zone A';
    const zoneName = history.state?.selectedZoneName || 'Zone A';
    
    setSelectedZone(zoneName);
    
    const editData = localStorage.getItem('editingBooking');
    if (editData) {
      try {
        const booking: BookingData = JSON.parse(editData);
        setIsEditMode(true);
        setEditingBookingId(booking.bookingId || null);
        setUserId(booking.userId);
        setFullName(booking.fullName);
        setStudentId(booking.studentId);
        setCarPlate(booking.carPlate);
        setDate(booking.date);
        setTimeIn(booking.timeIn);
        setTimeOut(booking.timeOut);
        setParkingType(booking.parkingType);
        setSelectedZone(booking.zone);
        setSelectedLot(booking.lotNumber);
        localStorage.removeItem('editingBooking');
        console.log('✏️ Edit mode loaded for:', booking.fullName);
      } catch (e) {
        console.error('Error loading edit data:', e);
      }
    } else {
      // Get current user ID from Firebase Auth and prefill user data
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);

        // Prefill user data from Firebase Auth and users collection
        const fetchUserData = async () => {
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setFullName(userData.fullName || '');
              setStudentId(userData.studentId || '');
              setCarPlate(userData.carPlate || '');
              console.log('✅ User data prefilled:', userData.fullName);
            } else {
              // Fallback to email if no user document found
              console.log('⚠️ No user document found, using email as name');
              setFullName(currentUser.email?.split('@')[0] || '');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to email
            setFullName(currentUser.email?.split('@')[0] || '');
          }
        };

        fetchUserData();
      } else {
        console.error('No user logged in');
        // Redirect to login if not authenticated
        window.location.replace('/login');
      }
    }
  }, []);

  // SIMPLIFIED VALIDATION FUNCTIONS
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Enter your full name.';
    if (name.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  };

  const validateStudentId = (id: string): string => {
    if (!id.trim()) return 'Student ID is required.';
    if (id.trim().length < 3) return 'Student ID must be at least 3 characters.';
    return '';
  };

  const validateCarPlate = (plate: string): string => {
    const cleaned = plate.trim().toUpperCase();
    if (!cleaned) return 'Car plate is required.';
    if (cleaned.length < 2) return 'Car plate must be at least 2 characters.';
    return '';
  };

  const validateTime = (): string => {
    if (!timeIn || !timeOut) return 'Both times required.';
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    if (diff <= 0) return 'Time Out must be after Time In.';
    return '';
  };

  const handleNameChange = (value: string) => {
    setFullName(value);
    const error = validateName(value);
    setErrors(prev => ({ ...prev, fullName: error }));
  };

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    const error = validateStudentId(value);
    setErrors(prev => ({ ...prev, studentId: error }));
  };

  const handleCarPlateChange = (value: string) => {
    setCarPlate(value);
    const error = validateCarPlate(value);
    setErrors(prev => ({ ...prev, carPlate: error }));
  };

  const handleTimeChange = () => {
    setTimeout(() => {
      const error = validateTime();
      setErrors(prev => ({ ...prev, time: error }));
    }, 0);
  };

  const getDuration = (): string => {
    if (!timeIn || !timeOut) return '';
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    if (diff <= 0) return '';
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  };

  const validateAll = (): boolean => {
    const newErrors: Errors = {
      fullName: validateName(fullName),
      studentId: validateStudentId(studentId),
      carPlate: validateCarPlate(carPlate),
      time: validateTime()
    };
    
    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof Errors]) {
        delete newErrors[key as keyof Errors];
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('🔵 Submit clicked');
    console.log('Form data:', { fullName, studentId, carPlate, timeIn, timeOut });
    console.log('Errors:', errors);
    
    if (isSubmitting) {
      console.log('⚠️ Already submitting...');
      return;
    }
    
    if (!validateAll()) {
      console.log('❌ Validation failed');
      setToastMessage('⚠️ Please fix all errors before submitting');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    
    console.log('✅ Validation passed');
    setIsSubmitting(true);

    try {
      const bookedBayType = parkingType;
      const bookingData: BookingData = {
        userId,
        fullName: fullName.trim(),
        studentId: studentId.trim().toUpperCase(),
        carPlate: carPlate.trim().toUpperCase(),
        date,
        timeIn,
        timeOut,
        duration: getDuration(),
        zone: selectedZone,
        lotNumber: selectedLot,
        parkingType: parkingType,
        bookedBayType: bookedBayType,
        isOKUBay: bookedBayType === 'OKU',
        status: 'booked'
      };

      console.log('📦 Booking data prepared:', bookingData);

      if (isEditMode && editingBookingId) {
        console.log('🔄 Updating booking...');
        const bookingRef = doc(db, 'parkingBookings', editingBookingId);
        await updateDoc(bookingRef, {
          ...bookingData,
          updatedAt: serverTimestamp()
        });
        console.log('✅ Updated successfully!');
        setToastMessage('✅ Booking updated successfully!');
        setToastColor('success');
        setShowToast(true);
        setTimeout(() => {
          window.location.href = '/sessions';
        }, 1500);
      } else {
        console.log('🔄 Creating new booking...');
        const bookingsRef = collection(db, 'parkingBookings');
        const docRef = await addDoc(bookingsRef, {
          ...bookingData,
          createdAt: serverTimestamp()
        });
        console.log('✅ Created with ID:', docRef.id);
        setToastMessage('✅ Booking created successfully!');
        setToastColor('success');
        setShowToast(true);
        setTimeout(() => {
          window.location.href = '/booking-confirmation';
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      setToastMessage('❌ Error: ' + error.message);
      setToastColor('danger');
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const duration = getDuration();
  
  // SIMPLIFIED FORM VALIDATION - Only check if required fields are filled
  const isFormValid = 
    fullName.trim().length >= 2 && 
    studentId.trim().length >= 3 && 
    carPlate.trim().length >= 2 && 
    !errors.time;

  console.log('Form validation check:', {
    fullName: fullName.length,
    studentId: studentId.length,
    carPlate: carPlate.length,
    timeError: errors.time,
    isFormValid
  });

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
            style={{ 
              color: "white",
              fontWeight: "700",
              fontSize: "20px",
              textAlign: "center"
            }}
          >
            {isEditMode ? 'Edit Booking' : 'Book Parking'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="app-container">
          {/* Floating Elements */}
          <div className="floating-elements">
            <div className="floating-element" style={{ top: '15%', left: '5%' }}>🚗</div>
            <div className="floating-element" style={{ top: '25%', right: '8%' }}>🅿️</div>
            <div className="floating-element" style={{ bottom: '30%', left: '10%' }}>📍</div>
          </div>

          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <div className="form-icon">
                <IonIcon icon={car} style={{ fontSize: "32px", color: "white" }} />
              </div>
              <h1 className="form-title">{isEditMode ? 'Edit Booking' : 'Book Parking'}</h1>
              <p className="form-subtitle">
                {isEditMode ? 'Update your parking details' : 'Fill in your parking information'}
              </p>
            </div>

            {/* Zone Information */}
            <div className="zone-info">
              <div className="zone-title">{selectedZone}</div>
              <div className="zone-subtitle">Lot {selectedLot}</div>
            </div>

            {/* Personal Information */}
            <div className="input-group">
              <label className="input-label">
                <IonIcon icon={person} />
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  className={`input-box ${errors.fullName ? 'error-input' : fullName ? 'success-input' : ''}`}
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
                <IonIcon icon={person} className="input-icon" />
              </div>
              {errors.fullName && (
                <div className="error">
                  <IonIcon icon={alertCircle} />
                  {errors.fullName}
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                <IonIcon icon={card} />
                Student ID
              </label>
              <div className="input-wrapper">
                <input
                  className={`input-box ${errors.studentId ? 'error-input' : studentId ? 'success-input' : ''}`}
                  type="text"
                  placeholder="BIA123456"
                  value={studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                />
                <IonIcon icon={card} className="input-icon" />
              </div>
              {errors.studentId && (
                <div className="error">
                  <IonIcon icon={alertCircle} />
                  {errors.studentId}
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                <IonIcon icon={car} />
                Car Plate
              </label>
              <div className="input-wrapper">
                <input
                  className={`input-box ${errors.carPlate ? 'error-input' : carPlate ? 'success-input' : ''}`}
                  type="text"
                  placeholder="JKL 7890"
                  value={carPlate}
                  onChange={(e) => handleCarPlateChange(e.target.value)}
                />
                <IonIcon icon={car} className="input-icon" />
              </div>
              {errors.carPlate && (
                <div className="error">
                  <IonIcon icon={alertCircle} />
                  {errors.carPlate}
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="input-group">
              <label className="input-label">
                <IonIcon icon={calendar} />
                Date
              </label>
              <div className="input-wrapper">
                <input
                  className="input-box"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <IonIcon icon={calendar} className="input-icon" />
              </div>
            </div>

            <div className="time-row">
              <div className="input-group">
                <label className="input-label">Time In</label>
                <div className="input-wrapper">
                  <select
                    className="input-box"
                    value={timeIn}
                    onChange={(e) => {
                      setTimeIn(e.target.value);
                      handleTimeChange();
                    }}
                  >
                    {Array.from({ length: 19 }, (_, i) => {
                      const hour = i + 12; // Start from 12:00 (noon)
                      const timeValue = `${hour.toString().padStart(2, '0')}:00`;
                      const displayTime = hour === 12 ? '12:00 PM' : hour === 24 ? '12:00 AM' : hour > 12 ? `${(hour - 12).toString().padStart(2, '0')}:00 PM` : `${hour}:00 AM`;
                      return (
                        <option key={timeValue} value={timeValue}>
                          {displayTime}
                        </option>
                      );
                    })}
                  </select>
                  <IonIcon icon={time} className="input-icon" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Time Out</label>
                <div className="input-wrapper">
                  <select
                    className="input-box"
                    value={timeOut}
                    onChange={(e) => {
                      setTimeOut(e.target.value);
                      handleTimeChange();
                    }}
                  >
                    {Array.from({ length: 19 }, (_, i) => {
                      const hour = i + 12; // Start from 12:00 (noon)
                      const timeValue = `${hour.toString().padStart(2, '0')}:00`;
                      const displayTime = hour === 12 ? '12:00 PM' : hour === 24 ? '12:00 AM' : hour > 12 ? `${(hour - 12).toString().padStart(2, '0')}:00 PM` : `${hour}:00 AM`;
                      return (
                        <option key={timeValue} value={timeValue}>
                          {displayTime}
                        </option>
                      );
                    })}
                  </select>
                  <IonIcon icon={time} className="input-icon" />
                </div>
              </div>
            </div>
            
            {errors.time && (
              <div className="error">
                <IonIcon icon={alertCircle} />
                {errors.time}
              </div>
            )}
            
            {duration && (
              <div className="duration">
                <IonIcon icon={checkmarkCircle} />
                Duration: {duration}
              </div>
            )}

            {/* Parking Type */}
            <div className="input-group">
              <span className="parking-type-label">
                <IonIcon icon={navigate} />
                Parking Type
              </span>
              <div className="parking-buttons">
                <button
                  type="button"
                  className={`parking-btn normal ${parkingType === 'Normal' ? 'selected' : ''}`}
                  onClick={() => setParkingType('Normal')}
                >
                  Normal
                </button>
                <button
                  type="button"
                  className={`parking-btn oku ${parkingType === 'OKU' ? 'selected' : ''}`}
                  onClick={() => setParkingType('OKU')}
                >
                  OKU
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-back"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <IonIcon icon={navigate} />
                Back
              </button>
              <button
                type="button"
                className="btn btn-submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : isEditMode ? (
                  <>
                    <IonIcon icon={checkmarkCircle} />
                    Update
                  </>
                ) : (
                  <>
                    <IonIcon icon={checkmarkCircle} />
                    Book Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          style={{ '--width': 'fit-content' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default BookingForm;