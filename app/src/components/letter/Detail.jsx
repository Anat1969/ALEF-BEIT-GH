export default function Detail({ label, value }) {
  if (!value) return null
  return (
    <p className="text-sm">
      <span className="text-text-tertiary dark:text-gray-500 font-medium">{label}:</span>{' '}
      <span className="text-text-secondary dark:text-gray-400">{value}</span>
    </p>
  )
}
