import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUser } from '@/utils/auth'; // adapte le chemin

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setFirstName(user.firstName); // ou user.lastName, ou `${user.firstName} ${user.lastName}`
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Bonjour {firstName} 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
