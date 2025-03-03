import { create } from 'zustand'
import { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'

// Define the shape of our auth state
interface AuthState {
  user: User | null        // Stores Firebase User object or null
  loading: boolean         // Tracks authentication loading state
  setUser: (user: User | null) => void    // Function to update user
  setLoading: (loading: boolean) => void   // Function to update loading state
}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,             // Initial user state is null
  
  loading: true,          // Initially loading
  setUser: (user) => set({ user }),      // Updates user state
 
  setLoading: (loading) => set({ loading }) // Updates loading state
}))

// Firebase auth listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user)    // Updates user state when auth changes
  useAuthStore.getState().setLoading(false) // Sets loading to false after check
})
