import React, { useContext, useState, useCallback, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductContext } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWishlist } from '../../context/WishlistContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

const AllProducts = () => {
  const navigation = useNavigation();
  const { products } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState(''); // New state for input field
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const categories = ['All', `men's clothing`, 'jewelery', `women's clothing`, 'electronics'];
  const {addToWishlist , removeFromWishlist,isInWishlist} = useWishlist();
  // Handle the products data structure where rating is an object with rate and count properties
  const getProductRating = (product) => {
    if (!product.rating) return { rate: 0, count: 0 };
    
    // If rating is already in the correct format
    if (typeof product.rating === 'number') {
      return { rate: product.rating, count: product.reviews || 0 };
    }
    
    // If rating is an object with rate and count properties
    if (product.rating.rate !== undefined) {
      return { rate: product.rating.rate, count: product.rating.count || 0 };
    }
    
    return { rate: 0, count: 0 };
  };

  // This effect now only runs when searchQuery changes, not on every input character
  useEffect(() => {
    if (!products) return;
    
    setIsLoading(true);
    // Simulate search delay
    const timer = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  useEffect(() => {
    if (!products) return;
    
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      // Assuming products have a 'category' field
      const filtered = products.filter(product => 
        product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    
    if (isSearching) {
      setTempSearchQuery('');
      setSearchQuery('');
    }
  };

  // New function to handle search button press
  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
  };

  const handleNavigate = () => {
    navigation.navigate('Login');
  };

  const navigateToProductDetail = useCallback((product) => {
    navigation.navigate('ProductDetail', { product });
  }, [navigation]);

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  const navigateToWishlist = () => {
    navigation.navigate('Wishlist');
  };

  const renderProduct = useCallback(({ item }) => {
    const ratingInfo = getProductRating(item);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => navigateToProductDetail(item)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage} 
            resizeMode="contain"
            // defaultSource={require('../../assets/placeholder-image.png')} // Assuming you have this asset
          />
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={() => {
              if (isInWishlist(item.id)) {
                removeFromWishlist(item.id);
              } else {
                addToWishlist(item);
              }
            }}
          >
            <Icon 
              name={isInWishlist(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={isInWishlist(item.id) ? "#FF3B30" : "#000000"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text numberOfLines={2} style={styles.productTitle} accessibilityLabel={`Product: ${item.title}`}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Text key={index} style={index < Math.floor(ratingInfo.rate) ? styles.starFilled : styles.starEmpty}>★</Text>
              ))}
            </View>
            <Text style={styles.ratingText}>({ratingInfo.count})</Text>
          </View>
          <TouchableOpacity   onPress={async () => {
                await AsyncStorage.setItem('cartItem', JSON.stringify(item.id));
                addToCart(item);
              }} style={styles.addToCartButton}>
            <Text
            
            style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [navigateToProductDetail, isInWishlist, addToWishlist, removeFromWishlist]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        selectedCategory === item && styles.activeCategoryItem
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text 
        style={[
          styles.categoryText, 
          selectedCategory === item && styles.activeCategoryText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Discover Products</Text>
        </View>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToWishlist}>
            <Text style={styles.iconText}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToCart}>
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Modified search field with search button */}
      {isSearching && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={tempSearchQuery}
            onChangeText={setTempSearchQuery}
            autoFocus={isSearching}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator style={styles.searchLoader} color="#5048E5" />}
        </View>
      )}

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        />
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
      </View>
    </View>
  );

  if (!products || products.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5445/5445197.png' }} 
          style={styles.emptyImage} 
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptySubtitle}>We couldn't find any products at this time.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNavigate}>
          <Text style={styles.primaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          searchQuery.trim() !== '' ? (
            <View style={styles.noResultsContainer}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486754.png' }} 
                style={styles.noResultsImage} 
              />
              <Text style={styles.noResultsText}>No products match your search</Text>
              <TouchableOpacity onPress={() => {
                setTempSearchQuery('');
                setSearchQuery('');
              }}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton} onPress={() => {}}>
          <Text style={styles.floatingButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginLeft: 10,
  },
  iconText: {
    fontSize: 18,
  },
  // Modified search container with search button
  searchContainer: {
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#5048E5',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  searchLoader: {
    marginLeft: 10,
  },
  
  // Categories styles
  categoriesContainer: {
    marginVertical: 16,
  },
  categoriesScrollView: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCategoryItem: {
    backgroundColor: '#5048E5',
    borderColor: '#5048E5',
  },
  categoryText: {
    fontWeight: '600',
    color: '#212121',
  },
  activeCategoryText: {
    color: '#fff',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAllText: {
    color: '#5048E5',
    fontWeight: '600',
  },

  // Product list styles
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
    height: 40, // Limit to 2 lines
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5048E5',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    color: '#FFC107',
    fontSize: 12,
  },
  starEmpty: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  ratingText: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#5048E5',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#707070',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // No results state
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 8,
  },
  clearSearchText: {
    color: '#5048E5',
    fontWeight: '600',
  },
  
  // Floating action button
  floatingButtonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  floatingButton: {
    backgroundColor: '#5048E5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5048E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default AllProducts;