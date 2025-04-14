import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import img1 from '../assets/image/bubble01.png';
import img2 from '../assets/image/bubble02.png';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onLogin }) => {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Background Images */}
            <Image source={img1} style={styles.bubbleTopRight} />
            <Image source={img2} style={styles.bubbleTopLeft} />
            <Image source={img1} style={styles.bubbleBottom} />
            
            {/* Main Content */}
            <View style={styles.contentContainer}>
              {/* Brand Header */}
              <View style={styles.brandContainer}>
                <Icon name="bag-handle" size={40} color="#5048E5" />
                <Text style={styles.brandName}>ShopWise</Text>
              </View>
              
              {/* Welcome Text */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>
                  Sign in to continue shopping your favorite items
                </Text>
              </View>
              
              {/* Login Form */}
              <View style={styles.formContainer}>
                <LoginForm onLogin={onLogin} />
              </View>
              
              {/* Social Login Options */}
              <View style={styles.socialContainer}>
                <Text style={styles.orText}>Or continue with</Text>
                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-google" size={20} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-facebook" size={20} color="#4267B2" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-apple" size={20} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthProvider>
  );
};

const LoginForm = ({ onLogin }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'Please enter both email and password');
      return;
    }
    
    const result = await login(email, password);
    console.log(result);
    if (result.success) {
      onLogin(); // ✅ this will trigger navigation through App.js state
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.optionsRow}>
        <TouchableOpacity 
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Icon name="checkmark" size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.loginButtonText}>Sign In</Text>
      </TouchableOpacity>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  bubbleTopRight: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.3,
    width: width * 0.9,
    height: height * 0.4,
    opacity: 0.6,
    transform: [{ rotate: '15deg' }],
  },
  bubbleTopLeft: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.4,
    width: width * 0.8,
    height: height * 0.35,
    opacity: 0.5,
  },
  bubbleBottom: {
    position: 'absolute',
    bottom: -height * 0.2,
    left: -width * 0.3,
    width: width * 0.8,
    height: height * 0.35,
    opacity: 0.4,
    transform: [{ rotate: '190deg' }],
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5048E5',
    marginLeft: 8,
  },
  welcomeContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#5048E5',
    borderColor: '#5048E5',
  },
  rememberText: {
    fontSize: 14,
    color: '#4B5563',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#5048E5',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#5048E5',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5048E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#4B5563',
  },
  signupLink: {
    fontSize: 14,
    color: '#5048E5',
    fontWeight: '600',
    marginLeft: 4,
  },
});