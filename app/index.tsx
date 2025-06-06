import { Link, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />
      
      <Text style={styles.title}>Welcome to the App</Text>
      <Text style={styles.description}>Select a screen to navigate:</Text>

      <View style={styles.menuContainer}>
        <Link href="/list" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>List</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/form" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Form</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/user" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>User Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  menuContainer: {
    width: "100%",
  },
  menuItem: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
