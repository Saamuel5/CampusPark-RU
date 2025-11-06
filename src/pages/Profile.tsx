import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonCard,
  IonCardContent,
  IonIcon,
  IonAvatar,
  IonAlert,
} from "@ionic/react";
import { person, logOut } from "ionicons/icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, updateEmail } from "firebase/auth";
import { useHistory } from "react-router-dom";
import './Profile.css'; // Optional: for custom styling

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [password, setPassword] = useState("");
  const [isOKU, setIsOKU] = useState<boolean | null>(null);
  const [okuId, setOkuId] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const usersRef = collection(db, "users");
          let q = query(usersRef, where("uid", "==", auth.currentUser.uid));
          let querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            q = query(usersRef, where("email", "==", auth.currentUser.email));
            querySnapshot = await getDocs(q);
          }

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            setUserData(data);
            setFullName(data.fullName || "");
            setStudentId(data.studentId || "");
            setEmail(data.email || "");
            setVehicle(data.vehicle || "");
            setIsOKU(data.isOKU || null);
            setOkuId(data.okuId || "");
          } else {
            setMessage("❌ Profile data not found.");
          }
        } catch (error) {
          setMessage("❌ Error loading profile data.");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setMessage("");
    if (!auth.currentUser) return;

    try {
      const emailChanged = email !== auth.currentUser.email;
      const passwordChanged = password.length > 0;

      if ((emailChanged || passwordChanged) && !currentPassword) {
        setMessage("❌ Please enter your current password to make changes.");
        return;
      }

      if (emailChanged || passwordChanged) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      if (emailChanged) {
        // Update email in Firebase Authentication
        await updateEmail(auth.currentUser, email);

        // Sign out the user to reauthenticate with the new email
        await signOut(auth);

        setMessage("✅ Email updated successfully! Please log in with your new email.");
        setTimeout(() => history.push("/login"), 2000);
        return;
      }

      if (passwordChanged) {
        await updatePassword(auth.currentUser, password);
      }

      const usersRef = collection(db, "users");
      let q = query(usersRef, where("uid", "==", auth.currentUser.uid));
      let querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        q = query(usersRef, where("email", "==", auth.currentUser.email));
        querySnapshot = await getDocs(q);
      }

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          fullName,
          studentId,
          email,
          vehicle,
          isOKU,
          okuId,
        });
      }

      setMessage("✅ Profile updated successfully!");
      setEditMode(false);
      setPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      let errorMessage = "❌ Error updating profile.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "❌ Current password is incorrect.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "❌ Password should be at least 6 characters.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "❌ This email is already in use by another account.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "❌ Invalid email format.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "❌ Please log out and log back in to make changes.";
      }
      setMessage(errorMessage);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFullName(userData.fullName || "");
      setStudentId(userData.studentId || "");
      setEmail(userData.email || "");
      setVehicle(userData.vehicle || "");
      setIsOKU(userData.isOKU || null);
      setOkuId(userData.okuId || "");
    }
    setPassword("");
    setCurrentPassword("");
    setEditMode(false);
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage("❌ Error logging out. Please try again.");
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonText>Loading profile...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle className="ion-text-center" style={{ color: "#F97316" }}>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ "--background": "#FFFFFF" }}>
        <IonCard className="profile-card">
          <IonCardContent>
            <div className="profile-image-container">
              <IonAvatar>
                <IonImg src="path_to_profile_picture.png" alt="Profile Picture" />
              </IonAvatar>
              <IonButton fill="clear" className="edit-button">
                <IonIcon icon={person} />
              </IonButton>
            </div>

            <IonItem>
              <IonLabel position="stacked">Full Name</IonLabel>
              <IonInput value={fullName} onIonInput={(e) => setFullName(e.detail.value!)} readonly={!editMode} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Student ID</IonLabel>
              <IonInput value={studentId} onIonInput={(e) => setStudentId(e.detail.value!)} readonly={!editMode} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">RU Email</IonLabel>
              <IonInput type="email" value={email} onIonInput={(e) => setEmail(e.detail.value!)} readonly={!editMode} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Vehicle Plate (Optional)</IonLabel>
              <IonInput value={vehicle} onIonInput={(e) => setVehicle(e.detail.value!)} readonly={!editMode} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Are you an OKU cardholder?</IonLabel>
              <IonSelect
                placeholder="Select option"
                value={isOKU === null ? "" : isOKU ? "yes" : "no"}
                onIonChange={(e) => {
                  if (!editMode) return;
                  if (e.detail.value === "yes") {
                    setIsOKU(true);
                  } else if (e.detail.value === "no") {
                    setIsOKU(false);
                    setOkuId("");
                  } else {
                    setIsOKU(null);
                  }
                }}
                disabled={!editMode}
              >
                <IonSelectOption value="yes">Yes</IonSelectOption>
                <IonSelectOption value="no">No</IonSelectOption>
              </IonSelect>
            </IonItem>

            {isOKU && (
              <IonItem>
                <IonLabel position="stacked">OKU ID Number</IonLabel>
                <IonInput value={okuId} onIonInput={(e) => setOkuId(e.detail.value!)} readonly={!editMode} />
              </IonItem>
            )}

            {editMode && (
              <>
                <IonItem>
                  <IonLabel position="stacked">Current Password</IonLabel>
                  <IonInput
                    type="password"
                    value={currentPassword}
                    onIonInput={(e) => setCurrentPassword(e.detail.value!)}
                    placeholder="Enter current password"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">New Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    placeholder="Enter new password"
                  />
                </IonItem>
              </>
            )}

            <div className="profile-buttons">
              {!editMode ? (
                <IonButton expand="block" onClick={() => setEditMode(true)} style={{ "--background": "#F97316" }}>
                  Edit Profile
                </IonButton>
              ) : (
                <div className="save-cancel-buttons">
                  <IonButton expand="block" onClick={handleSave} style={{ "--background": "#10B981" }}>
                    Save Changes
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={handleCancel}
                    style={{ "--border-color": "#F97316", "--color": "#F97316" }}
                  >
                    Cancel
                  </IonButton>
                </div>
              )}
            </div>

            <div className="logout-section">
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setShowLogoutAlert(true)}
                style={{ "--border-color": "#DC2626", "--color": "#DC2626", "marginTop": "20px" }}
              >
                <IonIcon icon={logOut} slot="start" />
                Logout
              </IonButton>
            </div>

            {message && (
              <IonText color={message.startsWith("✅") ? "success" : "danger"}>
                <p className="ion-text-center" style={{ marginTop: "10px", fontWeight: "500" }}>
                  {message}
                </p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header={'Confirm Logout'}
        message={'Are you sure you want to logout?'}
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: () => setShowLogoutAlert(false),
          },
          {
            text: 'Yes',
            handler: () => {
              setShowLogoutAlert(false);
              handleLogout();
            },
          },
        ]}
      />
    </IonPage>
  );
};

export default Profile;
