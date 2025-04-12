import { Card, Button, Badge } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './CourseCard.css';

export interface CourseProps {
  id: string;
  title: string;
  description: string;
  course_coordinator: string;
  program_coordinator: string;
  instructor: string;
  level: string;
  duration: string;
  image_url?: string;
  showDescription?: boolean;
}

const CourseCard = ({
  id,
  title,
  description,
  course_coordinator,
  program_coordinator,
  instructor,
  level,
  duration,
  image_url,
  showDescription = false
}: CourseProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Default image from your public assets
  const defaultImage = '/default-course-bg.jpg';

  // Determine badge variant based on level
  const getBadgeVariant = () => {
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

  return (
    <Card
      className="h-100 course-card"
      bg={theme === 'dark' ? 'dark' : 'light'}
      text={theme === 'dark' ? 'light' : 'dark'}
      onClick={() => navigate(`/course/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={image_url || defaultImage}
        alt={title}
        className="course-card-image"
        onError={(e) => {
          // Fallback to default image if the Supabase URL fails to load
          (e.target as HTMLImageElement).src = defaultImage;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>

        {showDescription && description && (
          <Card.Text className="mb-3">{description}</Card.Text>
        )}

        <div className="mb-4">
          <div className="text-label">Course Level</div>
          <div className="text-value">
            <span className="highlight-tag">{level}</span>
            <span className="ms-2">{duration}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-label">Instructor</div>
          <div className="text-value">{instructor}</div>
        </div>

        <div className="divider"></div>

        <div className="mb-4">
          <div className="text-label">Course Coordinator</div>
          <div className="text-value">{course_coordinator}</div>
        </div>

        <div className="mb-4">
          <div className="text-label">Program Coordinator</div>
          <div className="text-value">{program_coordinator}</div>
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button variant="primary">Enroll Now</Button>
            <Button
              variant="outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/course/${id}`);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
