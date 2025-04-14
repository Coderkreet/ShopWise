import React, { useContext, useState, useRef, useEffect } from 'react';
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
  ScrollView,
  Animated,
  TextInput,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductContext } from '../../context/ProductContext';

// Assuming we have these icons in the project
// If not, you would need to install a library like react-native-vector-icons
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)
const CAROUSEL_HEIGHT = 200;
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWishlist } from '../../context/WishlistContext';

// Featured promotional items for carousel
const carouselItems = [
  {
    id: 'promo1',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    title: 'Summer Collection',
    subtitle: 'Up to 40% off',
    buttonText: 'Shop Now'
  },
  {
    id: 'promo2',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends',
    buttonText: 'Explore'
  },
  {
    id: 'promo3',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    title: 'Premium Selection',
    subtitle: 'Exclusive products for you',
    buttonText: 'View Collection'
  }
];

// Featured categories with icons
const featuredCategories = [
  { id: 1, name: 'Electronics', icon: 'phone-portrait-outline', color: '#FF9500' },
  { id: 2, name: 'Fashion', icon: 'shirt-outline', color: '#FF2D55' },
  { id: 3, name: 'Home', icon: 'home-outline', color: '#5AC8FA' },
  { id: 4, name: 'Beauty', icon: 'sparkles-outline', color: '#AF52DE' },
  { id: 5, name: 'Sports', icon: 'football-outline', color: '#30D158' },
  { id: 6, name: 'Books', icon: 'book-outline', color: '#5856D6' },
  { id: 7, name: 'Toys', icon: 'game-controller-outline', color: '#FFCC00' },
  { id: 8, name: 'More', icon: 'grid-outline', color: '#8E8E93' },
];

