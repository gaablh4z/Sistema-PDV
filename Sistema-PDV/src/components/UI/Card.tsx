import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false
}) => {
  return (
    <div 
      className={`
        ${glass 
          ? 'glass-card backdrop-blur-md bg-white/80 border-white/40' 
          : 'bg-white border-primary-100'}
        rounded-xl shadow-red-md border 
        ${hover ? 'hover:shadow-red-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 border-b border-primary-100 ${className}`}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card
