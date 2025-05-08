import { create } from 'zustand'
import { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { getUserFromDb } from '../services/authService'

interface AuthState {
  user: User | null
  userDetails: any | null
  loading: boolean
  setUser: (user: User | null) => void
  setUserDetails: (details: any) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userDetails: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserDetails: (details) => set({ userDetails: details }),
  setLoading: (loading) => set({ loading })
}))

onAuthStateChanged(auth, async (user) => {
  useAuthStore.getState().setUser(user)
  if (user) {
    const userDetails = await getUserFromDb(user.uid)
    useAuthStore.getState().setUserDetails(userDetails)
  } else {
    useAuthStore.getState().setUserDetails(null)
  }
  useAuthStore.getState().setLoading(false)
})
