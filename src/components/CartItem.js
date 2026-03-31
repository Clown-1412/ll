import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleDecrease = useCallback(() => onUpdateQuantity(item.id, -1), [item.id, onUpdateQuantity]);
  const handleIncrease = useCallback(() => onUpdateQuantity(item.id, 1), [item.id, onUpdateQuantity]);
  const handleRemove = useCallback(() => onRemoveItem(item.id), [item.id, onRemoveItem]);

  return (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        accessibilityRole="image"
        accessibilityLabel={`Image of ${item.name}`}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemShop}>Cung cấp bởi: {item.shop}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        <View style={styles.itemActions}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={handleDecrease}
              style={styles.quantityButton}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              accessibilityHint={`Decreases the quantity of ${item.name}`}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText} accessibilityLabel="Current quantity">{item.quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              style={styles.quantityButton}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              accessibilityHint={`Increases the quantity of ${item.name}`}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove item"
            accessibilityHint={`Removes ${item.name} from your cart`}
          >
            <Text style={styles.removeIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: theme.spacing.s,
    marginRight: theme.spacing.m,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  itemShop: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.xs,
  },
  itemPrice: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  itemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.s,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.s,
  },
  quantityButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  quantityText: {
    ...theme.typography.body,
    fontWeight: '600',
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.text,
  },
  removeIcon: {
      fontSize: 24,
      color: theme.colors.textSecondary,
  },
});

export default React.memo(CartItem);
