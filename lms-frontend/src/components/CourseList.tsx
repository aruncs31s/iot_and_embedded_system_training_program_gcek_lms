import { Row, Col, Container, Button } from 'react-bootstrap';
import CourseCard, { CourseProps } from './CourseCard';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ITEMS_PER_PAGE = 9;

const CourseList = () => {
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Query with pagination
      const { data, error, count } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });
      console.log('Courses response:', { data, error, count });

      if (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log('Courses found:', data.length, 'Total count:', count);
        // Transform the data to match the CourseProps interface
        const transformedData = data.map((course: any) => ({
          id: course.id.toString(),
          title: course.title || '',
          description: course.description || '',
          course_coordinator: course.course_coordinator || '',
          program_coordinator: course.program_coordinator || '',
          instructor: course.instructor || '',
          level: course.level || 'Beginner',
          duration: course.duration || '',
          image_url: course.image_url || undefined
        }));

        // Update courses state based on page
        setCourses(prev => page === 0 ? transformedData : [...prev, ...transformedData]);

        // Update hasMore state based on count
        setHasMore(count !== null && (page + 1) * ITEMS_PER_PAGE < count);
      } else {
        console.log('No courses found');
        if (page === 0) {
          setCourses([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Exception in fetchCourses:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCourses when the component mounts or page changes
  useEffect(() => {
    fetchCourses();
  }, [page]);


  if (loading) {
    return (
      <Container>
        <div className="text-center">Loading courses...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center text-danger">Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container className="courses-container">
      <h2 className="mb-4 text-center">Available Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center p-5">
          <p>No courses available at the moment.</p>
          <p>Please check back later or contact the administrator.</p>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {courses.map(course => (
              <Col key={course.id}>
                <CourseCard {...course} showDescription={false} />
              </Col>
            ))}
          </Row>
          {hasMore && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default CourseList;
