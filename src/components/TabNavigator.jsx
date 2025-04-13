// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen'; // Adjust the path as needed
import CartScreen from '../screens/cart/CartScreen'; // Create this screen
// import FavoritesScreen from '../screens/favorites/FavoritesScreen'; // Create this screen
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

// Define the TabBarIcon component
const TabBarIcon = ({ name, focused, color, size }) => {
    return <Ionicons name={name} size={size} color={color} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Cart') {
                iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
            }
            return <TabBarIcon name={iconName} focused={focused} color={color} size={size} />;
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      {/* <Tab.Screen name="Favorites" component={FavoritesScreen} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;