import Link from 'next/link';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function ToolCard({ icon, title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block h-[160px] md:h-[180px] p-4 md:p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-700 rounded-xl hover:shadow-md hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-all duration-200"
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="mb-3 text-[#2563EB] dark:text-[#3B82F6] group-hover:scale-110 transition-transform">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-[#0F172A] dark:text-[#E5E7EB] mb-2 line-clamp-1">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-[#475569] dark:text-[#64748B] mb-auto line-clamp-2 flex-1">
          {description}
        </p>
        
        {/* CTA */}
        <div className="mt-3 flex items-center text-sm font-medium text-[#2563EB] dark:text-[#3B82F6] group-hover:gap-2 transition-all">
          <span>Use Tool</span>
          <svg 
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}



