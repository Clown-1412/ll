import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleDecrease = useCallback(() => onUpdateQuantity(item.id, -1), [item.id, onUpdateQuantity]);
  const handleIncrease = useCallback(() => onUpdateQuantity(item.id, 1), [item.id, onUpdateQuantity]);
  const handleRemove = useCallback(() => onRemoveItem(item.id), [item.id, onRemoveItem]);

  return (
    <View className="flex-row bg-card rounded-xl p-m mb-m shadow-md">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-[90px] h-[90px] rounded-s mr-m"
        accessibilityRole="image"
        accessibilityLabel={`Image of ${item.name}`}
      />
      <View className="flex-1 justify-between">
        <Text className="text-base font-semibold text-text" numberOfLines={2}>{item.name}</Text>
        <Text className="text-xs text-textSecondary my-xs">Cung cấp bởi: {item.shop}</Text>
        <Text className="text-base font-bold text-primary">{formatCurrency(item.price)}</Text>
        <View className="flex-row justify-between items-center mt-s">
          <View className="flex-row items-center border border-border rounded-s">
            <TouchableOpacity
              onPress={handleDecrease}
              className="px-m py-s"
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              accessibilityHint={`Decreases the quantity of ${item.name}`}
            >
              <Text className="text-lg font-bold text-text">-</Text>
            </TouchableOpacity>
            <Text className="text-base font-semibold px-m text-text" accessibilityLabel="Current quantity">{item.quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              className="px-m py-s"
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              accessibilityHint={`Increases the quantity of ${item.name}`}
            >
              <Text className="text-lg font-bold text-text">+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove item"
            accessibilityHint={`Removes ${item.name} from your cart`}
          >
            <Text className="text-2xl text-textSecondary">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(CartItem);
