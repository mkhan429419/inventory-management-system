import React, { ChangeEvent, FormEvent, useState, useRef, useCallback } from "react";
import axios from "axios";
import Header from "@/app/(components)/Header";
import { PantryItem } from "@/types";
import Webcam from "react-webcam";

type ProductFormData = Omit<PantryItem, "id" | "userId" | "createdAt" | "updatedAt">;

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({ isOpen, onClose, onCreate }: CreateProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    quantity: 0,
    rating: 0,
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const webcamRef = useRef<Webcam>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "quantity" || name === "rating" ? parseFloat(value) : value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = dataURItoBlob(imageSrc);
      const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
      setFile(file);
      setUseCamera(false);
    }
  }, [webcamRef]);

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file or take a photo.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Cloudinary
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        fileData
      );
      const imageUrl = uploadResponse.data.secure_url;

      // Create product with imageUrl
      const productData = {
        ...formData,
        imageUrl,
      };

      onCreate(productData);
      onClose();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="quantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.quantity}
            className={inputCssStyles}
            required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
            required
          />

          {/* CHOOSE FILE */}
          <label htmlFor="file" className={labelCssStyles}>
            Choose File
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            className={inputCssStyles}
          />

          <div className="mt-4">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => setUseCamera(true)}
            >
              Take Photo
            </button>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={() => setUseCamera(false)}
            >
              Cancel
            </button>
          </div>

          {useCamera && (
            <div className="mt-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={480}
                videoConstraints={{
                  facingMode: facingMode,
                }}
              />
              <div className="mt-2 flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={handleCapture}
                >
                  Capture
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                  onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                >
                  Switch Camera
                </button>
              </div>
            </div>
          )}

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Create"}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
