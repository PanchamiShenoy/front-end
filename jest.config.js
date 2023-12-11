module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: 'node', 
  extensionsToTreatAsEsm: [],
  verbose: true,
 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', 
    "axios": "axios/dist/node/axios.cjs"
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['/Users/panchamishenoy/Desktop/nbad_project/budget-final-app/src/setupTests.js'],
};
