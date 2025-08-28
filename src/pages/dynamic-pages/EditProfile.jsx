import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios.js";
import {
    FaUser,
    FaSignOutAlt,
    FaUpload,
    FaTrash,
    FaEdit,
    FaTimes,
    FaCloudUploadAlt,
} from "react-icons/fa";
import { BsFillFilePostFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";


const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        headline: "",
        location: "",
        experience: "",
        companyName: "",
        positionAtCompany: "",
        skills: "",
        education: { SSC: "", HSC: "", diploma: "", degree: "" },
    });

    // profile pic state
    const [profilePic, setProfilePic] = useState(null); // raw File
    const [previewURL, setPreviewURL] = useState(""); // local preview
    const [uploading, setUploading] = useState(false);

    // modal + cropper state
    const [showModal, setShowModal] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user/me");
                setUser(res.data.user);
                setForm({
                    headline: res.data.user.headline || "",
                    location: res.data.user.location || "",
                    experience: res.data.user.experience || "",
                    companyName: res.data.user.companyName || "",
                    positionAtCompany: res.data.user.positionAtCompany || "",
                    skills: res.data.user.skills?.join(", ") || "",
                    education: {
                        SSC: res.data.user.education?.SSC || "",
                        HSC: res.data.user.education?.HSC || "",
                        diploma: res.data.user.education?.diploma || "",
                        degree: res.data.user.education?.degree || "",
                    },
                });
            } catch {
                toast.error("Failed to fetch user.");
            }
        };
        fetchUser();
    }, []);

    // Create preview
    useEffect(() => {
        if (!profilePic) {
            setPreviewURL("");
            return;
        }
        const url = URL.createObjectURL(profilePic);
        setPreviewURL(url);
        return () => URL.revokeObjectURL(url);
    }, [profilePic]);

    // crop complete callback
    const onCropComplete = useCallback((croppedArea, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // helper: get cropped image blob
    const getCroppedImage = (imageSrc, pixelCrop) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageSrc;
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx.drawImage(
                    img,
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
                    if (!blob) return reject(new Error("Canvas empty"));
                    resolve(blob);
                }, "image/jpeg");
            };
            img.onerror = reject;
        });
    };

    // handle upload after crop
    const handleProfileUpload = async () => {
        if (!previewURL || !croppedAreaPixels) {
            toast.error("No image selected");
            return;
        }
        try {
            setUploading(true);
            const croppedBlob = await getCroppedImage(previewURL, croppedAreaPixels);
            const formData = new FormData();
            formData.append("file", croppedBlob, "profile.jpg");

            const res = await api.post("/profilePic/upload", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser((prev) =>
                prev ? { ...prev, profileImage: res.data.profileImage } : prev
            );
            toast.success("Profile picture updated!");
            setShowModal(false);
            setProfilePic(null);
            setPreviewURL("");
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleProfileDelete = async () => {
        try {
            const res = await api.delete("/profilePic/delete");
            setUser((prev) =>
                prev ? { ...prev, profileImage: res.data.profileImage } : prev
            );
            toast.info("Profile picture removed.");
            setShowModal(false);
        } catch {
            toast.error("Failed to remove profile picture.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["SSC", "HSC", "diploma", "degree"].includes(name)) {
            setForm((prev) => ({
                ...prev,
                education: { ...prev.education, [name]: value },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(
                "/user/updateProfile",
                { ...form, skills: form.skills.split(",").map((s) => s.trim()) },
                { withCredentials: true }
            );
            toast.success("Profile updated!");
        } catch {
            toast.error("Failed to update profile.");
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/user/logout");
            navigate("/login");
            toast.success("Logged out");
        } catch {
            toast.error("Logout failed");
        }
    };

    if (!user) return <p>Loading...</p>;

    const avatarSrc = user?.profileImage;

    return (
        <div className="min-h-screen bg-gray-100 flex text-black">
           {/* left side section  */}
            <div className="w-64 bg-white shadow-3xl p-6 flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
                    <img
                        src={avatarSrc}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover mb-2 "
                    />
                    <div className="absolute bottom-[25px] right-[2px] w-[93px] bg-black/50 text-white text-xs py-1 text-center rounded-b-full opacity-0 group-hover:opacity-100 transition">
                        <FaEdit className="inline mr-1" /> Edit Profile
                    </div>

                </div>

                <p className="font-semibold text-lg ">{user?.name}</p>
                <ul className="mt-5 w-full space-y-2 text-sm">
                    <li className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100 font-medium">
                        <FaUser /> Profile Details
                    </li>
                    <li className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100 font-medium">
                        <BsFillFilePostFill /> Posts
                    </li>
                    <li
                        className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100  font-medium"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt /> Logout
                    </li>
                </ul>
            </div>

            {/* profile details */}
            <div className="flex-1 p-10">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-bold mb-6">Edit Profile Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Role
                            </label>
                            <input
                                type="text"
                                value={user?.role}
                                disabled
                                className="w-full border rounded-md px-4 py-2 bg-gray-100 text-gray-600"
                            />
                        </div>

                        {/* editable fields */}
                        {[
                            { label: "Headline", name: "headline", placeholder: "Full Stack Developer" },
                            { label: "Location", name: "location", placeholder: "Mumbai, India" },
                            { label: "Experience", name: "experience", placeholder: "2 years" },
                            { label: "Company", name: "companyName", placeholder: "Google" },
                            { label: "Position", name: "positionAtCompany", placeholder: "Software Engineer" },
                            { label: "Skills", name: "skills", placeholder: "React, Node.js, MongoDB" },
                        ].map((f) => (
                            <div key={f.name}>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
                                <input
                                    type="text"
                                    name={f.name}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                />
                            </div>
                        ))}

                        {/* education */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Education ( Enter school/college name )
                            </label>
                            {["SSC", "HSC", "diploma", "degree"].map((edu) => (
                                <input
                                    key={edu}
                                    type="text"
                                    name={edu}
                                    value={form.education[edu]}
                                    onChange={handleChange}
                                    placeholder={edu}
                                    className="w-full border rounded-md px-4 py-2 mb-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[380px] relative animate-fadeIn">

                        {/* close Btn */}

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setProfilePic(null);
                                setPreviewURL("");
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            <FaTimes size={20} />
                        </button>

                        <h3 className="font-semibold text-lg mb-4 text-center">Edit Profile Picture</h3>

                        {!previewURL ? (
                            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="uploadInput"
                                />
                                <label htmlFor="uploadInput" className="cursor-pointer flex flex-col items-center">
                                    <FaCloudUploadAlt size={40} className="text-orange-500 mb-2" />
                                    <span className="text-gray-500 text-sm">Click to upload</span>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-56 bg-gray-200 rounded-md overflow-hidden">
                                <Cropper
                                    image={previewURL}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-5">
                            {!previewURL ? (
                                <button
                                    onClick={handleProfileDelete}
                                    className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                                >
                                    <FaTrash /> Delete
                                </button>
                            ) : (
                                <button
                                    onClick={handleProfileUpload}
                                    className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                >
                                    <FaUpload />
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
