import React, { useState, useEffect } from "react";
import SectionContainer from "../../components/SectionContainer";
import { FaUser, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { toast } from 'react-toastify';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        ssn: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/user/me');
                const userData = response.data;
                setProfile({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    dob: userData.dob ? userData.dob.split('T')[0] : '',
                    ssn: userData.ssn ? `***-**-${userData.ssn.slice(-4)}` : ''
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { ssn, ...profileData } = profile; 
            await api.put('/user/me', profileData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profile.fullName) {
        return (
            <SectionContainer>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8">
                            <FaUser className="text-4xl text-blue-500" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800">{profile.fullName || 'No Name'}</h1>
                            <p className="text-gray-600">Member since {profile.dob ? new Date(profile.dob).getFullYear() : new Date().getFullYear()}</p>
                        </div>
                        <div className="w-full md:w-auto flex justify-center md:justify-end mt-4 md:mt-0 md:ml-8">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit className="mr-2" /> Edit Profile
                                </button>
                            ) : (
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="flex items-center">
                                    <FaUser className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profile.fullName}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.fullName || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="flex items-center">
                                    <FaEnvelope className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.email || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <div className="flex items-center">
                                    <FaPhone className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.phone || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dob"
                                            value={profile.dob}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">
                                            {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* SSN */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number</label>
                                <div className="flex items-center">
                                    <FaIdCard className="text-gray-400 mr-3" />
                                    <p className="text-gray-800">{profile.ssn || 'Not provided'}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-7">For security reasons, only the last 4 digits are shown</p>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <div className="flex">
                                    <FaMapMarkerAlt className="text-gray-400 mr-3 mt-2 flex-shrink-0" />
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={profile.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800 whitespace-pre-line">
                                            {profile.address || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Profile;