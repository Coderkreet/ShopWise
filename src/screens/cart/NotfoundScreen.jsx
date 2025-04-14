import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const NotFoundPage = () => {
  const navigation = useNavigation();

  const goToHome = () => {
    navigation.navigate('HomeTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Error Code */}
        <View style={styles.errorCodeContainer}>
          <Text style={styles.errorCode}>404</Text>
          <View style={styles.errorLine} />
        </View>
        
        {/* Main Message */}
        <Text style={styles.title}>Page Not Found</Text>
        
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          <View style={styles.ghostContainer}>
            <Text style={styles.ghostIcon}>👻</Text>
          </View>
          <View style={styles.confusedContainer}>
            <Text style={styles.confusedIcon}>❓</Text>
          </View>
        </View>
        
        {/* Description */}
        <Text style={styles.description}>
          Oops! It seems the page you're looking for does not exist or has been moved to another location.
        </Text>
        
        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={goToHome}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>GO TO HOME</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Optional: Decorative elements */}
      <View style={styles.bubbleSmall} />
      <View style={styles.bubbleMedium} />
      <View style={styles.bubbleLarge} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  errorCode: {
    fontSize: 80,
    fontWeight: '800',
    color: '#8A2BE2',
    letterSpacing: -2,
  },
  errorLine: {
    width: 60,
    height: 5,
    backgroundColor: '#8A2BE2',
    borderRadius: 3,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 36,
    textAlign: 'center',
  },
  illustrationContainer: {
    width: width * 0.7,
    height: width * 0.5,
    position: 'relative',
    marginBottom: 36,
  },
  searchIconContainer: {
    position: 'absolute',
    left: width * 0.1,
    top: width * 0.05,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  searchIcon: {
    fontSize: 32,
  },
  ghostContainer: {
    position: 'absolute',
    right: width * 0.15,
    top: width * 0.08,
    width: 70,
    height: 70,
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '10deg' }],
  },
  ghostIcon: {
    fontSize: 38,
  },
  confusedContainer: {
    position: 'absolute',
    bottom: width * 0.05,
    left: width * 0.25,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(138, 43, 226, 0.07)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confusedIcon: {
    fontSize: 28,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  secondaryButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  // Decorative elements - bubbles
  bubbleSmall: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    top: '15%',
    left: '15%',
  },
  bubbleMedium: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    bottom: '20%',
    right: '15%',
  },
  bubbleLarge: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(138, 43, 226, 0.07)',
    top: '70%',
    left: '10%',
  },
});

export default NotFoundPage;