const HomeScreen = () => {
  const {addToWishlist , removeFromWishlist,isInWishlist} = useWishlist();
  const navigation = useNavigation();
  const { products } = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  

  const { addToCart } = useCart();
  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSlide < carouselItems.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: activeSlide + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const onCarouselScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: event => {
        const slideIndex = Math.floor(
          event.nativeEvent.contentOffset.x / width + 0.5
        );
        if (slideIndex !== activeSlide) {
          setActiveSlide(slideIndex);
        }
      }
    }
  );

  // Only show a few products on the home screen
  const featuredProducts = products ? products.slice(0, 4) : [];

  const renderCarouselItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={styles.carouselItem}
        onPress={() => handleNavigate('Category')}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.carouselImage}
        />
        <View style={styles.carouselOverlay}>
          <View style={styles.carouselContent}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {carouselItems.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderCategoryIcon = (item) => (
    <TouchableOpacity 
      style={[styles.categoryIconItem, { backgroundColor: item.color + '20' }]}
      onPress={() => {
        setSelectedCategory(item.name);
        handleNavigate('Category');
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.categoryIconText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    
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
        <Text numberOfLines={2} style={styles.productTitle}>
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
              <Text key={index} style={index < Math.floor(item.rating || 0) ? styles.starFilled : styles.starEmpty}>★</Text>
            ))}
          </View>
          {item.rating && (
            <Text style={styles.ratingText}>({item.reviews || 0})</Text>
          )}
        </View>
        <TouchableOpacity  onPress={async () => {
              await AsyncStorage.setItem('cartItem', JSON.stringify(item.id));
              addToCart(item);
            }} style={styles.addToCartButton}>
          <Icon name="cart-outline" size={16} color="#FFFFFF" />
          <Text   
           
          
          style={styles.addToCartText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('Login')}>
          <Text style={styles.primaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
     
        <Text style={styles.appName}>SHOPWAVE</Text>
        <View style={styles.headerActions}>
        
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands & more..."
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleNavigate('Search')}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.filterButton} onPress={() => handleNavigate('Filter')}>
          <Icon name="options-outline" size={20} color="#5048E5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const DealsSection = () => (
    <View style={styles.dealsSection}>
      <View style={styles.dealCard}>
        <Icon name="timer-outline" size={24} color="#FF9500" />
        <Text style={styles.dealTitle}>Flash Sales</Text>
        <Text style={styles.dealSubtitle}>Ends in 06:45:22</Text>
      </View>
      <View style={styles.dealCard}>
        <Icon name="gift-outline" size={24} color="#FF2D55" />
        <Text style={styles.dealTitle}>Special Offers</Text>
        <Text style={styles.dealSubtitle}>Limited time only</Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      <Header />
      
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={carouselItems}
          renderItem={renderCarouselItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onCarouselScroll}
          scrollEventThrottle={16}
        />
        {renderPagination()}
      </View>
      
      <FlatList
        data={featuredCategories}
        renderItem={({ item }) => renderCategoryIcon(item)}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesIconList}
      />
      
      <DealsSection />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity onPress={() => handleNavigate('Products')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => handleNavigate('Products')}
      >
        <Text style={styles.viewAllText}>View All Products</Text>
        <Icon name="arrow-forward-outline" size={16} color="#5048E5" />
      </TouchableOpacity>
      
      <View style={styles.recommendedSection}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedList}
        >
          {products.slice(4, 8).map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.recommendedItem}
              onPress={() => navigateToProductDetail(product)}
            >
              <Image 
                source={{ uri: product.image }} 
                style={styles.recommendedImage} 
                resizeMode="contain"
              />
              <Text numberOfLines={1} style={styles.recommendedTitle}>{product.title}</Text>
              <Text style={styles.recommendedPrice}>${product.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.brandsSection}>
        <Text style={styles.sectionTitle}>Popular Brands</Text>
        <View style={styles.brandsGrid}>
          {['Nike', 'Adidas', 'Apple', 'Samsung'].map((brand, index) => (
            <TouchableOpacity key={index} style={styles.brandItem}>
              <View style={styles.brandCircle}>
                <Text style={styles.brandLetter}>{brand.charAt(0)}</Text>
              </View>
              <Text style={styles.brandName}>{brand}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // const MainTabBar = () => (
  //   <View style={styles.tabBar}>
  //     <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Home')}>
  //       <Icon name="home" size={24} color="#5048E5" />
  //       <Text style={[styles.tabText, { color: '#5048E5' }]}>Home</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Categories')}>
  //       <Icon name="grid-outline" size={24} color="#757575" />
  //       <Text style={styles.tabText}>Categories</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Deals')}>
  //       <Icon name="flame-outline" size={24} color="#757575" />
  //       <Text style={styles.tabText}>Deals</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Wishlist')}>
  //       <Icon name="heart-outline" size={24} color="#757575" />
  //       <Text style={styles.tabText}>Wishlist</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Account')}>
  //       <Icon name="person-outline" size={24} color="#757575" />
  //       <Text style={styles.tabText}>Account</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <FlatList
        data={featuredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5048E5']}
          />
        }
      />
      {/* <MainTabBar /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Header Styles
  header: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop:"23",
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuButton: {
    padding: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 4,
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#212121',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Carousel styles
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    marginBottom: 20,
  },
  carouselItem: {
    width: width,
    height: CAROUSEL_HEIGHT,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  carouselContent: {
    padding: 20,
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carouselSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  carouselButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  carouselButtonText: {
    color: '#5048E5',
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  
  // Categories icons styles
  categoriesIconList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryIconItem: {
    width: 80,
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 12,
    padding: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#212121',
    textAlign: 'center',
  },
  
  // Deals section
  dealsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  dealCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  dealSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
  
  // Section header styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
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
    paddingBottom: 100, // Extra padding for tab bar
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: '#5048E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Footer styles
  footer: {
    marginTop: 8,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  viewAllText: {
    color: '#5048E5',
    fontWeight: '600',
    marginRight: 4,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  recommendedList: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  recommendedItem: {
    width: 110,
    marginRight: 16,
  },
  recommendedImage: {
    width: 110,
    height: 110,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 12,
    color: '#212121',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  brandsSection: {
    marginBottom: 16,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  brandItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5048E520',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  brandName: {
    fontSize: 12,
    color: '#212121',
  },
  
// Tab Bar styles (continued)
tabBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingVertical: 8,
  borderTopWidth: 1,
  borderTopColor: '#EEEEEE',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 4,
},
tabText: {
  fontSize: 12,
  marginTop: 4,
  color: '#757575',
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
});

export default HomeScreen;