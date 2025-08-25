import React, { useEffect, useRef, useState } from 'react';

export interface ColorZoneMapping {
  primary: string[];     // CSS selectors for primary color zones (siding, main exterior)
  secondary: string[];   // CSS selectors for secondary color zones (trim, accents)
  roof: string[];        // CSS selectors for roof elements
  accent: string[];      // CSS selectors for accent elements (doors, shutters)
  foundation?: string[]; // CSS selectors for foundation elements
}

export interface ColorScheme {
  _id?: string;
  name: string;
  colorValues: {
    primary: string;
    secondary: string;
    roof: string;
    accent: string;
    foundation?: string;
  };
  price: number;
}

interface ColorableSVGProps {
  svgPath: string;
  colorScheme?: ColorScheme;
  colorZoneMapping: ColorZoneMapping;
  width?: number | string;
  height?: number | string;
  className?: string;
  onLoadError?: () => void;
}

const ColorableSVG: React.FC<ColorableSVGProps> = ({
  svgPath,
  colorScheme,
  colorZoneMapping,
  width = '100%',
  height = 'auto',
  className = '',
  onLoadError
}) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load SVG content
  useEffect(() => {
    const loadSVG = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(svgPath);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }
        
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load SVG';
        setError(errorMessage);
        onLoadError?.();
        console.error('ColorableSVG: Error loading SVG:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (svgPath) {
      loadSVG();
    }
  }, [svgPath, onLoadError]);

  // Apply color scheme to SVG elements
  useEffect(() => {
    if (!svgContainerRef.current || !colorScheme || !svgContent) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const applyColorsToSelectors = (selectors: string[], color: string) => {
      selectors.forEach(selector => {
        const elements = svgElement.querySelectorAll(selector);
        elements.forEach(element => {
          (element as SVGElement).style.fill = color;
        });
      });
    };

    // Apply colors to different zones
    applyColorsToSelectors(colorZoneMapping.primary, colorScheme.colorValues.primary);
    applyColorsToSelectors(colorZoneMapping.secondary, colorScheme.colorValues.secondary);
    applyColorsToSelectors(colorZoneMapping.roof, colorScheme.colorValues.roof);
    applyColorsToSelectors(colorZoneMapping.accent, colorScheme.colorValues.accent);
    
    if (colorZoneMapping.foundation && colorScheme.colorValues.foundation) {
      applyColorsToSelectors(colorZoneMapping.foundation, colorScheme.colorValues.foundation);
    }
  }, [colorScheme, svgContent, colorZoneMapping]);

  // Handle SVG content insertion and sizing
  useEffect(() => {
    if (!svgContainerRef.current || !svgContent) return;

    // Insert SVG content
    svgContainerRef.current.innerHTML = svgContent;
    
    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Apply sizing
    if (typeof width === 'string') {
      svgElement.style.width = width;
    } else {
      svgElement.style.width = `${width}px`;
    }
    
    if (typeof height === 'string') {
      svgElement.style.height = height;
    } else {
      svgElement.style.height = `${height}px`;
    }

    // Ensure SVG is responsive
    svgElement.style.maxWidth = '100%';
    svgElement.style.height = 'auto';
  }, [svgContent, width, height]);

  if (isLoading) {
    return (
      <div 
        className={`colorable-svg-loading ${className}`}
        style={{ 
          width, 
          height: typeof height === 'string' ? height : `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading SVG...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`colorable-svg-error ${className}`}
        style={{ 
          width, 
          height: typeof height === 'string' ? height : `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          color: '#6c757d',
          textAlign: 'center',
          padding: '1rem'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
        <div style={{ fontSize: '0.9rem' }}>Preview Unavailable</div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</div>
      </div>
    );
  }

  return (
    <div 
      ref={svgContainerRef}
      className={`colorable-svg ${className}`}
      style={{ 
        width, 
        height: typeof height === 'string' ? height : `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

export default ColorableSVG;