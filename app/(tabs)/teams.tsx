import { StyleSheet, Text, View } from 'react-native';

export default function TeamsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Écran Équipes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
