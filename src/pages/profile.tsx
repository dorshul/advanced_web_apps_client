// import React, { useState, useEffect } from 'react';
// import { useProfile, useUpdateProfile } from '../hooks/user';

// const ProfilePage: React.FC = () => {
//   const { data: profile, isLoading } = useProfile();
//   const {
//     mutate: updateProfile,
//     isPending: isUpdating,
//     error,
//   } = useUpdateProfile();
//   const [formData, setFormData] = useState({ name: '', email: '' });

//   useEffect(() => {
//     if (profile) {
//       setFormData({ name: profile.name, email: profile.email });
//     }
//   }, [profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateProfile(formData);
//   };

//   if (isLoading) return <div>Loading profile...</div>;

//   return (
//     <div>
//       <h1>Update Profile</h1>
//       {error && <div>Error updating profile</div>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input name="name" value={formData.name} onChange={handleChange} />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input name="email" value={formData.email} onChange={handleChange} />
//         </div>
//         <button type="submit" disabled={isUpdating}>
//           Update Profile
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfilePage;
