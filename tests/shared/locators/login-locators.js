// locators/login-locators.js
const loginLocators = {
    title: {
      main: 'h1:has-text("Ingresá a Boca Socios")',
      bocaHighlight: 'span:has-text("Boca Socios")'
    },
    visual: {
      logo: 'svg[width="41"][height="48"]',
      backgroundImage: 'img[src*="auth-background"]'
    }
    // ... resto de locators
  };
  
  module.exports = { loginLocators };