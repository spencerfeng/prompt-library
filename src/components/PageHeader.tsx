type Props = {
  title: string
  children?: React.ReactNode
}

export const PageHeader = ({ title, children }: Props) => {
  return (
    <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {children}
    </header>
  )
}
