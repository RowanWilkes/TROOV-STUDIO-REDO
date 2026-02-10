"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="bg-slate-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Image
            src="/troov-studio-footer-logo.png"
            alt="Troov Studio"
            width={280}
            height={80}
            className="object-contain"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Dashboard Menu */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Dashboard</h3>
            <ul className="space-y-2">
              <li>
                <a href="#overview" className="text-gray-300 hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#mood" className="text-gray-300 hover:text-white transition-colors">
                  Mood Board
                </a>
              </li>
              <li>
                <a href="#styleguide" className="text-gray-300 hover:text-white transition-colors">
                  Style Guide
                </a>
              </li>
              <li>
                <a href="#wireframe" className="text-gray-300 hover:text-white transition-colors">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="#technical" className="text-gray-300 hover:text-white transition-colors">
                  Technical Specs
                </a>
              </li>
              <li>
                <a href="#content" className="text-gray-300 hover:text-white transition-colors">
                  Content & Copy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#summary" className="text-gray-300 hover:text-white transition-colors">
                  Project Summary
                </a>
              </li>
              <li>
                <a href="#assets" className="text-gray-300 hover:text-white transition-colors">
                  Assets Library
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Subscribe To Our Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get design tips and tricks delivered to your inbox</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                required
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-slate-800 bg-transparent"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-sm text-gray-400">©{new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
