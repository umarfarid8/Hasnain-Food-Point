import { useState, useEffect, lazy, Suspense, Component } from 'react';
import { Flame, Sparkles, Image as ImageIcon, Box, RotateCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Robust Error Boundary to catch any Spline runtime / WebGL / network parsing errors
class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Spline 3D Scene encountered an error, falling back to static photo:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Lazy-load the Spline runtime component
const Spline = lazy(() => import('@splinetool/react-spline'));

// Default Spline 3D interactive scene URL (customizable via VITE_SPLINE_SCENE_URL)
const DEFAULT_SCENE_URL =
  import.meta.env.VITE_SPLINE_SCENE_URL ||
  'https://prod.spline.design/6W-e197bg2kKwFLS/scene.splinecode';

export default function SplineHero() {
  const [viewMode, setViewMode] = useState('photo'); // Default to instant static photo for zero-delay FCP
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [hasSplineError, setHasSplineError] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isWebGlSupported, setIsWebGlSupported] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check hardware WebGL support, reduced motion preference, and network bandwidth on mount
  useEffect(() => {
    // 1. Reduced motion check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setPrefersReducedMotion(true);
      setViewMode('photo');
    }

    // 2. WebGL support check (critical for low-end Android WebView)
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGlSupported(false);
        setViewMode('photo');
      }
    } catch {
      setIsWebGlSupported(false);
      setViewMode('photo');
    }

    // 3. Network Save-Data / 2G / 3G check & low-power detection
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const isMeteredOrSlow =
      connection &&
      (connection.saveData ||
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g');

    const isLowPowerDevice =
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency <= 4;

    const isSmallMobile = window.innerWidth < 768;

    if (isMeteredOrSlow || isLowPowerDevice) {
      setIsSlowConnection(true);
      setViewMode('photo');
    } else if (!isSmallMobile && !motionQuery.matches) {
      // On desktop / fast WiFi connections, enable 3D
      setViewMode('3d');
    }
  }, []);

  const handleSplineLoad = () => {
    setIsSplineLoaded(true);
    setHasSplineError(false);
  };

  const handleSplineError = () => {
    setHasSplineError(true);
    setIsSplineLoaded(false);
    setViewMode('photo');
  };

  const shouldRenderSpline =
    viewMode === '3d' && isWebGlSupported && !hasSplineError && !prefersReducedMotion;

  return (
    <div className="relative w-full max-w-2xl mx-auto my-5 sm:my-8 group">
      {/* Outer Card Shell with 16:9 Aspect Ratio */}
      <div className="relative rounded-3xl overflow-hidden border border-border-subtle bg-bg-surface/90 aspect-[16/10] sm:aspect-[16/9] shadow-2xl">
        {/* Layer 1: Static Fallback Image (always rendered beneath with zero layout shift) */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            viewMode === '3d' && isSplineLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-bg-surface animate-pulse flex items-center justify-center">
              <Flame className="w-10 h-10 text-accent-primary/40 animate-bounce" />
            </div>
          )}
          <img
            src="/assets/images/hero-food.webp"
            alt="Delicious fresh food showcase at Hasnain Food Point"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = '/assets/images/hero-food.jpg';
              setImageLoaded(true);
            }}
          />
          {/* Ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Layer 2: Interactive 3D Spline Canvas wrapped in Error Boundary */}
        {shouldRenderSpline && (
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              isSplineLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <SplineErrorBoundary onError={handleSplineError}>
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 backdrop-blur-xs">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-bg-primary/90 border border-border-subtle text-xs text-accent-secondary font-medium">
                      <RotateCw className="w-4 h-4 animate-spin text-accent-primary" />
                      <span>Loading 3D scene...</span>
                    </div>
                  </div>
                }
              >
                <Spline
                  scene={DEFAULT_SCENE_URL}
                  onLoad={handleSplineLoad}
                  onError={handleSplineError}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                />
              </Suspense>
            </SplineErrorBoundary>
          </div>
        )}

        {/* Layer 3: Loading Shimmer & Spinner Indicator while 3D loads in background */}
        {viewMode === '3d' && !isSplineLoaded && !hasSplineError && isWebGlSupported && !prefersReducedMotion && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/90 backdrop-blur-md border border-border-subtle text-xs text-text-secondary shadow-lg pointer-events-none">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-accent-primary" />
            <span>Loading 3D visual...</span>
          </div>
        )}

        {/* Layer 4: Floating Controls & Mode Switcher (Photo / 3D) - 44px+ Accessible Tap Target */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {isWebGlSupported && !hasSplineError && !prefersReducedMotion && (
            <div className="flex items-center p-1 rounded-2xl bg-bg-primary/90 backdrop-blur-md border border-border-subtle shadow-xl">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] min-w-[44px] justify-center ${
                  viewMode === '3d'
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-label="Switch to 3D interactive view"
              >
                <Box className="w-4 h-4" />
                <span>3D</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] min-w-[44px] justify-center ${
                  viewMode === 'photo'
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-label="Switch to photo view"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Layer 5: Interactive Hint Badges */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            {viewMode === '3d' && isSplineLoaded ? (
              <motion.div
                key="hint-3d"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-accent-secondary/30 text-xs font-semibold text-accent-secondary shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
                <span>Interactive 3D • Drag to rotate</span>
              </motion.div>
            ) : (
              <motion.div
                key="hint-photo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-border-subtle text-xs font-semibold text-text-primary shadow-lg"
              >
                <Flame className="w-3.5 h-3.5 text-accent-primary" />
                <span>100% Hot & Fresh • تازہ</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slow connection or fallback hint if active */}
        {isSlowConnection && viewMode === 'photo' && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-border-subtle text-xs text-text-secondary pointer-events-none">
            <AlertCircle className="w-3.5 h-3.5 text-accent-secondary" />
            <span>Fast mode active (3G/Data-saver)</span>
          </div>
        )}
      </div>

      {/* Ember ambient glow under the showcase card */}
      <div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-primary/25 via-accent-secondary/20 to-accent-primary/25 -z-10 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </div>
  );
}
