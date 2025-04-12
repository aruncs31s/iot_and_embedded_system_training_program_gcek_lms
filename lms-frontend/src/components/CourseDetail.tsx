import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import { CourseProps } from './CourseCard';
import './CourseDetail.css';

// Sample course data - this would typically come from an API
const sampleCourses: CourseProps[] = [
  {
    id: '1',
    title: 'Introduction to IoT',
    description: 'Learn the fundamentals of Internet of Things (IoT) and how to build simple IoT projects.',
    instructor: 'Dr. Sarah Johnson',
    level: 'Beginner',
    duration: '8 weeks',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: '2',
    title: 'Embedded Systems Programming',
    description: 'Master the art of programming microcontrollers and embedded systems for real-world applications.',
    instructor: 'Prof. Michael Chen',
    level: 'Intermediate',
    duration: '10 weeks',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80'
  },
  {
    id: '3',
    title: 'Advanced Sensor Networks',
    description: 'Design and implement complex sensor networks for industrial and environmental monitoring.',
    instructor: 'Dr. Emily Rodriguez',
    level: 'Advanced',
    duration: '12 weeks',
    imageUrl: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1739&q=80'
  },
  {
    id: '4',
    title: 'IoT Security Fundamentals',
    description: 'Learn essential security practices for protecting IoT devices and networks from vulnerabilities.',
    instructor: 'Prof. James Wilson',
    level: 'Intermediate',
    duration: '6 weeks',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  }
];

// Extended course details with additional information
interface ExtendedCourseProps extends CourseProps {
  syllabus?: string[];
  prerequisites?: string[];
  objectives?: string[];
}

// Add extended details to sample courses
const extendedCourses: ExtendedCourseProps[] = sampleCourses.map(course => {
  const extended: ExtendedCourseProps = { ...course };

  // Add sample extended details based on course ID
  switch(course.id) {
    case '1':
      extended.syllabus = [
        'Introduction to IoT concepts',
        'IoT hardware platforms',
        'Sensors and actuators',
        'Connectivity protocols',
        'Data collection and analysis',
        'Building a simple IoT project'
      ];
      extended.prerequisites = ['Basic programming knowledge', 'Understanding of electronics (helpful but not required)'];
      extended.objectives = [
        'Understand core IoT concepts and architecture',
        'Set up and program basic IoT devices',
        'Connect devices to the internet and cloud platforms',
        'Collect and visualize data from sensors'
      ];
      break;
    case '2':
      extended.syllabus = [
        'Embedded systems architecture',
        'Microcontroller programming',
        'Real-time operating systems',
        'Interfacing with hardware',
        'Debugging techniques',
        'Power management',
        'Final project development'
      ];
      extended.prerequisites = ['Basic C/C++ programming', 'Digital electronics fundamentals'];
      extended.objectives = [
        'Design and implement embedded systems for various applications',
        'Program microcontrollers efficiently',
        'Interface with various sensors and peripherals',
        'Develop robust and power-efficient embedded solutions'
      ];
      break;
    case '3':
      extended.syllabus = [
        'Sensor network architecture',
        'Advanced sensor types and applications',
        'Wireless communication protocols',
        'Data fusion techniques',
        'Network security',
        'Energy harvesting',
        'Large-scale deployment strategies'
      ];
      extended.prerequisites = ['IoT fundamentals', 'Networking basics', 'Programming experience'];
      extended.objectives = [
        'Design complex sensor networks for industrial applications',
        'Implement efficient data collection and transmission strategies',
        'Analyze and process sensor data for meaningful insights',
        'Deploy and maintain large-scale sensor networks'
      ];
      break;
    case '4':
      extended.syllabus = [
        'IoT security landscape',
        'Common vulnerabilities',
        'Secure communication protocols',
        'Authentication and authorization',
        'Encryption techniques',
        'Security testing',
        'Incident response'
      ];
      extended.prerequisites = ['Basic IoT knowledge', 'Networking fundamentals'];
      extended.objectives = [
        'Identify security risks in IoT deployments',
        'Implement secure communication between devices',
        'Protect IoT systems from common attacks',
        'Develop security-first IoT solutions'
      ];
      break;
  }

  return extended;
});

// Function to get badge variant based on level
const getBadgeVariant = (level: string) => {
  switch(level) {
    case 'Beginner':
      return 'success';
    case 'Intermediate':
      return 'warning';
    case 'Advanced':
      return 'danger';
    default:
      return 'primary';
  }
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();

  // Find the course with the matching ID
  const course = extendedCourses.find(c => c.id === id);

  if (!course) {
    return (
      <Container className="mt-5 text-center">
        <h2>Course Not Found</h2>
        <p>The course you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="primary">Back to Courses</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">
        &larr; Back to All Courses
      </Link>

      <Row>
        <Col md={8}>
          <h1>{course.title}</h1>
          <div className="mb-3">
            <Badge bg={getBadgeVariant(course.level)} className="me-2">{course.level}</Badge>
            <Badge bg="info">{course.duration}</Badge>
          </div>
          <p className="lead">{course.description}</p>
          <p><strong>Instructor:</strong> {course.instructor}</p>

          <Card
            className="mt-4 mb-4"
            bg={theme === 'dark' ? 'dark' : 'light'}
            text={theme === 'dark' ? 'light' : 'dark'}
          >
            <Card.Header as="h5">Course Objectives</Card.Header>
            <Card.Body>
              <ul>
                {course.objectives?.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          <Card
            className="mb-4"
            bg={theme === 'dark' ? 'dark' : 'light'}
            text={theme === 'dark' ? 'light' : 'dark'}
          >
            <Card.Header as="h5">Syllabus</Card.Header>
            <Card.Body>
              <ol>
                {course.syllabus?.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ol>
            </Card.Body>
          </Card>

          <Card
            className="mb-4"
            bg={theme === 'dark' ? 'dark' : 'light'}
            text={theme === 'dark' ? 'light' : 'dark'}
          >
            <Card.Header as="h5">Prerequisites</Card.Header>
            <Card.Body>
              <ul>
                {course.prerequisites?.map((prerequisite, index) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="sticky-top"
            style={{ top: '20px' }}
            bg={theme === 'dark' ? 'dark' : 'light'}
            text={theme === 'dark' ? 'light' : 'dark'}
          >
            {course.imageUrl && (
              <Card.Img
                variant="top"
                src={course.imageUrl}
                alt={`${course.title} course`}
              />
            )}
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Text>
                <strong>Duration:</strong> {course.duration}<br />
                <strong>Level:</strong> {course.level}<br />
                <strong>Instructor:</strong> {course.instructor}
              </Card.Text>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg">Enroll Now</Button>
                <Button variant="outline-secondary">Download Syllabus</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;
