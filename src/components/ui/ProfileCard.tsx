import React from 'react';

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm max-w-xs mx-auto">
      {/* Large AB Initials */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-800">AB</span>
      </div>
      
      {/* Name */}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Abebe Balcha</h2>
      
      {/* Email */}
      <p className="text-sm text-gray-500 mb-4">abebebalch@email.com</p>
      
      {/* Rating - Simple text version like in your image */}
      <div className="text-lg font-medium text-gray-800">4.7</div>
    </div>
  );
};

export default ProfileCard;