import type React from "react"

interface DocumentViewerProps {
    type: "pdf" | "text" | "image" | "other"
    url?: string
    content?: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ type, url, content }) => {
    if (type === "pdf") {
        return (
            <div className="w-full h-[60vh] md:h-[80vh]">
                <iframe
                    src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full border-0"
                    title="PDF Document"
                    style={{ maxWidth: "100%", overflow: "auto" }}
                />
            </div>
        )
    }

    if (type === "text" && content) {
        return (
            <div className="p-2 md:p-6 max-h-[60vh] md:max-h-[80vh] overflow-auto w-full">
                <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm break-words">{content}</pre>
            </div>
        )
    }

    if (type === "image" && url) {
        return (
            <div className="w-full h-full">
                <img src={url || "/placeholder.svg"} alt="Document" className="max-w-full max-h-full object-contain" />
            </div>
        )
    }

    return (
        <div>
            {type === "other" && <p>Unsupported document type.</p>}
            {!type && <p>No document to display.</p>}
        </div>
    )
}

export default DocumentViewer

