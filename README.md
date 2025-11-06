# CampusPark_RU  
*A smart parking app for Raffles University students.*

---

## Overview  
**CampusPark_RU** is a smart parking management system developed for **Raffles University** to help students locate available parking spaces in real-time, manage their bookings, and minimize campus traffic congestion.  

This app connects to **Firebase Firestore** for real-time parking lot management and uses **local caching** for offline access and faster data loading.

---

## Features  

-  **Login / Signup** with user role (Normal or OKU)  
-  **Guided introduction page** explaining the app purpose  
-  **Home Dashboard** displaying available parking zones  
-  **Interactive Zone Map** with color-coded parking lots  
  -  Available  
  -  Occupied  
  -  OKU Reserved  
-  **Booking Form** with auto-filled user details  
-  **Booking Confirmation** with edit/delete options  
-  **Session Management** (Active and History tabs)  
-  **Firebase CRUD integration**  
-  **Local caching for offline data**  

---

## App Flow  

### 1) Splash / Logo Page  
Displays the app logo with smooth transition into the login page.  

### 2) Login / Signup  
- New users register with name, student ID, email, password, and parking type (Normal or OKU).  
- OKU users must provide their OKU ID.  
- Returning users can log in using their credentials.  

### 3) Guidance Page  
Introduces the app’s purpose and rules for parking usage on campus.  

### 4) Home Page  
- Displays parking zones (e.g., Zone A, Zone B, Zone C).  
- Shows available and reserved lots.  
- Allows access to user profile and campus parking rules.  

### 5) Zone Page (Parking Layout)  
- Visual map of parking lots.  
- Color-coded statuses:  
  (GREEN) Available | (RED) Occupied | (BLUE) OKU Only  
- If a normal user selects an OKU slot → warning pop-up.  
- Clicking a green lot opens the **Booking Form**.

### 6) Booking Form Page  
- Auto-filled fields: Name, Student ID, Zone, Lot Number.  
- User inputs: Car plate number, Time In, Time Out.  
- Data saved directly to **Firebase Firestore**.

### 7) Confirmation Page  
- Displays booking details for review.  
- Options to **Edit**, **Delete**, or **Return Home**.  

### 8) Sessions Page  
- **Current Tab**: Active bookings (editable).  
- **History Tab**: Past bookings (view-only or deletable).  

---

## Technical Setup  

### Prerequisites  
- Node.js ≥ 18  
- Ionic CLI installed (`npm install -g @ionic/cli`)  
- Firebase account  

### Installation Guide 

```bash
# 1. Clone the repository
git clone https://github.com/Saamuel5/CampusPark_RU.git

# 2. Navigate into the project folder
cd CampusPark_RU

# 3. Install dependencies
npm install

# 4. Run the app in development
ionic serve
```

##  Firebase Setup   

1. Go to [Firebase Console](https://console.firebase.google.com).  
2. Create a new project → Add a Web App.  
3. Copy the Firebase configuration and paste it into `src/environments/environment.ts`:  

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
