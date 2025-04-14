import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24; // Two items per row with spacing

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const navigation = useNavigation();

  const navigateToProductDetail = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigateToProductDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.ratingValue}>{item.rating?.rate || 0}</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={[
                  styles.star, 
                  { color: i < Math.floor(item.rating?.rate || 0) ? '#8A2BE2' : '#E0E0E0' }
                ]}>★</Text>
              ))}
            </View>
            <Text style={styles.reviewCount}>({item.rating?.count || 0})</Text>
          </View>
          
          {item.quantity > 0 && (
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Qty:</Text>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
              </View>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeButtonText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loaderRing}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
        <Text style={styles.loadingText}>Loading your collection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerCount}>{wishlist.length}</Text>
        </View>
      </View>
      
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>♥</Text>
          </View>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>Save items to shop them later</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.browseButtonText}>BROWSE PRODUCTS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: '#8A2BE2',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  listContainer: {
    padding: 12,
  },
  itemContainer: {
    width: ITEM_WIDTH + 12,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  contentContainer: {
    padding: 12, // Fixed: replaced 'this' with an actual value
  },
  categoryContainer: {
    marginTop: 12,
    marginBottom: 6,
  },
  categoryText: {
    color: '#8A2BE2',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    height: 40,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
    marginRight: 1,
  },
  reviewCount: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666666',
    marginRight: 6,
  },
  quantityBadge: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  quantityValue: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
    marginHorizontal: 10,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 36,
    color: '#8A2BE2',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Wishlist;