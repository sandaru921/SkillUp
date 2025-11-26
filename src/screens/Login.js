import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, TextInput, useTheme, Card, Paragraph, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

export default function Login({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // Check against locally stored users
      const existingUsers = await AsyncStorage.getItem('@registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Find user with matching email and password
      const user = users.find(
        u => u.email === values.email && u.password === values.password
      );

      if (user) {
        // Login successful
        dispatch(setCredentials({
          user: { 
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name
          },
          token: 'demo-token-' + Date.now()
        }));

        setSnackbarMessage('✓ Logged in successfully!');
        setSnackbarVisible(true);
      } else {
        // Login failed
        setSnackbarMessage('✗ Invalid email or password');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbarMessage('✗ Login failed. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView 
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, paddingTop: 60 }}>
          <Card style={{ padding: 16, marginBottom: 20, backgroundColor: theme.colors.surfaceVariant }}>
            <Card.Content>
              <Paragraph>
                <Text style={{ fontWeight: 'bold' }}>Welcome Back!{'\n'}</Text>
                Login with your registered credentials.{'\n\n'}
               
              </Paragraph>
            </Card.Content>
          </Card>

          <Formik 
            initialValues={{ email: '', password: '' }} 
            validationSchema={LoginSchema} 
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <TextInput 
                  label="Email" 
                  mode="outlined" 
                  onChangeText={handleChange('email')} 
                  onBlur={handleBlur('email')} 
                  value={values.email} 
                  error={touched.email && errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  disabled={isSubmitting}
                />
                {touched.email && errors.email && (
                  <Text style={{ color: theme.colors.error, marginTop: 5, marginBottom: 10 }}>
                    {errors.email}
                  </Text>
                )}
                
                <TextInput 
                  label="Password" 
                  mode="outlined" 
                  secureTextEntry 
                  onChangeText={handleChange('password')} 
                  onBlur={handleBlur('password')} 
                  value={values.password} 
                  error={touched.password && errors.password} 
                  style={{ marginTop: 10 }}
                  disabled={isSubmitting}
                />
                {touched.password && errors.password && (
                  <Text style={{ color: theme.colors.error, marginTop: 5 }}>
                    {errors.password}
                  </Text>
                )}
                
                <Button 
                  mode="contained" 
                  onPress={handleSubmit} 
                  loading={isSubmitting} 
                  disabled={isSubmitting}
                  style={{ marginTop: 20 }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </>
            )}
          </Formik>
          
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Register')} 
            style={{ marginTop: 10 }}
          >
            Don't have an account? Register
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{ marginBottom: 20 }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}