import { Copy, Check, Terminal, Play, Database, MessageSquare, Download } from 'lucide-react'
import { CurlBlock } from './curl-block'

// const endpoints = [
//   {
//     title: '1. Load Model',
//     method: 'POST',
//     url: '{{baseUrl}}/api/generate',
//     description: 'Load a model into memory for faster inference',
//     icon: <Play className='w-4 h-4' />,
//     curl: `
//     curl --location 'http://localhost:11434/api/generate' \\
//     --header 'Content-Type: application/json' \\
//     --data '{
//       "model": "llama3.1"
//     }'`,
//     js: `
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({ "model": "llama3.1" });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     fetch("http://localhost:11434/api/generate", requestOptions)
//       .then(response => response.text())
//       .then(result => console.log(result))
//       .catch(error => console.error(error));`,
//     python: `
//     import requests
//     import json

//     url = "http://localhost:11434/api/generate"

//     payload = json.dumps({ "model": "llama3.1" })
//     headers = { 'Content-Type': 'application/json' }

//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)`,
//   },
//   {
//     title: '2. Unload Model',
//     method: 'POST',
//     url: '{{baseUrl}}/api/generate',
//     description: 'Remove model from memory to free up resources',
//     icon: <Database className='w-4 h-4' />,
//     curl: `curl --location 'http://localhost:11434/api/generate' \n
//           --header 'Content-Type: application/json' \n
//           --data '{
//             "model": "llama3.1",
//             "keep_alive": 0
//           }'`,
//     js: `const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// const raw = JSON.stringify({
//   "model": "llama3.1",
//   "keep_alive": 0
// });

// const requestOptions = {
//   method: "POST",
//   headers: myHeaders,
//   body: raw,
//   redirect: "follow"
// };

// fetch("http://localhost:11434/api/generate", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));`,
//     python: `import requests
// import json

// url = "http://localhost:11434/api/generate"

// payload = json.dumps({
//   "model": "llama3.1",
//   "keep_alive": 0
// })
// headers = {
//   'Content-Type': 'application/json'
// }

// response = requests.request("POST", url, headers=headers, data=payload)

// print(response.text)
// `,
//   },
//   {
//     title: '3. List Models',
//     method: 'GET',
//     url: '{{baseUrl}}/api/tags',
//     description: 'Get all available models on the server',
//     icon: <Database className='w-4 h-4' />,
//     curl: `curl --location 'http://localhost:11434/api/tags'`,
//     js: `const requestOptions = {
//           method: "GET",
//           redirect: "follow"
//         };

//         fetch("http://localhost:11434/api/tags", requestOptions)
//           .then((response) => response.text())
//           .then((result) => console.log(result))
//           .catch((error) => console.error(error));`,
//     python: `
//       import requests

//       url = "http://localhost:11434/api/tags"

//       payload = {}
//       headers = {}

//       response = requests.request("GET", url, headers=headers, data=payload)

//       print(response.text)
//       `,
//   },
//   {
//     title: '4. Chat Completion (No Streaming)',
//     method: 'POST',
//     url: '{{baseUrl}}/api/chat',
//     description: 'Send a chat message and get a complete response',
//     icon: <MessageSquare className='w-4 h-4' />,
//     curl: `curl --location 'http://localhost:11434/api/chat' \\
//           --header 'Content-Type: application/json' \\
//           --data '{
//             "model": "llama3.1",
//             "messages": [
//               { "role": "system", "content": "you are a salty pirate" },
//               { "role": "user", "content": "why is the sky blue" }
//             ],
//             "stream": false
//           }'`,
//     js: `const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");

//         const raw = JSON.stringify({
//           "model": "llama3.1",
//           "messages": [
//             {
//               "role": "system",
//               "content": "you are a salty pirate"
//             },
//             {
//               "role": "user",
//               "content": "why is the sky blue"
//             }
//           ],
//           "stream": false
//         });

//         const requestOptions = {
//           method: "POST",
//           headers: myHeaders,
//           body: raw,
//           redirect: "follow"
//         };

//         fetch("http://localhost:11434/api/chat", requestOptions)
//           .then((response) => response.text())
//           .then((result) => console.log(result))
//           .catch((error) => console.error(error));`,
//     python: `import requests
//             import json

//             url = "http://localhost:11434/api/chat"

