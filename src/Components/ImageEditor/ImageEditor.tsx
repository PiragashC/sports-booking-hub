import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RotateCcw, Download, Crop as CropIcon, Sun, Palette, Upload, } from 'lucide-react';
import { showErrorToast } from '../../Utils/commonLogic';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

interface ImageEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (file: File) => void;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
}

interface ImageFilters {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
}

interface FilterPreset {
    name: string;
    filters: ImageFilters;
}

const filterPresets: FilterPreset[] = [
    {
        name: 'Normal',
        filters: { brightness: 100, contrast: 100, saturation: 100, hue: 0 }
    },
    {
        name: 'Vintage',
        filters: { brightness: 120, contrast: 85, saturation: 50, hue: 30 }
    },
    {
        name: 'B&W',
        filters: { brightness: 100, contrast: 120, saturation: 0, hue: 0 }
    },
    {
        name: 'Warm',
        filters: { brightness: 105, contrast: 110, saturation: 120, hue: 15 }
    },
    {
        name: 'Cool',
        filters: { brightness: 100, contrast: 105, saturation: 90, hue: -15 }
    },
    {
        name: 'High Contrast',
        filters: { brightness: 110, contrast: 150, saturation: 110, hue: 0 }
    }
];

export const ImageEditorNew: React.FC<ImageEditorProps> = ({
    isOpen,
    onClose,
    onSave,
    acceptedFileTypes = ['.jpg', '.jpeg', '.png'],
    maxFileSize = 5 * 1024 * 1024,
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [workingImage, setWorkingImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [filters, setFilters] = useState<ImageFilters>({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
    });
    const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'filters'>('adjust');
    const [isCropping, setIsCropping] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const toastRef = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleResetState = () => {
        setSelectedImage(null);
        setOriginalImage(null);
        setWorkingImage(null);
        setCrop(undefined);
        setFilters({
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
        });
        setActiveTab('adjust');
        setIsCropping(false);
        setImageSize({ width: 0, height: 0 });
        setLoading(false);
    }


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!acceptedFileTypes.some(type => file.name.toLowerCase().endsWith(type))) {
            showErrorToast(toastRef, 'Invalid file type', '');
            return;
        }

        if (file.size > maxFileSize) {
            showErrorToast(toastRef, 'File size exceeds limit', '');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
            };
            img.src = imageUrl;
            setSelectedImage(imageUrl);
            setOriginalImage(imageUrl);
            setWorkingImage(imageUrl);
            setCrop(undefined);
            setIsCropping(false);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = useCallback((cropArea: PixelCrop) => {
        if (!imageRef.current || !previewCanvasRef.current || !isCropping) return;

        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Calculate the actual pixel values based on the original image size
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelCrop = {
            x: cropArea.x * scaleX,
            y: cropArea.y * scaleY,
            width: cropArea.width * scaleX,
            height: cropArea.height * scaleY
        };

        // Set canvas size to match the cropped area
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Draw the cropped area to the canvas
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedImageUrl = URL.createObjectURL(blob);
                setWorkingImage(croppedImageUrl);
                setSelectedImage(croppedImageUrl);
                setIsCropping(false);
            }
        }, 'image/png');
    }, [isCropping]);

    const applyFilters = useCallback((imageUrl: string) => {
        return new Promise<string>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    resolve(imageUrl);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg)`;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const filteredImageUrl = canvas.toDataURL('image/png');
                setWorkingImage(filteredImageUrl);
                resolve(filteredImageUrl);
            };
            img.src = imageUrl;
        });
    }, [filters]);

    const handleFilterChange = async (filterType: keyof ImageFilters, value: number) => {
        const newFilters = {
            ...filters,
            [filterType]: value
        };
        setFilters(newFilters);
        if (workingImage) {
            await applyFilters(workingImage);
        }
    };

    const applyPreset = async (preset: FilterPreset) => {
        setFilters(preset.filters);
        if (workingImage) {
            await applyFilters(workingImage);
        }
    };

    const handleSave = async () => {
        if (!workingImage) return;

        try {
            setLoading(true);
            const finalImage = await applyFilters(workingImage);
            const response = await fetch(finalImage);
            const blob = await response.blob();
            const file = new File([blob], 'edited-image.png', { type: 'image/png' });
            onSave(file);
            onClose();
            handleResetState();
        } catch (error) {
            console.error('Error saving image:', error);
            showErrorToast(toastRef, 'Failed to save the image. Please try again.', '');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (originalImage) {
            setSelectedImage(originalImage);
            setWorkingImage(originalImage);
            setFilters({
                brightness: 100,
                contrast: 100,
                saturation: 100,
                hue: 0,
            });
            setCrop(undefined);
            setIsCropping(false);
        }
    };

    const startCropping = () => {
        setIsCropping(true);
        if (imageRef.current) {
            // Calculate initial crop based on image orientation
            const isPortrait = imageSize.height > imageSize.width;
            const cropSize = isPortrait ? 70 : 50;
            const cropOffset = (100 - cropSize) / 2;

            setCrop({
                unit: '%',
                width: cropSize,
                height: cropSize,
                x: cropOffset,
                y: cropOffset,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Toast ref={toastRef} />

            <div className="modal show d-block" tabIndex={-1}>
                <div className="modal-backdrop show"></div>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h5 className="modal-title d-flex align-items-center">
                                <Palette className="me-2" size={24} />
                                Image Editor
                            </h5>
                            <button type="button" className="btn-close" onClick={() => { onClose(); handleResetState(); }}></button>
                        </div>
                        <div className="modal-body p-4">
                            {!selectedImage ? (
                                <div className="text-center p-5 border-2 border-dashed rounded-lg bg-light">
                                    <Upload size={48} className="text-primary mb-3" />
                                    <h5>Drop your image here or click to upload</h5>
                                    <p className="text-muted mb-3">
                                        Supported formats: {acceptedFileTypes.join(', ')} | Max size: {maxFileSize / (1024 * 1024)}MB
                                    </p>
                                    <input
                                        type="file"
                                        accept={acceptedFileTypes.join(',')}
                                        onChange={handleFileSelect}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className="image-editor-container p-4">
                                    <div className="btn-group mb-4 w-100">
                                        <button
                                            className={`btn ${activeTab === 'crop' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab('crop');
                                                startCropping();
                                            }}
                                        >
                                            <CropIcon size={18} className="me-2" /> Crop
                                        </button>
                                        <button
                                            className={`btn ${activeTab === 'adjust' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab('adjust');
                                                setIsCropping(false);
                                            }}
                                        >
                                            <Sun size={18} className="me-2" /> Adjust
                                        </button>
                                        <button
                                            className={`btn ${activeTab === 'filters' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab('filters');
                                                setIsCropping(false);
                                            }}
                                        >
                                            <Palette size={18} className="me-2" /> Filters
                                        </button>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="image-preview mb-4">
                                                {activeTab === 'crop' && isCropping ? (
                                                    <ReactCrop
                                                        crop={crop}
                                                        onChange={c => setCrop(c)}
                                                        onComplete={handleCropComplete}
                                                    >
                                                        <img
                                                            ref={imageRef}
                                                            src={workingImage || selectedImage || ''}
                                                            alt="Edit"
                                                            style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                                            onLoad={(e) => {
                                                                const img = e.currentTarget;
                                                                setImageSize({
                                                                    width: img.naturalWidth,
                                                                    height: img.naturalHeight
                                                                });
                                                            }}
                                                        />
                                                    </ReactCrop>
                                                ) : (
                                                    <div className="filtered-image-container">
                                                        <img
                                                            src={workingImage || selectedImage || ''}
                                                            alt="Edit"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '70vh',
                                                                filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg)`
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <canvas
                                                    ref={previewCanvasRef}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            {activeTab === 'adjust' && (
                                                <div className="controls">
                                                    <div className="mb-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <label className="form-label mb-0">Brightness</label>
                                                            <span className="badge bg-primary">{filters.brightness}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            min="0"
                                                            max="200"
                                                            value={filters.brightness}
                                                            onChange={e => handleFilterChange('brightness', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <label className="form-label mb-0">Contrast</label>
                                                            <span className="badge bg-primary">{filters.contrast}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            min="0"
                                                            max="200"
                                                            value={filters.contrast}
                                                            onChange={e => handleFilterChange('contrast', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <label className="form-label mb-0">Saturation</label>
                                                            <span className="badge bg-primary">{filters.saturation}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            min="0"
                                                            max="200"
                                                            value={filters.saturation}
                                                            onChange={e => handleFilterChange('saturation', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <label className="form-label mb-0">Hue</label>
                                                            <span className="badge bg-primary">{filters.hue}°</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            min="-180"
                                                            max="180"
                                                            value={filters.hue}
                                                            onChange={e => handleFilterChange('hue', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'filters' && (
                                                <div className="filter-presets">
                                                    <div className="row g-3">
                                                        {filterPresets.map((preset) => (
                                                            <div key={preset.name} className="col-6">
                                                                <div
                                                                    className={`filter-preset-card card h-100 ${JSON.stringify(filters) === JSON.stringify(preset.filters) ? 'active' : ''
                                                                        }`}
                                                                    onClick={() => applyPreset(preset)}
                                                                >
                                                                    <img
                                                                        src={workingImage || selectedImage || ''}
                                                                        className="filter-preset-image"
                                                                        alt={preset.name}
                                                                        style={{
                                                                            filter: `brightness(${preset.filters.brightness}%) contrast(${preset.filters.contrast}%) saturate(${preset.filters.saturation}%) hue-rotate(${preset.filters.hue}deg)`
                                                                        }}
                                                                    />
                                                                    <div className="card-body p-2 text-center">
                                                                        <h6 className="card-title mb-0">{preset.name}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <Button className="btn btn-outline-secondary" onClick={handleReset}>
                                <RotateCcw size={16} className="me-2" /> Reset
                            </Button>
                            <Button className="btn btn-primary" onClick={handleSave} disabled={!selectedImage} loading={loading}>
                                <Download size={16} className="me-2" /> Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};