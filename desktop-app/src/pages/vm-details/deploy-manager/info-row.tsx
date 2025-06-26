function InfoRow({
  title,
  value,
  isBadge = false,
  isLink = false,
}: {
  title: string
  value: string | number
  isBadge?: boolean
  isLink?: boolean
}) {
  const displayText =
    isLink && typeof value === 'string' && value.startsWith('https://github.com/')
      ? value.replace('https://', '')
      : value

  const handleOpenExternal = () => {
    if (typeof value === 'string') {
      window.electronAPI?.openExternal?.(value)
    }
  }

  return (
    <div>
      <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
      {isBadge ? (
        <p className='text-sm inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-800 capitalize'>
          {value}
        </p>
      ) : isLink && typeof value === 'string' ? (
        <button
          onClick={handleOpenExternal}
          className='text-sm break-all underline text-blue-600 cursor-pointer p-0 m-0 bg-transparent border-none text-left'>
          {displayText}
        </button>
      ) : (
        <p className='text-base'>{value}</p>
      )}
    </div>
  )
}

export default InfoRow
