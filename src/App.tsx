import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AppLayout } from './components/layout/AppLayout'
import { RoleSelector } from './components/layout/RoleSelector'
import { StorefrontHome } from './components/storefront/StorefrontHome'
import { Dashboard } from './components/dashboard/Dashboard'
import { ChallengeList } from './components/challenge/ChallengeList'
import { ChallengeDetail } from './components/challenge/ChallengeDetail'
import { VendorDirectory } from './components/vendor/VendorDirectory'
import { PipelineBoard } from './components/pipeline/PipelineBoard'
import { CurationQueue } from './components/admin/CurationQueue'
import { BarrierTracker } from './components/barriers/BarrierTracker'
import { ProfileBuilder } from './components/profile/ProfileBuilder'

function ChallengeBuilder() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Challenge Builder</h1><p className="text-muted-foreground mt-2">Coming soon.</p></div>
}
function MarketResearch() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Market Research</h1><p className="text-muted-foreground mt-2">Coming soon.</p></div>
}
function SubmissionTracker() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Submission Tracker</h1><p className="text-muted-foreground mt-2">Coming soon.</p></div>
}
function SubmissionBuilder() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Submission Builder</h1><p className="text-muted-foreground mt-2">Coming soon.</p></div>
}
function ReportGenerator() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Report Generator</h1><p className="text-muted-foreground mt-2">Coming soon.</p></div>
}

function AppRoutes() {
  const { state } = useApp()

  if (!state.isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<RoleSelector />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/indopacom" element={<StorefrontHome />} />
        <Route path="/cybercom" element={<StorefrontHome />} />
        <Route path="/challenges" element={<ChallengeList />} />
        <Route path="/challenges/new" element={<ChallengeBuilder />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/vendors" element={<VendorDirectory />} />
        <Route path="/vendors/:id" element={<Navigate to="/vendors" replace />} />
        <Route path="/pipeline" element={<PipelineBoard />} />
        <Route path="/market-research" element={<MarketResearch />} />
        <Route path="/profile" element={<ProfileBuilder />} />
        <Route path="/submissions" element={<SubmissionTracker />} />
        <Route path="/submissions/new/:challengeId" element={<SubmissionBuilder />} />
        <Route path="/admin/curation" element={<CurationQueue />} />
        <Route path="/admin/barriers" element={<BarrierTracker />} />
        <Route path="/barriers" element={<BarrierTracker />} />
        <Route path="/admin/reports" element={<ReportGenerator />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
