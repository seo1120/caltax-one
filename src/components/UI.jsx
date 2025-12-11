// 공통 UI 컴포넌트
export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
);

export const Button = ({ children, onClick, disabled, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
      variant === 'primary'
        ? 'text-white disabled:opacity-50'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    style={variant === 'primary' ? {
      backgroundColor: disabled ? '#9CA3AF' : '#005AAB',
      ...(disabled ? {} : { ':hover': { backgroundColor: '#004A8B' } })
    } : {}}
    onMouseEnter={(e) => {
      if (variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = '#004A8B';
      }
    }}
    onMouseLeave={(e) => {
      if (variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = '#005AAB';
      }
    }}
  >
    {children}
  </button>
);

export const Input = ({ label, value, onChange, placeholder, type = "text", name }) => (
  <div className="mb-5">
    <label className="block text-lg font-normal text-black mb-2.5 px-2.5">{label}</label>
    <input
      type={type}
      name={name}
      autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
      className="w-full h-10 bg-[#fbfbfb] border border-[#afd5ff] rounded-[40px] outline-none px-4"
      style={{ '--tw-ring-color': '#005AAB', position: 'relative' }}
      onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #005AAB'}
      onBlur={(e) => e.currentTarget.style.boxShadow = ''}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

