import React, { Component } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

import Icon from 'react-native-vector-icons/Ionicons';

export default class ProfileScreen extends Component {
  static contextType = AuthContext;

  handleLogout = () => {
    // Get the logout function from context
    const { logout } = this.context;
    
    // Show confirmation dialog
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              // Call the logout function from AuthContext
              await logout();
               this.props.navigation.navigate('Login')
              // Instead of navigating, we'll let the App component handle the state change
              // which will automatically show the AuthStack
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  render() {
    return (
      <AuthContext.Consumer>
        {({ user, logout }) => (
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            <ScrollView>
              {user ? (
                <View style={styles.contentContainer}>
                  <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <Icon name="person" size={50} />
                      </View>
                    </View>
                    <Text style={styles.name}>
                      {user.name.firstname} {user.name.lastname}
                    </Text>
                    <Text style={styles.username}>@{user.username}</Text>
                  </View>
                  
                  <View style={styles.infoCard}>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Contact Information</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user.email}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>{user.phone}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Address</Text>
                      <Text style={styles.address}>{user.address.street}</Text>
                      <Text style={styles.address}>
                        {user.address.city}, {user.address.zipcode}
                      </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.editButton}
                     onPress={() => this.props.navigation.navigate('NotFound')}
                    activeOpacity={0.8}>
                      <Icon name="pencil" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Orders Section */}
                  <View style={styles.menuCard}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => this.props.navigation.navigate('NotFound')}
                    >
                      <View style={styles.menuIconContainer}>
                        <Icon name="cart" size={22} color="#4F46E5" />
                      </View>
                      <Text style={styles.menuText}>My Orders</Text>
                      <Icon name="chevron-forward" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Wishlist Section */}
                  <View style={styles.menuCard}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => this.props.navigation.navigate('Wishlist')}
                    >
                      <View style={styles.menuIconContainer}>
                        <Icon name="heart" size={22} color="#4F46E5" />
                      </View>
                      <Text style={styles.menuText}>My Wishlist</Text>
                      <Icon name="chevron-forward" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Payment Cards Section */}
                  <View style={styles.menuCard}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => this.props.navigation.navigate('NotFound')}
                    >
                      <View style={styles.menuIconContainer}>
                        <Icon name="card" size={22} color="#4F46E5" />
                      </View>
                      <Text style={styles.menuText}>Payment Cards</Text>
                      <Icon name="chevron-forward" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Logout Button */}
                  <View style={styles.logoutContainer}>
                    <TouchableOpacity 
                      style={styles.logoutButton} 
                      activeOpacity={0.8}
                      onPress={this.handleLogout}
                    >
                      <Icon name="log-out" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyAvatar}>
                    <Icon name="person" size={60} color="#A0AEC0" />
                  </View>
                  <Text style={styles.emptyTitle}>No user data available</Text>
                  <Text style={styles.emptyMessage}>Please sign in to view your profile</Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </AuthContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 30,
    paddingBottom: 25,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#C7D2FE',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
  },
  address: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 100,
  },
  emptyAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});