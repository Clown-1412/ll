import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Product} from '../types';

type TabParamList = {
  Product: {productId: string};
  Profile: undefined;
};

type ProductDetailScreenRouteProp = RouteProp<
  TabParamList,
  'Product'
>;

type Props = {
  route: ProductDetailScreenRouteProp;
};

const ProductDetailExamScreen = ({route}: Props) => {
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://api.fake-rest.refine.dev/products/${productId}`,
        );
        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        const message = error instanceof Error ? error.message : String(error);
        Alert.alert('Error', `Failed to fetch product details: ${message}`);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    // Logic to add product to cart
    if (product) {
      Alert.alert('Success', `${product.name} has been added to your cart.`);
    }
  };

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={
           require('../img/download.jpg')
        }
        style={styles.image}
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailExamScreen;
