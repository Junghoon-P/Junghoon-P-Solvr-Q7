import { ResponsiveContainer } from 'recharts'

interface ChartContainerProps {
  title: string
  children: React.ReactElement
  className?: string
  height?: number
}

export const ChartContainer = ({
  title,
  children,
  className = '',
  height = 300
}: ChartContainerProps) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </div>
)
