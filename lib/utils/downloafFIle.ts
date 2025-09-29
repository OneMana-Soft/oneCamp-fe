export async function downloadFile(href: string, name: string) {
    const res = await fetch(href)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)

    return true
}