//             payload = json.dumps({
//               "model": "llama3.1",
//               "messages": [
//                 {
//                   "role": "system",
//                   "content": "you are a salty pirate"
//                 },
//                 {
//                   "role": "user",
//                   "content": "why is the sky blue"
//                 }
//               ],
//               "stream": False
//             })
//             headers = {
//               'Content-Type': 'application/json'
//             }

//             response = requests.request("POST", url, headers=headers, data=payload)

//             print(response.text)
//             `,
//   },
//   {
//     title: '5. Chat Completion (Streaming)',
//     method: 'POST',
//     url: '{{baseUrl}}/api/chat',
//     description: 'Send a chat message and stream the response',
//     icon: <MessageSquare className='w-4 h-4' />,
//     curl: `
// curl --location --globoff '{{baseUrl}}/api/chat' \
// --data '{
//   "model": "{{model}}",
//   "messages": [
//     {
//       "role": "system",
//       "content": "you are a salty pirate"
//     },
//     {
//       "role": "user",
//       "content": "why is the sky blue"
//     }
//   ]
// }'`,
//     js: `
// const raw = "{\n  \"model\": \"{{model}}\", \n  \"messages\": [\n    {\n      \"role\": \"system\", \n      \"content\": \"you are a salty pirate\" \n    },\n    {\n      \"role\": \"user\", \n      \"content\": \"why is the sky blue\" \n    }\n  ]\n}";

// const requestOptions = {
//   method: "POST",
//   body: raw,
//   redirect: "follow"
// };

// fetch("{{baseUrl}}/api/chat", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));`,
//     python: `
// import requests

// url = "{{baseUrl}}/api/chat"

// payload = "{\n  \"model\": \"{{model}}\", \n  \"messages\": [\n    {\n      \"role\": \"system\", \n      \"content\": \"you are a salty pirate\" \n    },\n    {\n      \"role\": \"user\", \n      \"content\": \"why is the sky blue\" \n    }\n  ]\n}"
// headers = {}

// response = requests.request("POST", url, headers=headers, data=payload)

// print(response.text)

// `,
//   },
//   {
//     title: '6. Pull a Model',
//     method: 'POST',
//     url: '{{baseUrl}}/api/pull',
//     description: 'Download a model from the Ollama registry',
//     icon: <Download className='w-4 h-4' />,
//     curl: `
// curl --location 'http://localhost:11434/api/pull' \
// --header 'Content-Type: application/json' \
// --data '{
//     "name": "orca-mini",
//     "stream": false
// }'`,
//     js: `
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");

//           const raw = JSON.stringify({
//             "name": "orca-mini",
//             "stream": false
//           });

//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow"
//           };

//         fetch("http://localhost:11434/api/pull", requestOptions)
//           .then((response) => response.text())
//           .then((result) => console.log(result))
//           .catch((error) => console.error(error));`,
//     python: `
//         import requests
//         import json

//         url = "http://localhost:11434/api/pull"

//         payload = json.dumps({
//           "name": "orca-mini",
//           "stream": False
//         })
//         headers = {
//           'Content-Type': 'application/json'
//         }

//         response = requests.request("POST", url, headers=headers, data=payload)

