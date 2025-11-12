import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom';
import { ADD_USER } from '../graphQl/mutations';
import AuthService from '../utils/auth';

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = AuthService;

  const [addUser] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: {
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      // Use the login function from useAuth hook
      login(data.createUser.token);

      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="hero-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="fade-in">
              <Card.Header>
                <h3 className="text-center mb-0">Create Account</h3>
                <p className="text-center mb-0 opacity-75">Join Mayberry Home Builder</p>
              </Card.Header>
              <Card.Body>
                <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                  <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your signup! Please try again.
                  </Alert>

                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Choose a username'
                      name='username'
                      onChange={handleInputChange}
                      value={userFormData.username}
                      required
                    />
                    <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email Address</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='Enter your email address'
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
                      placeholder='Create a password'
                      name='password'
                      onChange={handleInputChange}
                      value={userFormData.password}
                      required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label htmlFor='password'>Confirm Password</Form.Label>
                    <Form.Control
                      type='confirmPassword'
                      placeholder='Repeat password'
                      name='confirmPassword'
                      onChange={handleInputChange}
                      value={userFormData.confirmPassword}
                      required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    disabled={!(userFormData.username && userFormData.email && userFormData.password) || loading}
                    type='submit'
                    variant='primary'
                    className='w-100 mb-3'
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none fw-semibold">
                        Sign in here
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

export default SignupForm;
