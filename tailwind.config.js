// tailwind.config.js
module.exports = {
  // Nội dung này cực kỳ quan trọng để NativeWind biết nơi tìm các class
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};