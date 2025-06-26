import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

type props = {
  vmId: string
}

function Terminal({ vmId }: props) {
  const terminalElementRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<XTerm | null>(null)

  useEffect(() => {
    const element = terminalElementRef.current!

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    const terminal = new XTerm({
      cursorBlink: true,
      convertEol: true,
      fontSize: 12,
      fontFamily: 'Menlo, courier-new, courier, monospace',
    })

    terminalRef.current = terminal

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.open(element)

    terminal.onData(e => {
      if (e === '\r') {
        window.electronAPI.vmInput(vmId, '\r\n')
      } else {
        window.electronAPI.vmInput(vmId, e)
      }
    })

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
    })

    resizeObserver.observe(element)

    const handleVmOutput = (_: any, data: { id: string, data: string }) => {
      if (data.id === vmId) {
        terminal.write(data.data)
      }
    }

    const wrapper = window.ipcRenderer?.on('vm-output', handleVmOutput)

    return () => {
      resizeObserver.disconnect()
      terminal.dispose()
      if (wrapper) {
        // @ts-ignore
        window.ipcRenderer?.off('vm-output', wrapper)
      }
    }
  }, [vmId])

  return (
    <div className='h-[350px]' ref={terminalElementRef} />
  )
}

export default Terminal