/**
 * index.tsx
 * 
 * This is the main entry point/home screen of the application.
 * It renders the Dashboard component which serves as the main interface.
 * 
 * Key features:
 * - Serves as the root route ('/')
 * - Renders the Dashboard component
 * - Previously contained a basic "Hello World" template (now commented out)
 * 
 * Things you can tweak:
 * - Modify the main layout structure
 * - Add additional components or features
 * - Customize the page's appearance
 * - Add loading states or error boundaries
 */

// import { StyleSheet, Text, View } from "react-native";

// export default function Page() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.main}>
//         <Text style={styles.title}>Hello World</Text>
//         <Text style={styles.subtitle}>This is the first page of your app.</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     padding: 24,
//   },
//   main: {
//     flex: 1,
//     justifyContent: "center",
//     maxWidth: 960,
//     marginHorizontal: "auto",
//   },
//   title: {
//     fontSize: 64,
//     fontWeight: "bold",
//   },
//   subtitle: {
//     fontSize: 36,
//     color: "#38434D",
//   },
// });

import React from 'react';
import { Dashboard } from '../src/components/dashboard/Dashboard';

export default function Index() {
  return <Dashboard />; // Since I restarted from scratch, Dashboard palang muna nacconnect ko
}