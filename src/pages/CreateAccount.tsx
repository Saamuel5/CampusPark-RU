import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonCheckbox,
  IonCard,
  IonCardContent,
  IonImg,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { eye, eyeOff, personOutline, idCardOutline, mailOutline, lockClosedOutline, carOutline, accessibilityOutline, arrowBack } from "ionicons/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { saveToCache } from "../utils/storage"; // Import the caching function

const CreateAccount: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isOKU, setIsOKU] = useState<boolean | null>(null);
  const [okuId, setOkuId] = useState("");
  const history = useHistory();

  // Validate the inputs
  const validate = (): boolean => {
    if (!fullName) {
      setMessage("⚠️ Please enter your full name.");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      setMessage("⚠️ Name must contain only letters and spaces.");
      return false;
    }
    if (fullName.trim().split(/\s+/).length < 1) {
      setMessage("⚠️ Full name must have at least 1 word.");
      return false;
    }
    if (!studentId) {
      setMessage("⚠️ Student ID is required.");
      return false;
    }
    if (!/^[A-Z]{1,3}\d{1,15}$/i.test(studentId.trim())) {
      setMessage("⚠️ Use format like BIA123 or BIT123456 (1-3 letters followed by 1-15 numbers).");
      return false;
    }
    if (!email) {
      setMessage("⚠️ Please enter your RU email.");
      return false;
    }
    if (!email.endsWith("@raffles.university")) {
      setMessage("⚠️ Email must end with @raffles.university.");
      return false;
    }
    if (!password || password.length < 6) {
      setMessage("⚠️ Use 6+ characters for your password.");
      return false;
    }
    if (isOKU === null) {
      setMessage("⚠️ Please select if you are an OKU cardholder.");
      return false;
    }
    if (isOKU && !okuId) {
      setMessage("⚠️ Please enter your OKU ID number.");
      return false;
    }
    if (isOKU && okuId && !validateOKUId(okuId)) {
      setMessage("⚠️ Please enter a valid OKU ID format (e.g., A123456 or B1234567).");
      return false;
    }
    if (!agree) {
      setMessage("⚠️ You must agree to the parking guidelines.");
      return false;
    }
    return true;
  };

  // Validate OKU ID format (Malaysian format)
  const validateOKUId = (id: string): boolean => {
    const okuRegex = /^[A-Z][0-9]{6,7}$/;
    return okuRegex.test(id.toUpperCase());
  };

  // Sign-up user and store data in Firestore AND cache
  const handleSignUp = async () => {
    setMessage("");
    if (!validate()) return;

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Prepare user data for Firestore and cache
      const userData = {
        uid: userCredential.user.uid,
        fullName,
        studentId,
        email,
        carPlate: vehicle,
        isOKU,
        okuId,
        timestamp: new Date(),
      };

      // Save to Firestore
      await addDoc(collection(db, "users"), userData);

      // ✅ TASK 3: CACHE USER DATA AFTER SUCCESSFUL ACCOUNT CREATION
      await saveToCache("userData", userData);

      setMessage("✅ Account created successfully! Redirecting to homepage...");
      
      // Redirect after successful account creation
      setTimeout(() => history.push("/home"), 2000);
    } catch (error: any) {
      setMessage("❌ " + error.message);
    }
  };

  // Handle OKU selection
  const handleOKUSelection = (value: string) => {
    if (value === "yes") {
      setIsOKU(true);
    } else if (value === "no") {
      setIsOKU(false);
      setOkuId("");
    } else {
      setIsOKU(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
          "--background": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          "--border-style": "none"
        }}>
          <IonButton
            fill="clear"
            slot="start"
            onClick={() => history.push("/login")}
            style={{ color: "white" }}
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle className="ion-text-center" style={{ color: "white", fontWeight: "700" }}>
            Create Account
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
              Join Raffles University
            </h1>
          </IonText>
          <IonText color="medium">
            <p style={{ fontSize: "14px", margin: "4px 0 0 0" }}>
              Create your parking management account
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
                  {/* Full Name */}
                  <IonItem 
                    style={{ 
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "16px"
                    }}
                  >
                    <IonIcon 
                      icon={personOutline} 
                      slot="start" 
                      style={{ color: "#F97316", marginRight: "12px" }} 
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      Full Name
                    </IonLabel>
                    <IonInput
                      value={fullName}
                      placeholder="Enter your full name"
                      onIonInput={(e) => setFullName(e.detail.value!)}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                  </IonItem>

                  {/* Student ID */}
                  <IonItem 
                    style={{ 
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "16px"
                    }}
                  >
                    <IonIcon 
                      icon={idCardOutline} 
                      slot="start" 
                      style={{ color: "#F97316", marginRight: "12px" }} 
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      Student ID
                    </IonLabel>
                    <IonInput
                      value={studentId}
                      placeholder="RU123456"
                      onIonInput={(e) => setStudentId(e.detail.value!)}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                  </IonItem>

                  {/* Email */}
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
                      placeholder="yourname@raffles-university.edu.my"
                      onIonInput={(e) => setEmail(e.detail.value!)}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                  </IonItem>

                  {/* Password */}
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
                      placeholder="Enter password"
                      onIonInput={(e) => setPassword(e.detail.value!)}
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

                  {/* OKU Selection */}
                  <IonItem 
                    style={{ 
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "16px"
                    }}
                  >
                    <IonIcon 
                      icon={accessibilityOutline} 
                      slot="start" 
                      style={{ color: "#F97316", marginRight: "12px" }} 
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      Are you an OKU cardholder?
                    </IonLabel>
                    <IonSelect
                      placeholder="Choose here"
                      value={isOKU === null ? "" : isOKU ? "yes" : "no"}
                      onIonChange={(e) => handleOKUSelection(e.detail.value)}
                      interface="popover"
                    >
                      <IonSelectOption value="yes">Yes</IonSelectOption>
                      <IonSelectOption value="no">No</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {/* OKU ID (Conditional) */}
                  {isOKU && (
                    <IonItem 
                      style={{ 
                        "--background": "transparent",
                        "--border-color": "rgba(249, 115, 22, 0.2)",
                        "--border-radius": "12px",
                        marginBottom: "16px",
                        animation: "fadeIn 0.3s ease-in"
                      }}
                    >
                      <IonIcon 
                        icon={accessibilityOutline} 
                        slot="start" 
                        style={{ color: "#F97316", marginRight: "12px", opacity: 0.7 }} 
                      />
                      <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                        OKU ID Number
                      </IonLabel>
                      <IonInput
                        value={okuId}
                        placeholder="e.g., A123456 or B1234567"
                        onIonInput={(e) => setOkuId(e.detail.value!)}
                        style={{ fontSize: "16px", color: "#000000" }}
                      />
                    </IonItem>
                  )}

                  {/* Vehicle Plate */}
                  <IonItem 
                    style={{ 
                      "--background": "transparent",
                      "--border-color": "rgba(249, 115, 22, 0.2)",
                      "--border-radius": "12px",
                      marginBottom: "20px"
                    }}
                  >
                    <IonIcon 
                      icon={carOutline} 
                      slot="start" 
                      style={{ color: "#F97316", marginRight: "12px" }} 
                    />
                    <IonLabel position="stacked" style={{ fontWeight: "600", color: "#374151" }}>
                      Vehicle Plate (Optional)
                    </IonLabel>
                    <IonInput
                      value={vehicle}
                      placeholder="e.g., JQR1234"
                      onIonInput={(e) => setVehicle(e.detail.value!)}
                      style={{ fontSize: "16px", color: "#000000" }}
                    />
                  </IonItem>

                  {/* Agreement Checkbox */}
                  <IonItem 
                    lines="none" 
                    style={{ 
                      "--background": "transparent",
                      marginBottom: "24px"
                    }}
                  >
                    <IonCheckbox
                      checked={agree}
                      onIonChange={(e) => setAgree(e.detail.checked)}
                      slot="start"
                      style={{ 
                        "--checkmark-color": "white",
                        "--background-checked": "#F97316",
                        "--border-color-checked": "#F97316"
                      }}
                    />
                    <IonLabel style={{ fontSize: "14px", color: "#6B7280" }}>
                      I agree to the campus parking guidelines
                    </IonLabel>
                  </IonItem>

                  {/* Create Account Button */}
                  <IonButton
                    expand="block"
                    shape="round"
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
                    onClick={handleSignUp}
                  >
                    Create Account
                  </IonButton>

                  {/* Login Redirect */}
                  <IonText color="medium">
                    <p className="ion-text-center ion-margin-top" style={{ fontSize: "14px" }}>
                      Already have an account?{" "}
                      <span
                        onClick={() => history.push("/login")}
                        style={{ 
                          color: "#F97316", 
                          cursor: "pointer",
                          fontWeight: "600",
                          textDecoration: "underline"
                        }}
                      >
                        Log in
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
                      Only RU students/staff may register
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

export default CreateAccount;