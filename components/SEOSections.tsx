import Link from 'next/link';

interface SEOSectionProps {
  toolType: 'image' | 'pdf';
  toolName: string;
  features: string[];
  howItWorks: { step: number; title: string; description: string }[];
  useCases: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  relatedTools?: { name: string; href: string }[];
}

export function SEOSections({ toolType, toolName, features, howItWorks, useCases, faq, relatedTools }: SEOSectionProps) {
  return (
    <div className="space-y-8 mb-16">
      {/* Features Section */}
      <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
        <ol className="space-y-6">
          {howItWorks.map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">
                {item.step}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Use Cases Section */}
      <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{useCase.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faq.map((item, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.question}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Section */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-center font-medium"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

