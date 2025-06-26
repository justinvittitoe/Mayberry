// see SignupForm.js for comments
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOGIN_USER } from '../utils/mutations';
import { useAuth } from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginUser] = useMutation(LOGIN_USER);

  // Get the return path from location state, or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setLoading(false);
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { email: userFormData.email, password: userFormData.password }
      });

      // Use the login function from useAuth hook
      login(data.login.token);

      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        // Navigate to the page they were trying to access, or home
        navigate(from, { replace: true });
      }, 100);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }

    setUserFormData({ email: '', password: '' });
  };

  return (
    <div className="hero-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="fade-in">
              <Card.Header>
                <h3 className="text-center mb-0">Welcome Back</h3>
                <p className="text-center mb-0 opacity-75">Sign in to your account</p>
              </Card.Header>
              <Card.Body>
                <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                  <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Invalid email or password. Please try again.
                  </Alert>

                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email Address</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='Enter your email'
                      name='email'
                      onChange={handleInputChange}
                      value={userFormData.email}
                      required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='Enter your password'
                      name='password'
                      onChange={handleInputChange}
                      value={userFormData.password}
                      required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    disabled={!(userFormData.email && userFormData.password) || loading}
                    type='submit'
                    variant='primary'
                    className='w-100 mb-3'
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-decoration-none fw-semibold">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginForm;
