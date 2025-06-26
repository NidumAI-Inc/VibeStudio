import { CurlBlock } from '@/pages/vm-details/ollama/curl-block'
import { Clock, Download, Play, Volume2 } from 'lucide-react'
import downloadImage from '@/assets/imgs/download.png'
import historyImage from '@/assets/imgs/history.png'

const endpoints = [
  {
    title: '1. Check TTS Model Status',
    method: 'GET',
    url: 'http://localhost:40902/api/tts/status',
    description:
      'Streams real-time model loading progress using Server-Sent Events (SSE). Best tested in a terminal or browser.',
    icon: <Play className='w-4 h-4' />,
    curl: `
curl --location 'http://localhost:40902/api/tts/status'`,
    js: `
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("http://localhost:40902/api/tts/status", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `
import requests

url = "http://localhost:40902/api/tts/status"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
print(response.text)`,
  },
  {
    title: '2. Generate Audio',
    method: 'POST',
    url: 'http://localhost:40902/api/tts',
    description:
      'Generates audio from text input using the selected TTS model. Returns a filename you can use to download the generated `.wav` file.',
    icon: <Volume2 className='w-4 h-4' />,
    curl: `
curl --location 'http://localhost:40902/api/tts' \\
--header 'Content-Type: application/json' \\
--data '{
  "text": "hi",
  "voice": "af_aoede",
  "speed": 1
}'`,
    js: `
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "text": "hi",
  "voice": "af_aoede",
  "speed": 1
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:40902/api/tts", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `
import requests
import json

url = "http://localhost:40902/api/tts"

payload = json.dumps({
  "text": "hi",
  "voice": "af_aoede",
  "speed": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)`,
  },
]

export const endPoint2 = [
  {
    title: '3. Download Audio',
    description:
      'Use the ⬇ download button on each generated audio card to save the `.wav` file locally. Files are named automatically with a timestamp.',
    icon: <Download className='w-4 h-4 text-muted-foreground' />,
    image: <img src={downloadImage} alt='Download TTS audio' className='rounded-md border max-w-full h-auto' />,
  },
  {
    title: '4. View TTS History',
    description:
      'All past recordings appear in the TTS History panel. You can replay, view the transcript, check the generation time, or download again.',
    icon: <Clock className='w-4 h-4 text-muted-foreground' />,
    image: <img src={historyImage} alt='TTS history UI' className='rounded-md border max-w-full h-auto' />,
  },
]

function TtsDocs() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <div className='space-y-6'>
          {endpoints.map((ep) => (
            <CurlBlock
              key={ep.title}
              title={ep.title}
              method={ep.method}
              url={ep.url}
              curl={ep.curl}
              js={ep.js}
              python={ep.python}
              description={ep.description}
              icon={ep.icon}
            />
          ))}
          {endPoint2.map((block) => (
            <TTSImageBlock
              key={block.title}
              title={block.title}
              description={block.description}
              icon={block.icon}
              imageSrc={block.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TtsDocs

type TTSImageBlockProps = {
  title: string
  description: string
  icon: React.ReactNode
  imageSrc: React.ReactNode
}

export function TTSImageBlock({ title, description, icon, imageSrc }: TTSImageBlockProps) {
  return (
    <div className='border rounded-xl p-6 bg-muted/40 space-y-4 shadow-sm'>
      <div className='flex items-center gap-3'>
        <div className='bg-primary/10 text-primary rounded-full p-2'>{icon}</div>
        <h3 className='text-lg font-semibold'>{title}</h3>
      </div>
      <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
      <div>{imageSrc}</div>
    </div>
  )
}
