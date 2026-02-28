import { LoaderCircle } from "lucide-react"

export const LoadingStateCircle = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <LoaderCircle className="mr-2 h-12 w-12 animate-spin" />
        </div>
    )
}
