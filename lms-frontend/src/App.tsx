import './App.css'
import NavbarComponent from './components/Navbar'
import CourseList from './components/CourseList'
import CourseDetail from './components/CourseDetail'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import AdminDashboard from './components/AdminDashboard'
import AdminHome from './components/AdminHome'
import AdminCourses from './components/AdminCourses'
import CourseForm from './components/CourseForm'
import SupabaseTest from './components/SupabaseTest'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.tsx'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <NavbarComponent />
            <main className="container mt-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/course/:id" element={
                  <PrivateRoute>
                    <CourseDetail />
                  </PrivateRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }>
                  <Route index element={<AdminHome />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="courses/new" element={<CourseForm />} />
                  <Route path="courses/edit/:id" element={<CourseForm />} />
                </Route>

                <Route path="/test" element={<SupabaseTest />} />

                <Route path="/" element={
                  <>
                    <h1 className="mb-4">Welcome to the LMS</h1>
                    <p className="mb-5">Explore our IoT and Embedded Systems courses below.</p>
                    <CourseList />
                  </>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
