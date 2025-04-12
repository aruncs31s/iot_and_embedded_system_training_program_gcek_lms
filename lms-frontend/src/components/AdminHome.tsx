import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { FaGraduationCap, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const AdminHome = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    upcomingCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get upcoming courses (start date in the future)
      const today = new Date().toISOString().split('T')[0];
      const { count: upcomingCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .gte('start_date', today);
      
      setStats({
        totalCourses: coursesCount || 0,
        totalUsers: usersCount || 0,
        upcomingCourses: upcomingCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card 
            bg={theme === 'dark' ? 'dark' : 'light'} 
            text={theme === 'dark' ? 'light' : 'dark'}
            className="h-100"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Courses</h6>
                  <h3 className="mb-0">{loading ? '...' : stats.totalCourses}</h3>
                </div>
                <div 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0d6efd'
                  }}
                >
                  <FaGraduationCap size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card 
            bg={theme === 'dark' ? 'dark' : 'light'} 
            text={theme === 'dark' ? 'light' : 'dark'}
            className="h-100"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">{loading ? '...' : stats.totalUsers}</h3>
                </div>
                <div 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(25, 135, 84, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#198754'
                  }}
                >
                  <FaUsers size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card 
            bg={theme === 'dark' ? 'dark' : 'light'} 
            text={theme === 'dark' ? 'light' : 'dark'}
            className="h-100"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Upcoming Courses</h6>
                  <h3 className="mb-0">{loading ? '...' : stats.upcomingCourses}</h3>
                </div>
                <div 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc3545'
                  }}
                >
                  <FaCalendarAlt size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
        <Card.Body>
          <h4 className="mb-4">Welcome to the Admin Dashboard</h4>
          <p>
            From here, you can manage courses, users, and other aspects of your learning management system.
            Use the sidebar navigation to access different sections of the admin panel.
          </p>
          <ul>
            <li>Add, edit, or delete courses</li>
            <li>Manage user accounts and permissions</li>
            <li>View system statistics and reports</li>
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminHome;
