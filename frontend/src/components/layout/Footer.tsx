"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* App */}
        <div>
          <h3 className="font-semibold mb-4">App</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/community">Community</Link></li>
            <li><Link href="#">Product Updates</Link></li>
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Mobile App</Link></li>
            <li><Link href="#">Desktop App</Link></li>
            <li><Link href="/plans">Pricing And Sign Up</Link></li>
            <li><Link href="/signin">Sign In</Link></li>
            <li><Link href="#">API</Link></li>
          </ul>
        </div>

        {/* Bank Feeds */}
        <div>
          <h3 className="font-semibold mb-4">Bank Feeds</h3>
          <ul className="space-y-2 text-sm">
            <li>Global</li>
            <li>Australia</li>
            <li>United Kingdom</li>
            <li>Canada</li>
            <li>New Zealand</li>
            <li>United States</li>
          </ul>
        </div>

        {/* Key Features */}
        <div>
          <h3 className="font-semibold mb-4">Key Features</h3>
          <ul className="space-y-2 text-sm">
            <li>Automatic Bank Feeds</li>
            <li>Budget Calendar</li>
            <li>Multi Currency</li>
            <li>Cash Flow Forecasts</li>
            <li>Transactions</li>
            <li>Net Worth</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>Learn Center</li>
            <li>Blog</li>
            <li>Global Spending Map</li>
            <li>Money Methodologies</li>
            <li>White Papers</li>
            <li>Affiliate Program</li>
            <li>Gift Kinance</li>
            <li>Keeping Safe</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>Terms Of Service</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
            <li>Security</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Media & Press</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 px-6 flex flex-col md:flex-row items-center justify-between border-t border-purple-700 pt-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src="/images/logo.png" alt="Logo" className="h-6 w-auto" />
          <span className="font-semibold">Kinance</span>
        </div>

        {/* Social icons */}
        <div className="flex gap-4 mb-4 md:mb-0 text-gray-300">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="#"><FaInstagram /></a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © Kinance Ltd. All rights reserved 2008 - 2025
        </p>
      </div>
    </footer>
  );
}
