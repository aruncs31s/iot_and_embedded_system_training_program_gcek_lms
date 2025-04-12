import { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Course {
  id: number;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  apply_date: string;
  start_date: string;
  created_at: string;
  image_url?: string;
}

// Removed unused interface
// interface CourseFormData {
//   title: string;
//   instructor: string;
//   level: string;
//   duration: string;
//   apply_date: string;
//   start_date: string;
//   image_url?: string;
// }

const AdminCourses = () => {
  // We don't need theme anymore since we're using CSS variables
  // const { theme } = useTheme();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // Removed unused image upload functionality

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('courses')
        .select('id, title, instructor, level, duration, apply_date, start_date, created_at, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleteId(id);

      // Delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the courses list
      setCourses(prev => prev.filter(course => course.id !== id));
      setMessage({ type: 'success', text: 'Course deleted successfully' });
    } catch (err) {
      console.error('Error deleting course:', err);
      setMessage({
        type: 'danger',
        text: err instanceof Error ? err.message : 'Failed to delete course'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch(level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="admin-card">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Courses</h2>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/courses/new')}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" /> Add New Course
          </Button>
        </div>

        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : courses.length === 0 ? (
          <Alert variant="info">
            No courses found. Click "Add New Course" to create one.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Apply By</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>
                      <Badge bg={getLevelBadgeVariant(course.level)}>
                        {course.level}
                      </Badge>
                    </td>
                    <td>{course.duration}</td>
                    <td>{formatDate(course.apply_date)}</td>
                    <td>{formatDate(course.start_date)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          disabled={deleteId === course.id}
                        >
                          {deleteId === course.id ? <Spinner size="sm" animation="border" /> : <FaTrash />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminCourses;