//         print(response.text)
//   `,
//   },
// ]
const endpoints = [
  {
    title: '1. Load Model',
    method: 'POST',
    url: '{{baseUrl}}/api/generate',
    description: 'Load a model into memory for faster inference',
    icon: <Play className='w-4 h-4' />,
    curl: `
    curl --location 'http://localhost:11434/api/generate' \\
    --header 'Content-Type: application/json' \\
    --data '{
      "model": "llama3.1"
    }'`,
    js: `
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "model": "llama3.1" });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:11434/api/generate", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));`,
    python: `
    import requests
    import json

    url = "http://localhost:11434/api/generate"

    payload = json.dumps({ "model": "llama3.1" })
    headers = { 'Content-Type': 'application/json' }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)`,
  },
  {
    title: '2. Unload Model',
    method: 'POST',
    url: '{{baseUrl}}/api/generate',
    description: 'Remove model from memory to free up resources',
    icon: <Database className='w-4 h-4' />,
    curl: `curl --location 'http://localhost:11434/api/generate' \n
          --header 'Content-Type: application/json' \n
          --data '{
            "model": "llama3.1",
            "keep_alive": 0
          }'`,
    js: `const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "model": "llama3.1",
  "keep_alive": 0
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:11434/api/generate", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `import requests
import json

url = "http://localhost:11434/api/generate"

payload = json.dumps({
  "model": "llama3.1",
  "keep_alive": 0
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
`,
  },
  {
    title: '3. List Models',
    method: 'GET',
    url: '{{baseUrl}}/api/tags',
    description: 'Get all available models on the server',
    icon: <Database className='w-4 h-4' />,
    curl: `curl --location 'http://localhost:11434/api/tags'`,
    js: `const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("http://localhost:11434/api/tags", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `
import requests

url = "http://localhost:11434/api/tags"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
`,
  },
  {
    title: '4. Chat Completion (No Streaming)',
    method: 'POST',
    url: '{{baseUrl}}/api/chat',
    description: 'Send a chat message and get a complete response',
    icon: <MessageSquare className='w-4 h-4' />,
    curl: `curl --location 'http://localhost:11434/api/chat' \\
          --header 'Content-Type: application/json' \\
          --data '{
            "model": "llama3.1", 
            "messages": [
              { "role": "system", "content": "you are a salty pirate" },
              { "role": "user", "content": "why is the sky blue" }
            ],
            "stream": false 
          }'`,
    js: `const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "model": "llama3.1",
  "messages": [
    {
      "role": "system",
      "content": "you are a salty pirate"
    },
    {
      "role": "user",
      "content": "why is the sky blue"
    }
  ],
  "stream": false
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:11434/api/chat", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `import requests
import json

url = "http://localhost:11434/api/chat"

payload = json.dumps({
  "model": "llama3.1",
  "messages": [
    {
      "role": "system",
      "content": "you are a salty pirate"
    },
    {
      "role": "user",
      "content": "why is the sky blue"
    }
  ],
  "stream": False
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
`,
  },
  {
    title: '5. Chat Completion (Streaming)',
    method: 'POST',
    url: '{{baseUrl}}/api/chat',
    description: 'Send a chat message and stream the response',
    icon: <MessageSquare className='w-4 h-4' />,
    curl: `
curl --location --globoff '{{baseUrl}}/api/chat' \
--data '{
  "model": "{{model}}", 
  "messages": [
    {
      "role": "system", 
      "content": "you are a salty pirate" 
    },
    {
      "role": "user", 
      "content": "why is the sky blue" 
    }
  ]
}'`,
    js: `
const raw = "{\n  \\"model\\": \\"{{model}}\\", \n  \\"messages\\": [\n    {\n      \\"role\\": \\"system\\", \n      \\"content\\": \\"you are a salty pirate\\" \n    },\n    {\n      \\"role\\": \\"user\\", \n      \\"content\\": \\"why is the sky blue\\" \n    }\n  ]\n}";

const requestOptions = {
  method: "POST",
  body: raw,
  redirect: "follow"
};

fetch("{{baseUrl}}/api/chat", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `
import requests

url = "{{baseUrl}}/api/chat"

payload = "{\\n  \\"model\\": \\"{{model}}\\", \\n  \\"messages\\": [\\n    {\\n      \\"role\\": \\"system\\", \\n      \\"content\\": \\"you are a salty pirate\\" \\n    },\\n    {\\n      \\"role\\": \\"user\\", \\n      \\"content\\": \\"why is the sky blue\\" \\n    }\\n  ]\\n}"
headers = {}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
`,
  },
  {
    title: '6. Pull a Model',
    method: 'POST',
    url: '{{baseUrl}}/api/pull',
    description: 'Download a model from the Ollama registry',
    icon: <Download className='w-4 h-4' />,
    curl: `
curl --location 'http://localhost:11434/api/pull' \
--header 'Content-Type: application/json' \
--data '{
    "name": "orca-mini",
    "stream": false
}'`,
    js: `
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "name": "orca-mini",
  "stream": false
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:11434/api/pull", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    python: `
import requests
import json

url = "http://localhost:11434/api/pull"

payload = json.dumps({
  "name": "orca-mini",
  "stream": False
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
`,
  },
]

function OllamaDocs() {
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
        </div>

        <div className='mt-16 text-center'>
          <div className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span>Ready to use with your Ollama server</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OllamaDocs
