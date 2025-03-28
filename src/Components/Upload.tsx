import { Image } from 'lucide-react';
import React, { useState } from 'react'
import { ImageEditorNew } from './ImageEditor/ImageEditor';

const Upload = () => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editedImage, setEditedImage] = useState<string | null>(null);

    const handleSave = (file: File) => {
        setEditedImage(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-4">Image Editor</h1>

                    <button
                        className="btn btn-primary mb-4"
                        onClick={() => setIsEditorOpen(true)}
                    >
                        <Image size={16} className="me-2" />
                        Open Image Editor
                    </button>

                    {editedImage && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold mb-2">Edited Image:</h2>
                            <img
                                src={editedImage}
                                alt="Edited"
                                className="max-w-full rounded-lg shadow-sm"
                            />
                        </div>
                    )}

                    <ImageEditorNew
                        isOpen={isEditorOpen}
                        onClose={() => setIsEditorOpen(false)}
                        onSave={handleSave}
                        acceptedFileTypes={['.jpg', '.jpeg', '.png']}
                        maxFileSize={5 * 1024 * 1024} // 5MB
                    />
                </div>
            </div>
        </div>
    );
}

export default Upload