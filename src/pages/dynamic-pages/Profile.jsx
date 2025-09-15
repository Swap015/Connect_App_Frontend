import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/getUser/${id}`);
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to load user", err);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-6 p-6 text-black">
            
            <div className="flex items-center gap-4 border-b pb-4">
                <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
                <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-600">{user.headline || "No headline yet"}</p>
                    <p className="text-sm text-gray-500">{user.location || "No location"}</p>

                </div>
            </div>

          
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Work</h3>
                <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {user.companyName || "Not provided"}
                </p>
                <p>
                    <span className="font-semibold">Position:</span>{" "}
                    {user.positionAtCompany || "Not provided"}
                </p>
                <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {user.experience || "Not provided"}
                </p>
            </div>

           
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                {user.education && user.education.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {user.education.map((edu, i) => (
                            <li key={i} className="text-sm">
                                {edu.SSC && <p>SSC: {edu.SSC}</p>}
                                {edu.HSC && <p>HSC: {edu.HSC}</p>}
                                {edu.diploma && <p>Diploma: {edu.diploma}</p>}
                                {edu.degree && <p>Degree: {edu.degree}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No education details</p>
                )}
            </div>

         
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                {user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No skills added</p>
                )}
            </div>

     
            <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Connections</h3>
                <p>
                    <span className="font-semibold">Total Connections:</span>{" "}
                    {user.connections?.length || 0}
                </p>
                <p>
                    <span className="font-semibold">Followers:</span>{" "}
                    {user.followers?.length || 0}
                </p>
                <p>
                    <span className="font-semibold">Following:</span>{" "}
                    {user.following?.length || 0}
                </p>
            </div>

          
            <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Profile Visits</h3>
                <p>
                    <span className="font-semibold">Visited:</span>{" "}
                    {user.profileVisits?.length || 0} times
                </p>
            </div>
        </div>
    );
};

export default Profile;
