interface ExtracurricularContentProps {
  data: {
    activities: string[]
  }
}

export function ExtracurricularContent({ data }: ExtracurricularContentProps) {
  return (
    <div className="space-y-4">
      {data.activities.map((activity, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{activity}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
