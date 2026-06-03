import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewOrder from './pages/NewOrder'
import CategoryProducts from './pages/CategoryProducts'
import Header from './components/layout/Header'
import Products from './pages/Products'
import Analytics from './pages/Analytics'
import ViewOrders from './pages/ViewOrders'
import ProtectedRoute, { PublicOnlyRoute } from './components/layout/ProtectedRoute'

function ProtectedLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    )
}

const Placeholder = ({ title }) => (
    <div className="section">
        <h2 className="h-title">{title}</h2>
        <p className="muted mt-2">Coming in a later step.</p>
    </div>
)

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicOnlyRoute>
                        <Login />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><Dashboard /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders/new"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><NewOrder /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Step 6: real product picker */}
            <Route
                path="/orders/new/:category"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><CategoryProducts /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><ViewOrders /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><Analytics /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <ProtectedLayout><Products /></ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
