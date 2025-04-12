import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Effect to navigate after successful login
  useEffect(() => {
    if (user) {
      console.log('User authenticated, checking profile...');
      if (userProfile) {
        console.log('Profile found, navigating to home');
        navigate('/');
      } else {
        console.log('Waiting for profile to load...');
        // Keep the loading state active while waiting for profile
        setLoading(true);

        // Set a timeout to navigate anyway after 5 seconds
        const timeoutId = setTimeout(() => {
          console.log('Profile loading timeout reached, navigating anyway');
          navigate('/');
        }, 5000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Login form submitted');
      setError('');
      setLoading(true);

      // Attempt to sign in
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful, waiting for profile to load');
      // Navigation will happen in the useEffect when user and userProfile are set

      // Set a cookie to help with session persistence
      document.cookie = 'lms-logged-in=true; path=/; max-age=604800'; // 7 days
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      setLoading(false);
    }
  };

  // If already authenticated and not in loading state, redirect to home
  if (user && !authLoading && !loading) {
    // Use useEffect for the redirect
    useEffect(() => {
      const redirectTimer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(redirectTimer);
    }, []);

    return (
      <Container className="mt-5 text-center">
        <Alert variant="info">
          You are already logged in. Redirecting to home page...
        </Alert>
      </Container>
    );
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Checking authentication status...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && (
              <Alert variant="info">
                {user ? (
                  <>
                    Setting up your profile...
                    <div className="mt-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => navigate('/')}
                      >
                        Skip and go to home
                      </Button>
                    </div>
                  </>
                ) : 'Logging in...'}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Log In
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center">
            <div>
              Don't have an account? <Button variant="link" onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
};

export default Login;