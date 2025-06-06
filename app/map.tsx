import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.infoText}>
          To implement the actual map functionality, you&apos;ll need to install these packages:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>npm install react-native-maps expo-location</Text>
        </View>
        <Text style={styles.infoText}>
          For Google Maps integration, you&apos;ll also need to configure your API keys in app.json:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY"
    }
  }
},
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_API_KEY"
  }
}`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapPlaceholder: {
    width: screenWidth,
    height: screenHeight * 0.6,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  codeBlock: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  codeText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
  }
}); 