import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Container, Alert, Button } from 'react-bootstrap';

const SupabaseTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing Supabase connection...');
  const [details, setDetails] = useState<any>(null);

  const testConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Testing Supabase connection...');
      
      // Test the connection with a simple query
      const { data, error } = await supabase.from('courses').select('count(*)', { head: true });
      
      console.log('Supabase test result:', { data, error });
      
      if (error) {
        setStatus('error');
        setMessage(`Connection error: ${error.message}`);
        setDetails(error);
      } else {
        setStatus('success');
        setMessage('Supabase connection successful!');
        setDetails({ data });
        
        // Now try to fetch actual courses
        const { data: courses, error: coursesError } = await supabase.from('courses').select('*').limit(5);
        
        if (coursesError) {
          setStatus('error');
          setMessage(`Could connect but failed to fetch courses: ${coursesError.message}`);
          setDetails(coursesError);
        } else {
          setStatus('success');
          setMessage(`Successfully fetched ${courses?.length || 0} courses`);
          setDetails({ courses });
        }
      }
    } catch (err) {
      setStatus('error');
      setMessage(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDetails(err);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Container className="my-5">
      <h2>Supabase Connection Test</h2>
      
      {status === 'loading' && (
        <Alert variant="info">
          <Alert.Heading>Testing Connection</Alert.Heading>
          <p>{message}</p>
        </Alert>
      )}
      
      {status === 'success' && (
        <Alert variant="success">
          <Alert.Heading>Connection Successful</Alert.Heading>
          <p>{message}</p>
          {details && (
            <pre className="mt-3 p-3 bg-light">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="danger">
          <Alert.Heading>Connection Failed</Alert.Heading>
          <p>{message}</p>
          {details && (
            <pre className="mt-3 p-3 bg-light">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
        </Alert>
      )}
      
      <Button 
        variant="primary" 
        onClick={testConnection}
        disabled={status === 'loading'}
      >
        Test Again
      </Button>
    </Container>
  );
};

export default SupabaseTest;
