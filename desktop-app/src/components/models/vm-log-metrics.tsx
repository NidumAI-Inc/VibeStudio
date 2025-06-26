import { Cpu, Download, Loader, MemoryStick, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricsGraphProps {
  cpuData: number[]
  memData: number[]
  netData: any
}

interface SingleLineGraphProps {
  data: any[]
  dataKey: string
  stroke: string
  name: string
  yAxisLabel: string
}

const getColorVar = (cssVar: string) => getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()

function SingleLineGraph({ data, dataKey, stroke, name, yAxisLabel }: SingleLineGraphProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
        <XAxis dataKey='time' label={{ value: 'Seconds ago', position: 'insideBottomRight', offset: -10 }} />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
          }}
        />

        <Legend verticalAlign='top' height={36} />
        <Line type='monotone' dataKey={dataKey} stroke={stroke} dot={false} name={name} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function MetricsGraph({ cpuData, memData, netData }: MetricsGraphProps) {
  const hasEnoughData = cpuData.length > 5 && memData.length > 5
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (hasEnoughData) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 20 : 100))
    }, 1000)
    return () => clearInterval(interval)
  }, [hasEnoughData])

  const download = parseFloat(netData.download) || 0
  const upload = parseFloat(netData.upload) || 0

  const data = cpuData.map((cpu, idx) => ({
    time: cpuData.length - idx,
    cpu,
    memory: memData[idx] ?? 0,
    download,
    upload,
  }))

  if (!hasEnoughData) {
    return (
      <div className='metrics_graph_loader fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground z-50'>
        <Loader className='animate-spin w-12 h-12 text-primary mb-8' />
        <div className='w-[200px] h-2 bg-muted rounded overflow-hidden mb-2'>
          <div
            className='h-full transition-[width] duration-700 ease-out will-change-[width] bg-primary dark:bg-white'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-sm text-muted-foreground'>Loading system metrics…</p>
      </div>
    )
  }

  return (
    <div className='p-6 bg-background text-foreground min-h-screen'>
      <div className='mb-10'>
        <h1 className='text-3xl font-semibold mb-6'>System Metrics Overview</h1>
        <p className='mb-8 text-muted-foreground max-w-xl leading-relaxed'>
          Quickly understand your system&apos;s performance with these key metrics. Each graph below tracks real-time
          data to help you monitor CPU, memory, and network activity.
        </p>

        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
            <XAxis dataKey='time' label={{ value: 'Seconds ago', position: 'insideBottomRight', offset: -10 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
            />
            <Legend verticalAlign='top' height={36} />
            <Line type='monotone' dataKey='cpu' stroke={getColorVar('--chart-1')} dot={false} name='CPU %' />
            <Line type='monotone' dataKey='memory' stroke={getColorVar('--chart-2')} dot={false} name='Memory %' />
            <Line
              type='monotone'
              dataKey='download'
              stroke={getColorVar('--chart-3')}
              dot={false}
              name='Download Speed (KB/s)'
            />
            <Line
              type='monotone'
              dataKey='upload'
              stroke={getColorVar('--chart-4')}
              dot={false}
              name='Upload Speed (KB/s)'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='metrics_graph_cards grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* CPU */}
        <div className='metrics_graph_card p-6 border border-border rounded-xl bg-card text-foreground'>
          <div className='flex items-start gap-5 mb-4'>
            <div className='icon_container flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--chart-1)/0.1)] text-[hsl(var(--chart-1))]'>
              <Cpu size={24} style={{ color: getColorVar('--chart-1') }} />
            </div>
            <div>
              <h4 className='font-semibold text-xl mb-1'>CPU Usage</h4>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Shows the percentage of your processor currently in use. Higher values mean your CPU is working harder.
              </p>
            </div>
          </div>
          <SingleLineGraph
            data={data}
            dataKey='cpu'
            stroke={getColorVar('--chart-1')}
            name='CPU %'
            yAxisLabel='CPU %'
          />
        </div>

        {/* Memory */}
        <div className='metrics_graph_card p-6 border border-border rounded-xl bg-card text-foreground'>
          <div className='flex items-start gap-5 mb-4'>
            <div className='icon_container flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--chart-2)/0.1)] text-[hsl(var(--chart-2))]'>
              <MemoryStick size={24} style={{ color: getColorVar('--chart-2') }} />
            </div>
            <div>
              <h4 className='font-semibold text-xl mb-1'>Memory Usage</h4>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Indicates the percentage of RAM your system is using. Balanced memory use ensures smooth app
                performance.
              </p>
            </div>
          </div>
          <SingleLineGraph
            data={data}
            dataKey='memory'
            stroke={getColorVar('--chart-2')}
            name='Memory %'
            yAxisLabel='Memory %'
          />
        </div>

        {/* Download */}
        <div className='metrics_graph_card p-6 border border-border rounded-xl bg-card text-foreground'>
          <div className='flex items-start gap-5 mb-4'>
            <div className='icon_container flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--chart-3)/0.1)] text-[hsl(var(--chart-3))]'>
              <Download size={24} style={{ color: getColorVar('--chart-3') }} />
            </div>
            <div>
              <h4 className='font-semibold text-xl mb-1'>Download Speed</h4>
              <p className='text-muted-foreground text-base leading-relaxed'>
                The rate at which your system receives data from the network, measured in kilobytes per second (KB/s).
              </p>
            </div>
          </div>
          <SingleLineGraph
            data={data}
            dataKey='download'
            stroke={getColorVar('--chart-3')}
            name='Download'
            yAxisLabel='KB/s'
          />
        </div>

        {/* Upload */}
        <div className='metrics_graph_card p-6 border border-border rounded-xl bg-card text-foreground'>
          <div className='flex items-start gap-5 mb-4'>
            <div className='icon_container flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--chart-4)/0.1)] text-[hsl(var(--chart-4))]'>
              <Upload size={24} style={{ color: getColorVar('--chart-4') }} />
            </div>
            <div>
              <h4 className='font-semibold text-xl mb-1'>Upload Speed</h4>
              <p className='text-muted-foreground text-base leading-relaxed'>
                The rate your system sends data out to the network, measured in kilobytes per second (KB/s).
              </p>
            </div>
          </div>
          <SingleLineGraph
            data={data}
            dataKey='upload'
            stroke={getColorVar('--chart-4')}
            name='Upload'
            yAxisLabel='KB/s'
          />
        </div>
      </div>
    </div>
  )
}
