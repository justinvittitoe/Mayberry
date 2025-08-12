import React, { useState } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageData: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  label = "Upload Image" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onImageChange(result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
    setError(null);
  };

  return (
    <div className="image-upload">
      <Form.Label>{label}</Form.Label>
      
      {preview && (
        <div className="mb-3">
          <Image 
            src={preview} 
            alt="Preview" 
            thumbnail 
            style={{ maxWidth: '200px', maxHeight: '150px' }}
          />
          <div className="mt-2">
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleRemoveImage}
            >
              Remove Image
            </Button>
          </div>
        </div>
      )}

      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {uploading && (
        <div className="mt-2 text-muted small">
          Uploading image...
        </div>
      )}
      
      {error && (
        <Alert variant="danger" className="mt-2 small">
          {error}
        </Alert>
      )}
      
      <div className="mt-1 text-muted small">
        Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
      </div>
    </div>
  );
};

export default ImageUpload;