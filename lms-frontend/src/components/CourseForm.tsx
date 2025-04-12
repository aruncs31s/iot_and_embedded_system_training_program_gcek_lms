import { useState, useRef, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface CourseFormData {
  title: string;
  description: string;
  course_coordinator: string;
  program_coordinator: string;
  apply_date: string;
  start_date: string;
  duration: string;
  level: string;
  instructor: string;
}

const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    course_coordinator: '',
    program_coordinator: '',
    apply_date: '',
    start_date: '',
    duration: '',
    level: 'Beginner',
    instructor: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  // Fetch course data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          course_coordinator: data.course_coordinator || '',
          program_coordinator: data.program_coordinator || '',
          apply_date: data.apply_date ? new Date(data.apply_date).toISOString().split('T')[0] : '',
          start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
          duration: data.duration || '',
          level: data.level || 'Beginner',
          instructor: data.instructor || '',
        });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setMessage({
        type: 'danger',
        text: error instanceof Error ? error.message : 'Failed to fetch course'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      const courseData = {
        ...formData,
        updated_at: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD for date field
      };

      if (isEditMode) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);

        if (error) throw error;

        setMessage({ type: 'success', text: 'Course updated successfully!' });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;

        setMessage({ type: 'success', text: 'Course created successfully!' });
        // Reset form after successful creation
        setFormData({
          title: '',
          description: '',
          course_coordinator: '',
          program_coordinator: '',
          apply_date: '',
          start_date: '',
          duration: '',
          level: 'Beginner',
          instructor: '',
        });
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setMessage({
        type: 'danger',
        text: error instanceof Error ? error.message : 'Failed to save course'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
      <Card.Body>
        <h2 className="mb-4">{isEditMode ? 'Edit Course' : 'Add New Course'}</h2>

        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Course Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter course description"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course Coordinator</Form.Label>
                <Form.Control
                  type="text"
                  name="course_coordinator"
                  value={formData.course_coordinator}
                  onChange={handleChange}
                  required
                  placeholder="Enter course coordinator name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Program Coordinator</Form.Label>
                <Form.Control
                  type="text"
                  name="program_coordinator"
                  value={formData.program_coordinator}
                  onChange={handleChange}
                  required
                  placeholder="Enter program coordinator name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apply By Date</Form.Label>
                <Form.Control
                  type="date"
                  name="apply_date"
                  value={formData.apply_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 8 weeks"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Instructor</Form.Label>
                <Form.Control
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  placeholder="Enter instructor name"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/courses')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Course' : 'Create Course')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CourseForm;
