import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PDFViewer } from '@react-pdf/renderer'
import { getSplitSheet } from '../api/splits'
import SplitSheetPDF from '../components/SplitSheetPDF'

export default function SplitSheetPDFPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const songId = Number(id)

  const rawSections = searchParams.get('sections') ?? 'writer,publishing,master'
  const sections = rawSections.split(',').filter(Boolean)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['split-sheet', songId],
    queryFn: () => getSplitSheet(songId),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-gray-400">
      Generating PDF...
    </div>
  )

  if (isError) return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-red-400">
      Failed to load split sheet.
    </div>
  )

  return (
    <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }}>
      <SplitSheetPDF data={data!} sections={sections} />
    </PDFViewer>
  )
}
