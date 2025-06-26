import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, FileCode, Github, Zap, Server, Settings, Upload, Terminal, Eye, GitBranch } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Sessions',
      description:
        'Start streaming conversations with Claude AI. Resume sessions seamlessly with persistent chat history.',
      badge: 'Core',
      color: 'vibrant-purple',
    },
    {
      icon: FileCode,
      title: 'Advanced File Management',
      description:
        'Complete CRUD operations, file search, upload/download, and directory management with a powerful API.',
      badge: 'Essential',
      color: 'vibrant-blue',
    },
    {
      icon: Github,
      title: 'GitHub Integration',
      description:
        'Automatic repository creation and deployment. Push your projects directly to GitHub with zero configuration.',
      badge: 'Pro',
      color: 'vibrant-cyan',
    },
    {
      icon: Server,
      title: 'NPM App Sessions',
      description: 'Launch and manage your applications on dynamic ports. Built-in process management and logging.',
      badge: 'Dev Tools',
      color: 'vibrant-green',
    },
    {
      icon: Terminal,
      title: 'Real-time Streaming',
      description: 'Stream responses in real-time with NDJSON format. Monitor progress and get instant feedback.',
      badge: 'Performance',
      color: 'vibrant-pink',
    },
    {
      icon: Settings,
      title: 'Project Management',
      description: 'Organize projects, rename sessions, and track metrics. Complete project lifecycle management.',
      badge: 'Organization',
      color: 'vibrant-purple',
    },
  ]

  return (
    <section id='features' className='py-20 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <Badge className='mb-4 px-4 py-2 bg-white/10 border-white/20 text-white'>
            <Zap className='w-4 h-4 mr-2' />
            Powerful Features
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Everything you need to
            <span className='gradient-text block mt-2'>build with AI</span>
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            VibeStudio AI provides a comprehensive suite of tools for AI-powered development, from intelligent
            conversations to seamless deployment.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='glass border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in'
              style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className='flex items-center justify-between mb-4'>
                  <div className={`p-3 rounded-lg bg-${feature.color}/20`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className='text-xl font-bold text-white'>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-gray-300 text-base leading-relaxed'>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Endpoints Showcase */}
        <div className='mt-20'>
          <div className='text-center mb-12'>
            <h3 className='text-3xl font-bold mb-4 gradient-text'>Powerful API Endpoints</h3>
            <p className='text-gray-300 text-lg'>Complete control over your development workflow</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { endpoint: '/chat/start', description: 'Start AI sessions', icon: MessageSquare },
              { endpoint: '/upload', description: 'File uploads', icon: Upload },
              { endpoint: '/projects', description: 'List projects', icon: Eye },
              { endpoint: '/session/run-app', description: 'Launch apps', icon: GitBranch },
            ].map((item, index) => (
              <div key={index} className='glass p-6 rounded-xl text-center'>
                <div className='flex items-center justify-center w-12 h-12 bg-vibrant-purple/20 rounded-lg mb-4 mx-auto'>
                  <item.icon className='w-6 h-6 text-vibrant-purple' />
                </div>
                <code className='text-vibrant-cyan font-mono text-sm bg-dark-elevated px-2 py-1 rounded'>
                  {item.endpoint}
                </code>
                <p className='text-gray-400 text-sm mt-2'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
