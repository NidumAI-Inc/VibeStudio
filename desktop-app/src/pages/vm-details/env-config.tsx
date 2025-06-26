// import { Loader } from "lucide-react"

// import { useFileContent } from "@/hooks/use-node"

import type { VMType } from "@/types/vm"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from '@/components/ui/card'

import JsonViewer from './temp'

type props = {
  id: string
  port: number
  title: string
  envPath: string
  type: VMType
}

const supabase = {
  'PostgreSQL': {
    'Host': 'db',
    'Port': 5432,
    'DB Name': 'postgres',
    'Password': 'nativenode@#',
  },
  'Dashboard Credentials': {
    'Username': 'supabase',
    'Password': 'native!@#',
  },
  'PGRST & API': {
    'Schemas': 'public, storage, graphql_public',
    'External API URL': 'http://localhost:8000',
    'JWT Expiry': '3600s',
  },
  'Redirect & Signup Settings': {
    'Site URL': 'http://localhost:3000',
    'Additional Redirects': '(none)',
    'Disable Signup': false,
    'Enable Email Signup': true,
    'Autoconfirm Email': false,
    'Enable Phone Signup': true,
    'Autoconfirm Phone': true,
    'Anonymous Users': false,
  },
  'Mailer': {
    'Admin Email': 'admin@example.com',
    'Host': 'supabase - mail',
    'Port': 2500,
    'URL Paths': '/auth/v1/verify (for all flows)',
  },

  'Studio (Admin UI)': {
    'Default Org': 'Default Organization',
    'Default Project': 'Default Project',
    'Port': 3000,
  },
  'Kong(API Gateway)': {
    'HTTP Port': 8000,
    'HTTPS Port': 8443,
  },
  'Connection Pooler': {
    'Proxy Transaction Port': 6543,
    'Default Pool Size': 20,
    'Max Clients': 100,
    'Tenant ID': 'your - tenant - id',
  },
  'Miscellaneous': {
    'Logflare API Keys': '(redacted)',
    'OpenAI API Key': '(not set)',
    'Docker Socket': '/var/run / docker.sock',
    'Google Project ID / Number': 'GOOGLE_PROJECT_ID, GOOGLE_PROJECT_NUMBER',
    'WebP Detection': true,
    'Verify Functions JWT': false,
  },
}

const lamp = {
  'Host': 'localhost',
  'Apache': {
    'Version': '2.4.62',
    'Port': 80,
    'Web Root': '/var/www/localhost/htdocs',
    'Drop files': 'index.php, index.html, etc.',
  },
  'PHP': {
    'Version': '8.3.19',
    'Sessions': 'Enabled',
  },
  'phpMyAdmin': {
    'Status': 'Installed',
    'URL': 'localhost/phpmyadmin',
    'GUI for MariaDB': 'root/appuser',
  },
  'MariaDB': {
    'Version': '15.2',
    'Port': 4406,
    'Users': 'root / admin12!',
    'Description': 'Database Server',
  },
  'Node.js': {
    'Version': 'v22.13.1',
    'npm': '10.9.1',
  },
}

function EnvConfig({}: props) {
  // const { data, isLoading } = useFileContent(id, envPath, port)

  return (
    <Card className='pl-5 pr-0 py-1 mt-6'>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='pr-5 text-lg cursor-pointer hover:no-underline'>
            {/* {title} Config */}
            Default Development Environment Configuration
          </AccordionTrigger>

          <AccordionContent className='relative rounded-md h-[440px] pr-5 overflow-auto'>
            {/* {
              isLoading ? (
                <div className='dc h-60'>
                  <Loader className='animate-spin' />
                </div>
              ) : (
                <JsonViewer data={JSON?.parse(data)} />
              )
            } */}

            <JsonViewer data={false ? supabase : lamp} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default EnvConfig
