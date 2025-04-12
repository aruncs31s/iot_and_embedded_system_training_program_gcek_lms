import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const { user, userProfile, updateProfile, uploadAvatar, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  // Avatar state
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || '');
      setBio(userProfile.bio || '');
      setPhone(userProfile.phone || '');
      setWebsite(userProfile.website || '');
      setAvatar(userProfile.avatar_url || null);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);
      setMessage(null);

      const { error } = await updateProfile({
        full_name: fullName,
        bio,
        phone,
        website,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'danger',
        text: error instanceof Error ? error.message : 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB

    if (fileSize > 5) {
      setMessage({ type: 'danger', text: 'File size should be less than 5MB' });
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      console.log('Starting avatar upload for file:', file.name);
      const { error, url } = await uploadAvatar(file);

      if (error) {
        console.error('Avatar upload returned error:', error);
        let errorMessage = 'Failed to upload avatar';

        // Try to extract a meaningful error message
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          // Handle Supabase error object
          if ('message' in error) {
            errorMessage = error.message as string;
          } else if ('error' in error) {
            errorMessage = error.error as string;
          } else if ('statusText' in error) {
            errorMessage = error.statusText as string;
          }
        }

        setMessage({ type: 'danger', text: errorMessage });
      } else if (url) {
        console.log('Avatar upload successful, URL:', url);
        setAvatar(url);
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      } else {
        console.warn('Avatar upload returned no URL');
        setMessage({ type: 'danger', text: 'Upload succeeded but no image URL was returned' });
      }
    } catch (error) {
      console.error('Unexpected error during avatar upload:', error);
      setMessage({
        type: 'danger',
        text: error instanceof Error ? error.message : 'Unexpected error during upload'
      });
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading profile...</h2>
        <div className="spinner-border mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  // If not logged in, show login message
  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h2>Please log in to view your profile</h2>
      </Container>
    );
  }

  // If logged in but no profile, create a temporary profile view
  if (!userProfile) {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning">
          <h4>Profile data is being loaded or created</h4>
          <p>Your profile information appears to be missing or is still being loaded. Please wait a moment or try refreshing the page.</p>
        </div>
        <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
          <Card.Body className="text-center">
            <div
              style={{
                width: '150px',
                height: '150px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                backgroundColor: '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}
            >
              👤
            </div>
            <h3>{user.email?.split('@')[0] || 'User'}</h3>
            <p className="text-muted">{user.email}</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Your Profile</h1>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col md={4} className="mb-4">
          <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
            <Card.Body className="text-center">
              <div
                onClick={handleAvatarClick}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#e9ecef'
                }}
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      fontSize: '3rem'
                    }}
                  >
                    👤
                  </div>
                )}

                {uploading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    Uploading...
                  </div>
                )}
              </div>

              <p className="text-muted mb-1">Click to change profile picture</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <h3>{fullName}</h3>
              <p className="text-muted">{email}</p>

              {bio && <p>{bio}</p>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
            <Card.Body>
              <h3 className="mb-4">Edit Profile</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Your website URL"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="mt-3"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
