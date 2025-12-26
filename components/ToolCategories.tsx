'use client';

import { categories, tools, getIcon } from '@/lib/tools-data';
import ToolCard from './ToolCard';

export default function ToolCategories() {
  // Group tools by category
  const toolsByCategory = categories.map((category) => ({
    ...category,
    tools: tools.filter((tool) => tool.category === category.id),
  }));

  return (
    <section className="bg-[#F8FAFC] dark:bg-[#111827] py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
            Tool Categories
          </h2>
          <p className="text-lg text-[#475569] dark:text-[#64748B] max-w-2xl mx-auto">
            Browse tools by category to find exactly what you need
          </p>
        </div>

        <div className="space-y-16">
          {toolsByCategory.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[#2563EB] dark:text-[#3B82F6]">
                  {getIcon(category.icon)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-[#E5E7EB]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#64748B] mt-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Tools Grid */}
              {category.tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {category.tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      icon={getIcon(tool.icon)}
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#64748B] dark:text-[#64748B] text-center py-8">
                  Coming soon...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



