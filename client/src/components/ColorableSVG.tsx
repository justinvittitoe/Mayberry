import React from 'react';

interface ColorableSVGProps {
  svgPath: string;
  colorZoneMapping: Record<string, string>;
  alt: string;
  className?: string;
}

const ColorableSVG: React.FC<ColorableSVGProps> = ({ svgPath, colorZoneMapping, alt, className }) => {
  // Simple implementation that just displays an image or placeholder
  // This can be enhanced later to actually apply colors to SVG zones

  if (!svgPath) {
    return (
      <div className={`colorable-svg-placeholder ${className || ''}`}>
        <div className="text-center p-4 bg-light border rounded">
          <p className="text-muted">{alt || 'No SVG available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`colorable-svg ${className || ''}`}>
      <img
        src={svgPath}
        alt={alt}
        className="img-fluid"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default ColorableSVG;
