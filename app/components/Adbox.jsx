const Adbox = ({ width = '', height = '' }) => {
  const widthStyle = width || '300px';
  const heightStyle = height || '250px';

  return (
    <div
      className="Adbox"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#D1D5DB', // Tailwind's bg-gray-300
          width: widthStyle,
          height: heightStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#6B7280' /* Tailwind's text-gray-500 */ }}>Ad Space</span>
      </div>
    </div>
  );
};

export default Adbox;
