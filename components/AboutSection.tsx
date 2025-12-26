'use client';

export default function AboutSection() {
  const sites = [
    {
      title: 'PNG to JPEG Converter',
      description: 'Convert PNG images to JPEG format with quality control',
      url: '/png-to-jpeg',
    },
    {
      title: 'Image Tools',
      description: 'All-in-one image editing and conversion toolkit',
      url: '/image-tools',
    },
    {
      title: 'PDF Tools',
      description: 'Comprehensive PDF manipulation and conversion tools',
      url: '/pdf-tools',
    },
  ];

  const services = [
    {
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
    },
    {
      title: 'Mobile App Development',
      description: 'iOS and Android applications with clean, intuitive interfaces',
    },
    {
      title: 'Packaging Design',
      description: 'Creative packaging solutions, labels, and brand identity design',
    },
  ];

  return (
    <section id="about" className="mb-20 py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* About Product */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
            About
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light mb-4">
            A free, professional barcode generator designed for designers, developers, and businesses. 
            Create high-quality barcodes and QR codes instantly with full customization options. 
            Export in multiple formats suitable for print, web, and digital use.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            No registration required. Works entirely in your browser. Fast, reliable, and free forever.
          </p>
        </div>

        {/* Sites Cards */}
        <div className="mb-20">
          <h3 className="text-xl font-light text-gray-900 dark:text-white mb-8 tracking-tight uppercase text-center">
            Other Tools
          </h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {sites.map((site, index) => (
              <a
                key={index}
                href={site.url}
                className="block border border-gray-300 dark:border-gray-700 p-6 hover:border-gray-900 dark:hover:border-gray-400 transition-all duration-300 group"
              >
                <h4 className="text-sm font-light text-gray-900 dark:text-white mb-2 tracking-tight group-hover:opacity-80">
                  {site.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  {site.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Services Cards */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
          <h3 className="text-xl font-light text-gray-900 dark:text-white mb-8 tracking-tight uppercase text-center">
            Services
          </h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-700 p-6"
              >
                <h4 className="text-sm font-light text-gray-900 dark:text-white mb-2 tracking-tight">
                  {service.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

