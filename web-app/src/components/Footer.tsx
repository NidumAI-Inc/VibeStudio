import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Footer = () => {
  return (
    <footer className='bg-black border-t border-white/10 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <img
                src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
                alt='VibeStudio AI Logo'
                className='w-8 h-8'
              />
              <span className='text-2xl font-bold text-yellow-500'>VibeStudio AI</span>
            </div>
            <p className='text-gray-400 mb-6 max-w-md'>
              The future of AI-powered development. Build, deploy, and scale your applications with Claude AI and
              seamless GitHub integration.
            </p>
            <div className='flex space-x-4'>
              <Button variant='ghost' size='sm' className='hover:bg-white/10'>
                <Github className='w-5 h-5' />
              </Button>
              <Button variant='ghost' size='sm' className='hover:bg-white/10'>
                <Twitter className='w-5 h-5' />
              </Button>
              <Button variant='ghost' size='sm' className='hover:bg-white/10'>
                <Linkedin className='w-5 h-5' />
              </Button>
              <Button variant='ghost' size='sm' className='hover:bg-white/10'>
                <Mail className='w-5 h-5' />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Product</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Features
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Pricing
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  API Docs
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Resources</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Documentation
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Community
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-400 text-sm'>© 2024 VibeStudio AI. All rights reserved.</p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <a href='#' className='text-gray-400 hover:text-white text-sm transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='text-gray-400 hover:text-white text-sm transition-colors'>
              Terms of Service
            </a>
            <a href='#' className='text-gray-400 hover:text-white text-sm transition-colors'>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
