interface props {
  value: number
}

function ColoredPercentage({ value }: props) {
  let color = 'text-green-500'

  if (value >= 80) color = 'text-red-500'
  else if (value >= 60) color = 'text-orange-500'

  return <span className={`text-xs font-medium ${color}`}>{value.toFixed(0)}%</span>
}

export default ColoredPercentage
