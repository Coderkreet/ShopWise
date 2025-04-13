import React, { useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
const { width } = Dimensions.get('window');
import Toast from 'react-native-easy-toast';
import ToastTest from "../../../ToastTest";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const { addToCart , updateQuantity } = useCart();
  const {addToWishlist , isInWishlist, removeFromWishlist} = useWishlist();
  const [quantity, setQuantity] = React.useState(product.quantity || 1);

  let toastRef;
  const showToast = () => {
      toastRef.show("Item added Successfully ✓");
  }


  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation]);

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Icon name="alert-circle-outline" size={60} color="#dc3545" />
        <Text style={styles.errorTitle}>Not Found</Text>
        <Text style={styles.errorMessage}>Product details are not available.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate rating stars
  const renderRatingStars = () => {
    const rating = Math.round(product.rating.rate);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Icon key={`star-filled-${i}`} name="star" size={18} color="#FFD700" />);
      } else {
        stars.push(<Icon key={`star-outline-${i}`} name="star-outline" size={18} color="#FFD700" />);
      }
    }
    
    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>{stars}</View>
        <Text style={styles.ratingText}>
          {product.rating.rate} ({product.rating.count} reviews)
        </Text>
        {/* <Toast ref={(toast) => this.toast = toast}/> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5048E5" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity 
          style={styles.favoriteIcon}
          onPress={() => {
            if (isInWishlist(product.id)) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product);
            }
          }}
        >
          <Icon 
            name={isInWishlist(product.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isInWishlist(product.id) ? "#FF0000" : "white"} 
          />
        </TouchableOpacity>
      </View>
       <Toast ref={(toast) => toastRef = toast} style={{backgroundColor:'green'}} position={'top'}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image with Category Tag */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>
        
        {/* Product Info Section */}
        <View style={styles.infoContainer}>
          {/* Title and Rating */}
          <Text style={styles.title}>{product.title}</Text>
          {renderRatingStars()}
          
          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
          
          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
          
          {/* Specifications Section */}
          <View style={styles.specificationsContainer}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category:</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Rating:</Text>
              <Text style={styles.specValue}>{product.rating.rate} out of 5</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Reviews:</Text>
              <Text style={styles.specValue}>{product.rating.count} reviews</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Product ID:</Text>
              <Text style={styles.specValue}>#{product.id}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
        <TouchableOpacity 
  disabled={quantity <= 1}
  onPress={() => setQuantity(prev => prev - 1)}
  style={styles.quantityButton}
>
  <Icon name="remove" size={20} color="#5048E5" />
</TouchableOpacity>

<Text style={styles.quantityText}>{quantity}</Text>

<TouchableOpacity 
  onPress={() => setQuantity(prev => prev + 1)}
  style={styles.quantityButton}
>
  <Icon name="add" size={20} color="#5048E5" />
</TouchableOpacity>

        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={async () => {
            const productWithQuantity = { ...product, quantity };
            await AsyncStorage.setItem('cartItem', JSON.stringify(productWithQuantity.id)).then(()=>  showToast()) // You may want to store full product later
            addToCart(productWithQuantity);
            // navigation.navigate('Cart');
          }}
        >
          <Icon name="cart" size={20} color="white" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
    backgroundColor: '#5048E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backIcon: {
    padding: 4,
  },
  favoriteIcon: {
    padding: 4,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'white',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#5048E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: '#707070',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#212121',
    marginRight: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#707070',
  },
  specificationsContainer: {
    marginBottom: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specLabel: {
    fontSize: 16,
    color: '#707070',
  },
  specValue: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#5048E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#212121',
  },
  errorMessage: {
    fontSize: 16,
    color: '#707070',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#5048E5',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;