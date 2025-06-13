import { useState } from 'react';
import { getUser, saveUser, setCurrentUserSession  } from '@/utils/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import LoadingScreen from '@/components/LoadingScreen';

export default function Login() {
  const [companyId, setCompanyId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const handleLogin = async () => {
  setIsLoading(true);

  const registeredUser = await getUser();

  if (
    registeredUser &&
    registeredUser.companyId === companyId &&
    registeredUser.password === password
  ) {
    await setCurrentUserSession(registeredUser);
    router.replace('/(tabs)');
  } else {
    alert("Identifiants incorrects");
  }

  setIsLoading(false);
};


  return (
    <LinearGradient
      colors={['#FF6B00', '#FF8800', '#FFA200']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="business"
            size={24}
            color="#FF6B00"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Identifiant entreprise"
            value={companyId}
            onChangeText={setCompanyId}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={24}
            color="#FF6B00"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? '#FF6B00' : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Se souvenir de moi</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push('/(auth)')}
        >
          <Text style={styles.signupButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FF6B00',
    fontSize: 16,
  },
});
