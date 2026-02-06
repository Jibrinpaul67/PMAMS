import { View, Text, StyleSheet } from 'react-native';

export default function Continue() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.text}>
          This is the page after login. You made it.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});
