import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import PostCard from "../../../components/posts/PostCard.jsx";

const AdminUsersPosts = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          api.get("/admin/getusers"),
          api.get("/admin/posts")
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data.posts); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/admin/posts/${id}`);
    setPosts(posts.filter(p => p._id !== id));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center text-gray-800">Users & Posts</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-black">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <img src={u.profileImage} alt={u.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-sm text-black">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-blue-600 font-bold">{u.role}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

   
      <div>
        <h2 className="text-xl font-semibold mb-4 text-black">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(p => (
            <PostCard
              key={p._id}
              post={p}
              onDelete={handleDeletePost}
              currentUser={{}} 
              liked={false}
              handleLike={() => { }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPosts;
