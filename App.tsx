// import React from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { useEffect, useState } from 'react';
// // import { storage } from './utils/storage';
// // import { User } from './types';
// // import { LoginForm } from './components/layouts/auth/LoginForm';
// // import { RegisterForm } from './components/layouts/auth/RegisterForm';
// // import { OnboardingForm } from './components/layouts/onboarding/OnboardingForm';
// // import { Dashboard } from './components/dashboard/FDashboard';
// // import { Settings } from './components/common/settings/Settings';

// function App() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = storage.getUser();
//     const authToken = storage.getAuth();
    
//     if (storedUser && authToken) {
//       setUser(storedUser);
//     } else {
//       storage.clearAll(); // Clear any inconsistent state
//       setUser(null);
//     }
    
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Routes>
//           <Route 
//             path="/login" 
//             element={user ? <Navigate to="/dashboard" /> : <LoginForm />} 
//           />
//           <Route 
//             path="/register" 
//             element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} 
//           />
//           <Route 
//             path="/onboarding" 
//             element={!user ? <Navigate to="/login" /> : <OnboardingForm />} 
//           />
//           <Route 
//             path="/dashboard" 
//             element={!user ? <Navigate to="/login" /> : <Dashboard />} 
//           />
//           <Route 
//             path="/settings" 
//             element={!user ? <Navigate to="/login" /> : <Settings />} 
//           />
//           <Route 
//             path="/" 
//             element={<Navigate to={user ? "/dashboard" : "/login"} />} 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from './src/components/dashboard/Dashboard';
import { LanguageProvider } from './src/components/common/LanguageContext';

// Create stack navigator
const Stack = createStackNavigator();

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Fredoka': require('./src/assets/fonts/Fredoka.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null; // Or a loading screen
    }

    return (
        <LanguageProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen 
                        name="Dashboard" 
                        component={Dashboard}
                        options={{ headerShown: false }}
                    />
                    {/* Add other screens here as needed */}
                </Stack.Navigator>
            </NavigationContainer>
        </LanguageProvider>
    );
}