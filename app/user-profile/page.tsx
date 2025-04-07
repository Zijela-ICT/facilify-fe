"use client";

import withPermissions from "@/components/auth/permission-protected-routes";
import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import InputComponent from "@/components/input-container";
import ModalCompoenent from "@/components/modal-component";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import { CameraIcon } from "@/utils/svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { toast } from "react-toastify";

function UserProfile() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const {
    user,
    setUser,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
    companyStateId,
  } = useDataPermission();

  // State for password inputs
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });

  const [qrCode, setQrCode] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState(
    user?.twoFAMethod || "email"
  );

  // State for various toggles
  const [settings, setSettings] = useState({
    isTwoFactorEnabled: false,
    isSoundNotificationEnabled: false,
    isPushNotificationEnabled: false,
    isBiometricLoginEnabled: false,
  });

  useEffect(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isTwoFactorEnabled: user?.isTwoFAEnabled,
    }));
  }, [user?.isTwoFAEnabled]);

  const enable2FA = async () => {
    const response = await axiosInstance.patch("/users/2fa/enable", {
      method: twoFactorMethod,
    });
    setQrCode(response.data.data.qrCode);
    if (twoFactorMethod === "app") {
      setCentralState("2FA");
    }
  };

  const disable2FA = async () => {
    const response = await axiosInstance.patch("/users/2fa/disable", {
      isTwoFAEnabled: false,
    });
  };

  // State for user avatar
  const avatar = "/assets/avatar.png";
  const [myuser, setMyUser] = useState({
    avatar: "",
  });

  // State for form data and file handling
  const [formData, setFormData] = useState<FormData>();
  const [saveAvatar, setSaveAvatar] = useState<boolean>(false);
  const [scale, setScale] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const editorRef = useRef(null);

  // Fetch user data on mount
  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
  };
  useEffect(() => {
    getMe();
  }, []);

  // Handle password change submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    await axiosInstance.post("/auth/change-password", {
      newPassword: password.newPassword,
      oldPassword: password.oldPassword,
    });
    setCentralState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully changed your password",
      status: true,
    });
    setPassword({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle file change for avatar
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setMyUser((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      setFormData(formData);

      setCentralState("Uploaded");
    } else {
      toast.error("No file selected. Please select an image.");
    }
  };

  // Handle image cropping
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

      // Update formData
      const croppedFormData = new FormData();
      croppedFormData.append("file", croppedBlob, "cropped_image.png");
      setFormData(croppedFormData);

      // Update the avatar preview
      setCroppedImage(canvas);
      setMyUser((prev) => ({ ...prev, avatar: canvas }));
      setSaveAvatar(true);
    }
  };

  // Change profile avatar on server
  const changeProfileAvatar = async () => {
    const response = await axiosInstance.patch(
      "/users/avatar/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    getMe();
    toast.success(response.data?.message);
    setCentralState("");
    setSaveAvatar(false);
    setCroppedImage(null);
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle settings state
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Handle logout
  const logout = async () => {
    localStorage.removeItem("authToken"); // Remove the token
    router.push("/");
  };

  return (
    <DashboardLayout title="Profile" detail="Manage your account details here">
      {/* special modal and state  */}
      <ModalCompoenent
        title={"Scan QR Code"}
        detail={
          "Make sure you scan the code if you choose App for verification"
        }
        modalState={centralState === "2FA"}
        width="max-w-md"
        setModalState={() => {
          setCentralState("");
        }}
      >
        <div className="flex items-center justify-center">
          <Image src={qrCode || avatar} alt="qrCode" width={300} height={300} />
        </div>
      </ModalCompoenent>

      <ModalCompoenent
        title={
          centralState === "Uploaded" ? "Update Avatar" : "Change Password"
        }
        detail={""}
        modalState={
          centralState === "Uploaded" || centralState === "changePassword"
        }
        width="max-w-md"
        setModalState={() => {
          setCentralState("");
          setMyUser(() => ({ ...formData, avatar: "" }));
          setCroppedImage(null);
        }}
      >
        {centralState === "Uploaded" && (
          <>
            <div className="p-6 flex flex-col items-center">
              {saveAvatar ? (
                <div className="mt-4">
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    className=" rounded-full"
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <>
                  <AvatarEditor
                    ref={editorRef}
                    image={myuser.avatar} // Provide a fallback avatar
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100} // Makes it circular
                    scale={scale}
                    rotate={0}
                  />
                  <div className="w-full mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Adjust avatar
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
                </>
              )}

              <div className="flex justify-between mt-6 w-full">
                {saveAvatar === false && (
                  <ButtonComponent
                    text="Proceed"
                    className="text-white"
                    onClick={handleCrop}
                  />
                )}
                {saveAvatar && (
                  <ButtonComponent
                    text="Upload Avatar"
                    className="text-white"
                    onClick={changeProfileAvatar}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {centralState === "changePassword" && (
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <InputComponent
                type="password"
                name="oldPassword"
                value={password.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter old password"
                className="mb-4 bg-white border-gray-200"
              />

              <InputComponent
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="mb-4 bg-white border-gray-200"
              />
              <InputComponent
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="mb-4 bg-white border-gray-200"
              />
              <ButtonComponent
                text={password.newPassword === "" ? "Change" : "Change"}
                disabled={
                  password.newPassword === "" || password.confirmPassword === ""
                }
                className="mb-4 text-white"
              />
            </form>
          </div>
        )}
      </ModalCompoenent>

      <h1 className="text-xl font-bold text-black ml-2 mt-4">My Account</h1>

      <div className="flex flex-col md:flex-row bg-gray-100 py-6 px-2">
        <div className="md:w-[38%] bg-white shadow-sm rounded-xl rounded-lg p-6 pt-16 flex flex-col items-center relative">
          <div className="relative">
            <div className="w-44 h-44 bg-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image
                src={user?.avatar ? user?.avatar : avatar}
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

          <h2 className="text-xl font-bold text-gray-800">
            {user?.firstName} {"   "} {user?.lastName}{" "}
          </h2>
          <p className="text-gray-600 text-base">{user?.email}</p>
        </div>

        <div className="md:w-[62%] mt-6 md:mt-0 md:ml-6 bg-white shadow-sm rounded-xl rounded-lg p-6 h-auto">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Password and Details
          </h3>

          <div
            onClick={() => setCentralState("changePassword")}
            className="flex items-center cursor-pointer justify-between py-4 px-6 border rounded-xl border-gray-200"
          >
            <div className="text-gray-800">Change Password</div>
            <div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.3335 2.66675L10.6668 8.00008L5.3335 13.3334"
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-4 mt-4">
            Settings
          </h3>

          {/* Settings Toggles */}
          <div className="w-full p-4 border border-gray-200 rounded-xl mb-4">
            {[
              { label: "Two-Factor Authentication", key: "isTwoFactorEnabled" },
              // {
              //   label: "Sound Notification",
              //   key: "isSoundNotificationEnabled",
              // },
              // { label: "Push Notification", key: "isPushNotificationEnabled" },
              // { label: "Login with Biometric", key: "isBiometricLoginEnabled" },
            ].map((setting, index, array) => (
              <div
                key={setting.key}
                className={`flex items-center justify-between p-2 ${
                  index < array.length - 1
                    ? "border-b border-gray-200 mb-4"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 font-light text-sm">
                    {setting.label}
                  </span>
                  {setting.key === "isTwoFactorEnabled" && (
                    <select
                      className="text-sm border border-gray-300 rounded-lg p-1"
                      value={twoFactorMethod}
                      onChange={(e) => setTwoFactorMethod(e.target.value)}
                    >
                      <option value="app">App</option>
                      <option value="email">Email</option>
                    </select>
                  )}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings[setting.key]}
                    onChange={() => {
                      handleToggle(setting.key as keyof typeof settings);
                      if (setting.key === "isTwoFactorEnabled") {
                        if (settings["isTwoFactorEnabled"]) {
                          disable2FA();
                        } else {
                          enable2FA();
                        }
                      }
                    }}
                  />
                  <div className="w-8 h-4 bg-gray-900 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div
            onClick={logout}
            className="flex items-center cursor-pointer justify-between py-4 px-6 border rounded-xl border-gray-200"
          >
            <div className="text-red-500">Sign out</div>
            <div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.3335 2.66675L10.6668 8.00008L5.3335 13.3334"
                  stroke="#FF3B30"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(UserProfile, [""]);
