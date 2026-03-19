import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { SplitSheet } from '../types'

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111',
  },
  header: {
    marginBottom: 24,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    color: '#444',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 4,
  },
  metaItem: {
    fontSize: 9,
    color: '#555',
  },
  metaValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#111',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableFooter: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 2,
  },
  footerLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
  },
  footerValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  col_name: { width: '28%' },
  col_role: { width: '20%' },
  col_pro: { width: '14%' },
  col_ipi: { width: '22%' },
  col_pub_name: { width: '30%' },
  col_pub_ipi: { width: '30%' },
  col_split: { width: '16%', textAlign: 'right' },
  signaturesSection: {
    marginTop: 32,
  },
  signaturesTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
  },
  signatureBlock: {
    marginBottom: 24,
  },
  signatureName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  signatureRole: {
    fontSize: 9,
    color: '#555',
    marginBottom: 12,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginBottom: 4,
    width: '60%',
  },
  signatureLineLabel: {
    fontSize: 8,
    color: '#aaa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
})

interface Props {
  data: SplitSheet
  sections: string[]
}

export default function SplitSheetPDF({ data, sections }: Props) {
  const { song, totals, validation } = data
  const collabList = data.collaborators ?? []
  const allValid = validation.writer_valid_100 && validation.publisher_valid_100 && validation.master_valid_100

  const show = {
    writer: sections.includes('writer'),
    publishing: sections.includes('publishing'),
    master: sections.includes('master'),
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.label}>Split Sheet</Text>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist_name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Genre: <Text style={styles.metaValue}>{song.genre}</Text></Text>
            <Text style={styles.metaItem}>BPM: <Text style={styles.metaValue}>{song.bpm}</Text></Text>
            <Text style={styles.metaItem}>Key: <Text style={styles.metaValue}>{song.song_key}</Text></Text>
            <Text style={styles.metaItem}>Date Written: <Text style={styles.metaValue}>{song.date_written ? new Date(song.date_written).toLocaleDateString() : '—'}</Text></Text>
            <Text style={styles.metaItem}>
              Status: <Text style={{ ...styles.metaValue, color: allValid ? '#16a34a' : '#dc2626' }}>
                {allValid ? 'Splits Verified' : 'Splits Invalid'}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Writer Share */}
        {show.writer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Writer Share</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col_name]}>Name</Text>
              <Text style={[styles.tableHeaderCell, styles.col_role]}>Role</Text>
              <Text style={[styles.tableHeaderCell, styles.col_pro]}>PRO</Text>
              <Text style={[styles.tableHeaderCell, styles.col_ipi]}>IPI Number</Text>
              <Text style={[styles.tableHeaderCell, styles.col_split]}>Writer %</Text>
            </View>
            {collabList.map((collab) => (
              <View key={collab.id} style={styles.tableRow}>
                <Text style={styles.col_name}>{collab.name}</Text>
                <Text style={styles.col_role}>{collab.role}</Text>
                <Text style={styles.col_pro}>{collab.pro}</Text>
                <Text style={styles.col_ipi}>{collab.ipi_number}</Text>
                <Text style={styles.col_split}>{collab.writer_split}%</Text>
              </View>
            ))}
            <View style={styles.tableFooter}>
              <Text style={[styles.footerLabel, { width: '84%' }]}>Total</Text>
              <Text style={[styles.footerValue, styles.col_split]}>{totals.writer_total}%</Text>
            </View>
          </View>
        )}

        {show.writer && (show.publishing || show.master) && <View style={styles.divider} />}

        {/* Publishing Share */}
        {show.publishing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publishing Share</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col_name]}>Collaborator</Text>
              <Text style={[styles.tableHeaderCell, styles.col_pub_name]}>Publisher Name</Text>
              <Text style={[styles.tableHeaderCell, styles.col_pub_ipi]}>Publisher IPI</Text>
              <Text style={[styles.tableHeaderCell, styles.col_split]}>Publisher %</Text>
            </View>
            {collabList.map((collab) => (
              <View key={collab.id} style={styles.tableRow}>
                <Text style={styles.col_name}>{collab.name}</Text>
                <Text style={styles.col_pub_name}>{collab.publisher_name || '—'}</Text>
                <Text style={styles.col_pub_ipi}>{collab.publisher_ipi || '—'}</Text>
                <Text style={styles.col_split}>{collab.publisher_split}%</Text>
              </View>
            ))}
            <View style={styles.tableFooter}>
              <Text style={[styles.footerLabel, { width: '84%' }]}>Total</Text>
              <Text style={[styles.footerValue, styles.col_split]}>{totals.publisher_total}%</Text>
            </View>
          </View>
        )}

        {show.publishing && show.master && <View style={styles.divider} />}

        {/* Master Share */}
        {show.master && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Master Share</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col_name]}>Name</Text>
              <Text style={[styles.tableHeaderCell, styles.col_role]}>Role</Text>
              <Text style={[styles.tableHeaderCell, { width: '40%' }]}></Text>
              <Text style={[styles.tableHeaderCell, styles.col_split]}>Master %</Text>
            </View>
            {collabList.map((collab) => (
              <View key={collab.id} style={styles.tableRow}>
                <Text style={styles.col_name}>{collab.name}</Text>
                <Text style={styles.col_role}>{collab.role}</Text>
                <Text style={{ width: '40%' }}></Text>
                <Text style={styles.col_split}>{collab.master_split}%</Text>
              </View>
            ))}
            <View style={styles.tableFooter}>
              <Text style={[styles.footerLabel, { width: '84%' }]}>Total</Text>
              <Text style={[styles.footerValue, styles.col_split]}>{totals.master_total}%</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Signature Blocks */}
        {collabList.length > 0 && (
          <View style={styles.signaturesSection}>
            <Text style={styles.signaturesTitle}>Signatures</Text>
            {collabList.map((collab) => (
              <View key={collab.id} style={styles.signatureBlock}>
                <Text style={styles.signatureName}>{collab.name}</Text>
                <Text style={styles.signatureRole}>{collab.role}</Text>
                {collab.publisher_name ? (
                  <Text style={{ fontSize: 9, color: '#555', marginBottom: 12 }}>
                    Publisher: {collab.publisher_name}{collab.publisher_ipi ? ` · IPI: ${collab.publisher_ipi}` : ''}
                  </Text>
                ) : null}
                <View style={styles.signatureLine} />
                <View style={styles.signatureLineLabel}>
                  <Text>Signature</Text>
                  <Text>Date</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  )
}
