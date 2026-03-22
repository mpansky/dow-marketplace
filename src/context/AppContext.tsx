import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type {
  UserRole, StorefrontId, User, Challenge, Vendor, Submission,
  Barrier, PipelineEntry, Notification, Match,
} from '../types'
import { applyStorefrontTheme } from '../lib/themes'
import { challenges } from '../data/challenges'
import { submissions } from '../data/submissions'
import { barriers } from '../data/barriers'
import { pipelineEntries } from '../data/pipeline'
import { notifications } from '../data/notifications'
import { defaultPAE, defaultNDC, defaultAdmin } from '../data/users'
import { vendors } from '../data/vendors'

interface AppState {
  currentRole: UserRole
  currentStorefront: StorefrontId
  currentUser: User | null
  isAuthenticated: boolean
  challenges: Challenge[]
  vendors: Vendor[]
  submissions: Submission[]
  barriers: Barrier[]
  pipelineEntries: PipelineEntry[]
  notifications: Notification[]
  matches: Match[]
  sidebarCollapsed: boolean
  chatOpen: boolean
  searchOpen: boolean
  mobileSidebarOpen: boolean
}

type AppAction =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_STOREFRONT'; payload: StorefrontId }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE'; payload: Challenge }
  | { type: 'ADD_SUBMISSION'; payload: Submission }
  | { type: 'UPDATE_SUBMISSION'; payload: Submission }
  | { type: 'UPDATE_BARRIER'; payload: Barrier }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'ADD_MATCH'; payload: Match }
  | { type: 'UPDATE_MATCH'; payload: Match }
  | { type: 'UPDATE_PIPELINE_ENTRY'; payload: PipelineEntry }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CHAT_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH_OPEN'; payload: boolean }
  | { type: 'SET_MOBILE_SIDEBAR_OPEN'; payload: boolean }

const initialState: AppState = {
  currentRole: 'pae',
  currentStorefront: 'indopacom',
  currentUser: null,
  isAuthenticated: false,
  challenges: [],
  vendors: [],
  submissions: [],
  barriers: [],
  pipelineEntries: [],
  notifications: [],
  matches: [],
  sidebarCollapsed: false,
  chatOpen: false,
  searchOpen: false,
  mobileSidebarOpen: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE': {
      const userMap: Record<UserRole, User> = {
        pae: defaultPAE,
        ndc: defaultNDC,
        admin: defaultAdmin,
      }
      return { ...state, currentRole: action.payload, currentUser: userMap[action.payload] }
    }
    case 'SET_STOREFRONT':
      return { ...state, currentStorefront: action.payload }
    case 'SET_USER':
      return { ...state, currentUser: action.payload, isAuthenticated: true }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    case 'LOAD_DATA':
      return { ...state, ...action.payload }
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [...state.challenges, action.payload] }
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) => (c.id === action.payload.id ? action.payload : c)),
      }
    case 'ADD_SUBMISSION':
      return { ...state, submissions: [...state.submissions, action.payload] }
    case 'UPDATE_SUBMISSION':
      return {
        ...state,
        submissions: state.submissions.map((s) => (s.id === action.payload.id ? action.payload : s)),
      }
    case 'UPDATE_BARRIER':
      return {
        ...state,
        barriers: state.barriers.map((b) => (b.id === action.payload.id ? action.payload : b)),
      }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }
    case 'ADD_MATCH':
      return { ...state, matches: [...state.matches, action.payload] }
    case 'UPDATE_MATCH':
      return {
        ...state,
        matches: state.matches.map((m) => (m.id === action.payload.id ? action.payload : m)),
      }
    case 'UPDATE_PIPELINE_ENTRY':
      return {
        ...state,
        pipelineEntries: state.pipelineEntries.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'SET_CHAT_OPEN':
      return { ...state, chatOpen: action.payload }
    case 'SET_SEARCH_OPEN':
      return { ...state, searchOpen: action.payload }
    case 'SET_MOBILE_SIDEBAR_OPEN':
      return { ...state, mobileSidebarOpen: action.payload }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    dispatch({
      type: 'LOAD_DATA',
      payload: {
        challenges,
        vendors,
        submissions,
        barriers,
        pipelineEntries,
        notifications,
      },
    })
  }, [])

  useEffect(() => {
    applyStorefrontTheme(state.currentStorefront)
  }, [state.currentStorefront])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
