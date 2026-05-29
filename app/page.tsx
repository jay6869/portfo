'use client'

import { useState } from 'react'
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Projects } from "@/components/sections/projects"
import { Contact } from "@/components/sections/contact"
import RadioNav from "@/components/navigation/radio-nav"

export default function Home() {
  const [activeSection, setActiveSection] = useState('about')

  return (
    <main className="min-h-screen bg-black">
      <Hero />
      
      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <RadioNav activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>
      </div>

      {activeSection === 'about' && <About />}
      {activeSection === 'skills' && <Skills />}
      {activeSection === 'projects' && <Projects />}
      {activeSection === 'contact' && <Contact />}
    </main>
  )
}
