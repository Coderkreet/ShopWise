// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text, Platform, Button } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ProductDetailsScreen from './src/screens/home/ProductDetailsScreen';
import { ProductProvider } from './src/context/ProductContext';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Alllproducts from './src/screens/products/Alllproducts';
import CartScreen from './src/screens/cart/CartScreen';
import { WishlistProvider } from './src/context/WishlistContext';
import Wishlist from './src/screens/cart/Wishlist';
import NotFoundPage from './src/screens/cart/NotfoundScreen';
// import Toast from 'react-native-toast-message';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (after login)
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6B4EFF',
        tabBarInactiveTintColor: '#7A869A',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={styles.tabIconContainer}>
              <Icon name={focused ? "home" : "home-outline"} size={24} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Products" 
        component={Alllproducts}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={styles.tabIconContainer}>
              <Icon name={focused ? "cube" : "cube-outline"} size={24} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name='Cart' 
        component={CartScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={styles.tabIconContainer}>
              <Icon name={focused ? "cart" : "cart-outline"} size={24} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name='Profile' 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={styles.tabIconContainer}>
              <Icon name={focused ? "person" : "person-outline"} size={24} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack (before login)
const AuthStack = ({ onLogin, onLogout }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {props => <LoginScreen {...props} onLogin={onLogin} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Main App Stack (after login)
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailsScreen} 
        options={{
          headerStyle: styles.header,
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="NotFound" component={NotFoundPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        console.log('Fetched products:', data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    loadProducts();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <NavigationContainer>
              {isLoggedIn ? (
                <MainStack />
              ) : (
                <AuthStack onLogin={handleLogin} onLogout={handleLogout} />
              )}
            </NavigationContainer>
            {/* <Toast /> */}
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B4EFF',
  },
  tabBarLabel: {
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  header: {
    backgroundColor: '#6B4EFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});