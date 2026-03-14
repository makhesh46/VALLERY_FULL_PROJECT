import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  onRequest: (product: any) => void;
}

export default function ProductCard({ product, onRequest }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <Link to={`/products/${product._id}`} className="block aspect-[4/5] overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-xl font-serif text-white group-hover:text-[#c5a059] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-medium text-white/80">₹{product.price}</p>
        </div>
        
        <p className="text-sm text-white/50 line-clamp-2 mb-6 flex-1">
          {product.description}
        </p>
        
        <button
          onClick={() => onRequest(product)}
          className="w-full py-3 px-4 border border-white/20 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
        >
          Request Product
        </button>
      </div>
    </motion.div>
  );
}
