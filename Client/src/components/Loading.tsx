import { Loader2Icon } from "lucide-react"


const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center 
    bg-gray-50 dark:bg-gray-900">
        <Loader2Icon className="h-8 w-7 animate-spin text-green-400" />
    </div>
  )
}

export default Loading