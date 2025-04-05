"use client";

import ButtonComponent from "@/components/button-component";
import createAxiosInstance from "@/utils/api";
import { CameraIcon } from "@/utils/svg";
import Image from "next/image";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { toast } from "react-toastify";

interface AvatarProps {
  setModalState?: any;
  setSuccessState?: any;
  activeRowId?: any;
}

function AvatarUploader({
  activeRowId,
  setModalState,
  setSuccessState,
}: AvatarProps) {
  const axiosInstance = createAxiosInstance();
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [formData, setFormData] = useState<FormData>();
  const [saveAvatar, setSaveAvatar] = useState<boolean>(false);
  const [scale, setScale] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const avatarPlaceholder = "/assets/avatar.png";

  // useEffect(() => {
  //   async function fetchCompany() {
  //     const response = await axiosInstance.get(`companies/${activeRowId}`);
  //     const logoUrl = response.data.logoUrl;
  //     if (logoUrl) {
  //       setUserAvatar(logoUrl);
  //     }
  //   }
  //   if (activeRowId) {
  //     fetchCompany();
  //   }
  // }, [activeRowId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      const newFormData = new FormData();
      newFormData.append("file", file);
      setFormData(newFormData);
    } else {
      toast.error("No file selected. Please select an image.");
    }
  };

  const handleCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();

      // Convert base64 to Blob
      const byteString = atob(canvas.split(",")[1]);
      const mimeString = canvas.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }
      const croppedBlob = new Blob([arrayBuffer], { type: mimeString });
      const croppedFormData = new FormData();
      croppedFormData.append("file", croppedBlob, "cropped_image.png");

      setFormData(croppedFormData);
      setCroppedImage(canvas);
      setUserAvatar(canvas);
      setSaveAvatar(true);
    }
  };

  const changeProfileAvatar = async () => {
    if (!formData) return;
    try {
      const response = await axiosInstance.patch(
        `companies/${activeRowId}/logo`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setModalState("");
      setSuccessState({
        title: "Successful",
        detail: "You have successfully uploaded logo",
        status: true,
      });
      setSaveAvatar(false);
      setCroppedImage(null);
    } catch (error) {
      toast.error("Error uploading avatar");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Show file input and placeholder only when no picture is selected */}
      {!userAvatar && (
        <div className="relative">
          <div className="w-44 h-44 bg-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src={avatarPlaceholder}
              alt="User Avatar"
              className="w-44 h-44 object-cover"
              width={176}
              height={176}
            />
          </div>
          <div className="absolute bottom-5 right-0 bg-gray-100 text-white p-3 rounded-full cursor-pointer hover:bg-gray-200">
            <CameraIcon />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Show the editor once an image is selected */}
      {userAvatar && !saveAvatar && (
        <div className="mt-4">
          <AvatarEditor
            ref={editorRef}
            image={userAvatar}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            scale={scale}
            rotate={0}
          />
          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-2">
              Adjust Avatar
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <ButtonComponent
            text="Crop Image"
            className="text-white"
            onClick={handleCrop}
          />
        </div>
      )}

      {/* Show cropped image preview and upload button */}
      {saveAvatar && (
        <div className="mt-4 flex flex-col items-center">
          {croppedImage && (
            <img
              src={croppedImage}
              alt="Cropped"
              className="rounded-full mb-4"
              width={200}
              height={200}
            />
          )}
          <ButtonComponent
            text="Upload Avatar"
            className="text-white"
            onClick={changeProfileAvatar}
          />
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
