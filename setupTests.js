import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder (required by react-router-dom in Jest)
// These are needed for React Router to work in Jest/Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;