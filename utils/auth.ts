import * as SecureStore from 'expo-secure-store';

// Clé pour l'utilisateur inscrit
const PERSISTED_USER_KEY = 'user';

// Clé pour la session active
const SESSION_KEY = 'session_user';

// Enregistre l'utilisateur après inscription
export async function saveUser(user: any) {
  await SecureStore.setItemAsync(PERSISTED_USER_KEY, JSON.stringify(user));
}

// Récupère l'utilisateur inscrit (ex: lors de l'inscription)
export async function getUser() {
  const json = await SecureStore.getItemAsync(PERSISTED_USER_KEY);
  return json ? JSON.parse(json) : null;
}

// Enregistre la session après connexion
export async function setCurrentUserSession(user: any) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
}

// Récupère l'utilisateur connecté
export async function getCurrentUserSession() {
  const json = await SecureStore.getItemAsync(SESSION_KEY);
  return json ? JSON.parse(json) : null;
}

// Déconnecte (efface uniquement la session)
export async function clearCurrentUserSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
