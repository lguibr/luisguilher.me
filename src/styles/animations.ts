// Reusable animation utilities and styled-component mixins

export const animations = {
    // Fade animations
    fadeIn: `
    animation: fadeIn 0.3s ease-out;
  `,
    fadeInSlow: `
    animation: fadeIn 0.6s ease-out;
  `,

    // Slide animations
    slideIn: `
    animation: slideIn 0.3s ease-out;
  `,

    // Hover effects
    hoverLift: `
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  `,

    hoverGlow: `
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.3);
    }
  `,

    // Scale effects
    scaleOnHover: `
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: scale(1.05);
    }
  `,

    // Button press effect
    buttonPress: `
    transition: transform 0.1s ease;
    &:active {
      transform: scale(0.96);
    }
  `,

    // Pulse effect
    pulse: `
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `,

    // Shimmer loading effect
    shimmer: `
    background: linear-gradient(
      90deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(102, 126, 234, 0.3) 50%,
      rgba(102, 126, 234, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  `
}

// Glassmorphism mixin
export const glassmorphism = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    const blurValues = {
        light: '10px',
        medium: '20px',
        heavy: '40px'
    }

    const opacityValues = {
        light: '0.6',
        medium: '0.7',
        heavy: '0.8'
    }

    return `
    background: rgba(20, 18, 31, ${opacityValues[intensity]});
    backdrop-filter: blur(${blurValues[intensity]}) saturate(180%);
    -webkit-backdrop-filter: blur(${blurValues[intensity]}) saturate(180%);
    border: 1px solid rgba(102, 126, 234, 0.15);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  `
}

// Gradient text effect
export const gradientText = (gradient: string = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)') => `
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

// Responsive utilities
export const responsive = {
    mobile: '@media (max-width: 768px)',
    tablet: '@media (max-width: 1024px)',
    desktop: '@media (min-width: 1025px)',
    largeDesktop: '@media (min-width: 1600px)'
}

// Transition presets
export const transitions = {
    fast: 'transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);',
    normal: 'transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);',
    slow: 'transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);'
}
