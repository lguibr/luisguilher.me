// eslint-disable-next-line no-use-before-define
import React from 'react'
import styled from 'styled-components'

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`

const GradientLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  opacity: 1;
`

const AnimatedOrb = styled.div<{
  size: number
  left: string
  top: string
  delay: number
  duration: number
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left};
  top: ${props => props.top};
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(30px, -30px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(20px, -10px) scale(1.05);
    }
  }
`

const PurpleOrb = styled(AnimatedOrb)`
  background: radial-gradient(
    circle,
    rgba(102, 126, 234, 0.8) 0%,
    rgba(118, 75, 162, 0.4) 100%
  );
`

const CyanOrb = styled(AnimatedOrb)`
  background: radial-gradient(
    circle,
    rgba(0, 245, 255, 0.6) 0%,
    rgba(0, 150, 255, 0.3) 100%
  );
`

const PinkOrb = styled(AnimatedOrb)`
  background: radial-gradient(
    circle,
    rgba(255, 107, 157, 0.6) 0%,
    rgba(245, 87, 108, 0.3) 100%
  );
`

const NoiseOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
  pointer-events: none;
`

const AmbientBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      <GradientLayer />

      {/* Floating orbs */}
      <PurpleOrb size={600} left="10%" top="20%" delay={0} duration={20} />
      <CyanOrb size={500} left="70%" top="60%" delay={2} duration={25} />
      <PinkOrb size={450} left="50%" top="10%" delay={4} duration={22} />
      <PurpleOrb size={400} left="80%" top="30%" delay={6} duration={28} />
      <CyanOrb size={350} left="20%" top="70%" delay={8} duration={24} />

      {/* Subtle noise texture */}
      <NoiseOverlay />
    </BackgroundContainer>
  )
}

export default AmbientBackground
