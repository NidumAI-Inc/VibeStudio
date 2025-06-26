export function LiveWave({ size = 12 }: { size?: number }) {
  const ringCount = 2
  const rings = Array.from({ length: ringCount })

  return (
    <div className='relative inline-block' style={{ width: size, height: size }}>
      <span className='absolute inset-0 rounded-full bg-green-400' style={{ transform: 'scale(1)' }} />

      {rings.map((_, i) => (
        <span
          key={i}
          className='absolute inset-0 rounded-full bg-green-400 opacity-50 animate-wave'
          style={{ animationDelay: `${i * 400}ms` }}
        />
      ))}
    </div>
  )
}
