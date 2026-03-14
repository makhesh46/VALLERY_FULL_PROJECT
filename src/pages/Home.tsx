import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard.js';
import RequestModal from '../components/RequestModal.js';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setFeaturedProducts(res.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1565193566173-7a0cb3d16233?q=80&w=2070&auto=format&fit=crop';
            }}
            alt="Metal Workshop" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0a0a0a]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#c5a059] text-sm uppercase tracking-[0.3em] mb-6"
          >
            Bespoke Metal Craft
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight"
          >
            Where Metal Meets <span className="italic text-white/80">Mastery</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/products" 
              className="inline-block border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 px-8 py-4 rounded-full uppercase tracking-widest text-sm"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-serif text-white mb-4">Featured Works</h2>
            <p className="text-white/50 max-w-xl">Discover our latest creations, forged with precision and designed to elevate any space.</p>
          </div>
          <Link to="/products" className="hidden md:inline-block text-sm uppercase tracking-widest text-[#c5a059] hover:text-white transition-colors border-b border-[#c5a059] pb-1">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product: any) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onRequest={(p) => setSelectedProduct(p)} 
            />
          ))}
        </div>
      </section>

      <RequestModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </div>
  );
}
