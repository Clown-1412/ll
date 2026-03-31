const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro'); // 1. Import NativeWind

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

// 2. Gộp cấu hình mặc định và cấu hình tùy chỉnh của bạn
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// 3. Bọc cấu hình bằng withNativeWind và chỉ định file CSS đầu vào
module.exports = withNativeWind(mergedConfig, { input: './global.css' });