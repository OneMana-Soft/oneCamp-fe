export async function downloadFile(href: string, name: string) {
    try {
        // Fetch the file
        const res = await fetch(href)
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const blob = await res.blob()
        
        // Create a blob with explicit MIME type to force download
        const downloadBlob = new Blob([blob], { 
            type: 'application/octet-stream' 
        })
        
        const url = URL.createObjectURL(downloadBlob)
        
        // Create download link with all necessary attributes
        const link = document.createElement('a')
        link.href = url
        link.download = name
        link.style.display = 'none'
        
        // Add to DOM and trigger download
        document.body.appendChild(link)
        
        // Use MouseEvent to simulate a more realistic click
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
        
        link.dispatchEvent(event)
        
        // Clean up
        document.body.removeChild(link)
        
        // Delay cleanup to ensure download starts
        setTimeout(() => {
            URL.revokeObjectURL(url)
        }, 1000)
        
        return true
    } catch (error) {
        console.error('Download failed:', error)
        return false
    }
}

// Alternative method for direct URL downloads (no fetch)
export function downloadFileDirect(url: string, filename: string) {
    try {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.style.display = 'none'
        
        document.body.appendChild(link)
        
        // Use MouseEvent for more reliable triggering
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
        
        link.dispatchEvent(event)
        document.body.removeChild(link)
        
        return true
    } catch (error) {
        console.error('Direct download failed:', error)
        return false
    }
}

// Most aggressive download method - forces download by creating a blob
export async function forceDownload(url: string, filename: string) {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        
        // Force the blob to be treated as a download
        const downloadBlob = new Blob([blob], { 
            type: 'application/force-download' 
        })
        
        const blobUrl = URL.createObjectURL(downloadBlob)
        
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        link.style.display = 'none'
        
        document.body.appendChild(link)
        
        // Multiple ways to trigger download
        link.click()
        
        // Also try dispatching a click event
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
        link.dispatchEvent(clickEvent)
        
        document.body.removeChild(link)
        
        // Clean up after a delay
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl)
        }, 2000)
        
        return true
    } catch (error) {
        console.error('Force download failed:', error)
        return false
    }
}