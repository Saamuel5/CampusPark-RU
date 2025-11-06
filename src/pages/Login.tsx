import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonCheckbox,
  IonImg,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { eye, eyeOff, mailOutline, lockClosedOutline } from "ionicons/icons";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { saveToCache } from "../utils/storage"; // Import the caching function

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Check if user is already logged in (remember me functionality)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        history.push("/home");
      }
    });
    return unsubscribe;
  }, [history]);

  const handleLogin = async () => {
    setMessage("");  // Clear any previous messages

    // Basic validation
    if (!email && !password) {
      setMessage("❌ Please enter both email and password.");
      return;
    }
    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }
    if (!password) {
      setMessage("❌ Please enter your password.");
      return;
    }

    try {
      // Attempt to sign in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Query Firestore for user data using UID first, then email as fallback
      const usersRef = collection(db, "users");
      let q = query(usersRef, where("uid", "==", user.uid));
      let querySnapshot = await getDocs(q);

      // If no document found by UID, try to query by email (for backward compatibility)
      if (querySnapshot.empty) {
        q = query(usersRef, where("email", "==", email));
        querySnapshot = await getDocs(q);
      }

      if (!querySnapshot.empty) {
        // ✅ TASK 3: CACHE USER DATA AFTER SUCCESSFUL LOGIN
        const userData = querySnapshot.docs[0].data();
        await saveToCache("userData", {
          uid: user.uid,
          ...userData
        });

        setMessage("✅ Login successful! Redirecting to homepage...");

        // Clear form
        setEmail("");
        setPassword("");

        setTimeout(() => {
          history.push("/home");  // Redirect to homepage after successful login
        }, 1500);
      } else {
        // User authenticated but no profile data found
        setMessage("❌ Account data not found. Please contact support or recreate your account.");
        // Optionally sign out the user since they don't have profile data
        await auth.signOut();
      }

    } catch (error: any) {
      // Handle specific Firebase auth errors
      let errorMessage = "❌ Login failed. Please try again.";

      if (error.code === 'auth/invalid-email') {
        errorMessage = "❌ Invalid email format. Please check your email.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "❌ User not found. Please check your email or create an account.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "❌ Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "❌ Incorrect email and password combination.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "❌ Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "❌ This account has been disabled. Please contact support.";
      }

      setMessage(errorMessage);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
          "--background": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          "--border-style": "none"
        }}>
          <IonTitle className="ion-text-center" style={{ color: "white", fontWeight: "700" }}>
            Login
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{
        "--background": "linear-gradient(180deg, #bc92edff 0%, #ddcfcfff 50%)"
      }}>
        {/* Hero Section */}
        <div className="ion-text-center ion-margin-vertical" style={{ padding: "20px 0" }}>
          <IonImg
            src="raffleslogo.png"
            alt="RU Logo"
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 16px",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)"
            }}
          />
          <IonText color="dark">
            <h1 style={{
              fontWeight: "700",
              fontSize: "24px",
              margin: "8px 0",
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Welcome Back
            </h1>
          </IonText>
          <IonText color="medium">
            <p style={{ fontSize: "14px", margin: "4px 0 0 0" }}>
              Sign in to your CampusPark account
            </p>
          </IonText>
        </div>

        <IonCard style={{
          borderRadius: "20px",
          background: "white",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(249, 115, 22, 0.1)",
          margin: "16px 0"
        }}>
          <IonCardContent style={{ padding: "24px" }}>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  {/* Email Input */}
                  <IonItem
                    style={{
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "16px"
                    }}
                  >
                    <IonIcon
                      icon={mailOutline}
                      slot="start"
                      style={{ color: "#F97316", marginRight: "12px" }}
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      RU Email
                    </IonLabel>
                    <IonInput
                      type="email"
                      value={email}
                      onIonInput={(e) => setEmail(e.detail.value!)}
                      placeholder="yourname@raffles-university.edu.my"
                      onKeyPress={handleKeyPress}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                  </IonItem>

                  {/* Password Input with Eye Icon */}
                  <IonItem
                    style={{
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "16px"
                    }}
                  >
                    <IonIcon
                      icon={lockClosedOutline}
                      slot="start"
                      style={{ color: "#F97316", marginRight: "12px" }}
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      Password
                    </IonLabel>
                    <IonInput
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      placeholder="Enter your password"
                      onKeyPress={handleKeyPress}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                    <IonIcon
                      icon={showPassword ? eyeOff : eye}
                      slot="end"
                      style={{
                        color: "#6B7280",
                        cursor: "pointer",
                        fontSize: "20px"
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </IonItem>

                  {/* Remember Me Checkbox */}
                  <IonItem
                    lines="none"
                    style={{
                      "--background": "transparent",
                      marginBottom: "24px"
                    }}
                  >
                    <IonCheckbox
                      checked={rememberMe}
                      onIonChange={(e) => setRememberMe(e.detail.checked)}
                      slot="start"
                      style={{
                        "--checkmark-color": "white",
                        "--background-checked": "#F97316",
                        "--border-color-checked": "#F97316"
                      }}
                    />
                    <IonLabel style={{ fontSize: "14px", color: "#6B7280" }}>
                      Remember me
                    </IonLabel>
                  </IonItem>

                  {/* Login Button */}
                  <IonButton
                    expand="block"
                    shape="round"
                    onClick={handleLogin}
                    style={{
                      marginTop: "8px",
                      "--background": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                      "--background-activated": "#EA580C",
                      "--background-hover": "#EA580C",
                      "--box-shadow": "0 4px 16px rgba(249, 115, 22, 0.3)",
                      height: "50px",
                      fontWeight: "600",
                      fontSize: "16px"
                    }}
                  >
                    Login
                  </IonButton>

                  {/* Create Account Link */}
                  <IonText color="medium">
                    <p className="ion-text-center ion-margin-top" style={{ fontSize: "14px" }}>
                      Don't have an account?{" "}
                      <span
                        onClick={() => history.push("/createaccount")}
                        style={{
                          color: "#F97316",
                          cursor: "pointer",
                          fontWeight: "600",
                          textDecoration: "underline"
                        }}
                      >
                        Create Account
                      </span>
                    </p>
                  </IonText>

                  {/* Restricted Access Notice */}
                  <IonText color="medium">
                    <p
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        marginTop: "16px",
                        color: "#9CA3AF"
                      }}
                    >
                      Only RU students/staff may login
                    </p>
                  </IonText>

                  {/* Message Display */}
                  {message && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "12px",
                        borderRadius: "12px",
                        background: message.startsWith("✅")
                          ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                          : message.startsWith("❌") || message.startsWith("⚠️")
                          ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                          : "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}
                    >
                      {message}
                    </div>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ion-item-has-focus {
          --border-color: #F97316 !important;
          --border-width: 2px;
        }
      `}</style>
    </IonPage>
  );
};

export default Login;