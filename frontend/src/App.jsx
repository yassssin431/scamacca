import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './components/pages/Login.jsx'
import Dashboard from './components/pages/Dashboard.jsx'
import FinancialTransactions from './components/pages/FinancialTransactions.jsx'
import CommercialCycle from './components/pages/CommercialCycle.jsx'
import MasterData from './components/pages/MasterData.jsx'
import PowerBI from './components/pages/PowerBI.jsx'
import FinancialAnalysis from './components/pages/FinancialAnalysis.jsx'
import AIAnalysis from './components/pages/AIAnalysis.jsx'
import UserManagement from './components/pages/UserManagement.jsx'
import Settings from './components/pages/Settings.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'

function App() {
  useEffect(() => {
    const appearance = localStorage.getItem('appearance')
    const density = localStorage.getItem('density')

    document.body.classList.toggle('dark-mode', appearance === 'dark')
    document.documentElement.setAttribute(
      'data-density',
      density === 'compact' ? 'compact' : 'comfortable'
    )
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/financial-transactions"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Finance']}>
              <FinancialTransactions />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/commercial-cycle"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <CommercialCycle />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/master-data"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <MasterData />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/powerbi"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <PowerBI />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/financial-analysis"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <FinancialAnalysis />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/ai-analysis"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <AIAnalysis />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <RoleProtectedRoute allowedRoles={['Admin', 'Manager', 'Finance']}>
              <Settings />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
