import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import LoadingScreen from '@/components/LoadingScreen';
import { saveUser } from '@/utils/auth'; // à ajuster selon ton chemin

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyId: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  

const handleSignUp = async () => {
  try {
    setIsLoading(true);
    
    // Simuler un "user"
    const newUser = {
      id: Date.now().toString(),
      companyId: formData.companyId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    };

    await saveUser(newUser);

    // Navigation après inscription
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Error signing up:', error);
  } finally {
    setIsLoading(false);
  }
};


  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={['#FF6B00', '#FF8800', '#FFA200']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Créer un compte</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={24}
              color="#FF6B00"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={24}
              color="#FF6B00"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="business"
              size={24}
              color="#FF6B00"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.companyId}
              onChangeText={(text) =>
                setFormData({ ...formData, companyId: text })
              }
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
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
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
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>
              Déjà un compte ? Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 20,
    textAlign: 'center',
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
  signupButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FF6B00',
    fontSize: 16,
  },
});
