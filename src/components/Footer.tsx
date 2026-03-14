import { useStore } from '../store/useStore.js';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-serif mb-4">{settings?.websiteTitle || 'METAL ART'}</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Crafting bespoke metal art and premium product designs with uncompromising quality and attention to detail.
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4">Contact</h4>
            <p className="text-sm mb-2">
              <a href={`mailto:${settings?.adminEmail || 'contact@example.com'}`} className="text-white/60 hover:text-[#c5a059] transition-colors">
                {settings?.adminEmail || 'contact@example.com'}
              </a>
            </p>
            <p className="text-sm">
              <a href={`tel:${settings?.adminPhone || '+1 234 567 890'}`} className="text-white/60 hover:text-[#c5a059] transition-colors">
                {settings?.adminPhone || '+1 234 567 890'}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4">Social</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/vallery_studio.lab" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c5a059] transition-colors text-sm">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {settings?.websiteTitle || 'Metal Art'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
