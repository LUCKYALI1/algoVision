import React from 'react';

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const UserAvatar = ({ name, size = 'h-10 w-10' }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A';
  const bgColor = stringToColor(name || '');

  return (
    <div 
      className={`${size} rounded-full flex items-center justify-center font-bold text-white`}
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-lg">{initials}</span>
    </div>
  );
};

export default UserAvatar;