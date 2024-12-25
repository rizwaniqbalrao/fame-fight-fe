// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   devIndicators: {
//     buildActivity: false,
//   },
//   images: {
//     domains: [""], // Add the hostname here
//   },
//   future: {
//     webpack5: true,
//   },
//   webpack(config) {
//     config.optimization.minimize = false; // Temporarily disable CSS minification
//     return config;
//   },
// };

// // export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   output: 'export',
//   // typescript: {
//   //   ignoreBuildErrors: true,
//   // },

//   devIndicators: {
//     buildActivity: false,
//   },
//   images: {
//     domains: [""], // Add the hostname here
//   },
//   future: {
//     webpack5: true,
//   },
//   webpack(config) {
//     config.optimization.minimize = false; // Temporarily disable CSS minification
//     return config;
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export', // Enable static export
  
  devIndicators: {
    buildActivity: false, // Disable build activity indicator
  },

  images: {
    unoptimized: true, // Required for static export with images
    domains: [], // Add allowed domains if needed
  },

  webpack(config) {
    // Temporarily disable CSS minification if required
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
