import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold text-teal-700 flex items-center gap-2">
                            🌍 TravelPlan
                        </Link>
                        <p className="text-gray-500 leading-relaxed max-w-xs">
                            Your ultimate AI-powered travel companion. 
                            Discover hidden gems, plan perfect itineraries, and explore the world with ease.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-teal-600 transition-colors hover:translate-x-1 inline-block">Home</Link></li>
                            <li><Link to="/explore" className="text-gray-500 hover:text-teal-600 transition-colors hover:translate-x-1 inline-block">Explore Trips</Link></li>
                            <li><Link to="/ai-planner" className="text-gray-500 hover:text-teal-600 transition-colors hover:translate-x-1 inline-block">AI Trip Planner</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-teal-600 transition-colors hover:translate-x-1 inline-block">Login / Signup</Link></li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-6">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:-translate-y-1 transition-all text-xl">🐦</a>
                            <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:-translate-y-1 transition-all text-xl">📸</a>
                            <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:-translate-y-1 transition-all text-xl">📘</a>
                            <a href="#" aria-label="LinkedIn" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:-translate-y-1 transition-all text-xl">💼</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} TravelPlan. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
