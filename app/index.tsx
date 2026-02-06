import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../asset/mac.jpg')}
      resizeMode="cover"
      style={styles.page}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>PocketAsset</Text>

                 <Text style={styles.subtitle}>Create an account</Text>
        <Text style={styles.desc}>Enter your email to sign up for this app</Text>

          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/continue')}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>

          <Text style={styles.or}>or</Text>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.secondaryText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            By clicking continue, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  bgImage: {
    transform: [
      { scale: 2.2 },   
      { translateX: 0 },  
      { translateY: 0 },  
    ],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },

  card: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity:  0.75,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    zIndex: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
    desc: {
    color: '#666',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  primaryBtn: {
    backgroundColor: '#0A1E4A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  or: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#777',
  },

  secondaryBtn: {
    backgroundColor: '#0D4FB8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  footer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 24,
  },
});
