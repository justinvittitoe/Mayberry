module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173', 'http://localhost:4173/login', 'http://localhost:4173/customize/plan1'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.85}],
        'categories:seo': ['error', {minScore: 0.8}],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'first-contentful-paint': ['error', {maxNumericValue: 1800}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'speed-index': ['error', {maxNumericValue: 3000}],
        'interactive': ['error', {maxNumericValue: 3000}],
        
        // Accessibility checks
        'color-contrast': 'error',
        'heading-order': 'warn',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'button-name': 'error',
        'link-name': 'error',
        
        // Best practices
        'uses-https': 'error',
        'no-vulnerable-libraries': 'error',
        'errors-in-console': 'warn',
        
        // Performance optimizations
        'unused-css-rules': 'warn',
        'render-blocking-resources': 'warn',
        'uses-webp-images': 'warn',
        'efficient-animated-content': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}