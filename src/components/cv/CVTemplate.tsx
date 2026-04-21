import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'

// You would typically register fonts here to ensure ATS compatibility and nice looks
// Font.register({ family: 'Inter', src: '...' })

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica', // Fallback, use registered font in production
    fontSize: 11,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #eee',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  contact: {
    flexDirection: 'row',
    fontSize: 10,
    color: '#666',
    gap: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  project: {
    marginBottom: 10,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  projectLink: {
    fontSize: 10,
    color: '#0066cc',
    textDecoration: 'none',
  },
  projectDesc: {
    fontSize: 10,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillBadge: {
    backgroundColor: '#eee',
    padding: '3 6',
    borderRadius: 3,
    fontSize: 9,
  }
})

type CVData = {
  name: string
  title: string
  email: string
  github: string
  projects: { name: string, description_override?: string, live_url?: string }[]
  skills: string[]
}

export function CVDocument({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={{ fontSize: 14, marginBottom: 5, color: '#444' }}>{data.title}</Text>
          <View style={styles.contact}>
            <Text>{data.email}</Text>
            <Text>•</Text>
            <Link src={`https://github.com/${data.github}`} style={{ color: '#666', textDecoration: 'none' }}>
              github.com/{data.github}
            </Link>
          </View>
        </View>

        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {data.skills.map((skill: string, i: number) => (
                <Text key={i} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Projects</Text>
          {data.projects.map((project, i) => (
            <View key={i} style={styles.project}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                {project.live_url && (
                  <Link src={project.live_url} style={styles.projectLink}>View Project</Link>
                )}
              </View>
              <Text style={styles.projectDesc}>
                {project.description_override || 'No description available.'}
              </Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  )
}
