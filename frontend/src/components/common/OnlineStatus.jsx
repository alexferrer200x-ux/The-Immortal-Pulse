const OnlineStatus = ({ isOnline, size = 'md', showText = false }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`${sizeClasses[size]} rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
      {showText && (
        <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  )
}

export default OnlineStatus
