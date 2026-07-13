import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

function getQuarterKey(date: Date) {
  const quarter = Math.floor(date.getMonth() / 3) + 1
  return `${date.getFullYear()}-Q${quarter}`
}

function getQuarterStart(date: Date) {
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3
  return new Date(date.getFullYear(), quarterStartMonth, 1)
}

export function getQuarterlyPostCounts() {
  const posts = getBlogPosts()
  const now = new Date()

  if (posts.length === 0) {
    return []
  }

  const dates = posts.map((post) => {
    const publishedAt = post.metadata.publishedAt
    return new Date(
      publishedAt.includes('T') ? publishedAt : `${publishedAt}T00:00:00`,
    )
  })

  const oldest = dates.reduce((min, date) => (date < min ? date : min))
  const start = getQuarterStart(oldest)
  const buckets: { key: string; label: string; count: number }[] = []

  const cursor = new Date(start)
  while (cursor <= now) {
    const quarter = Math.floor(cursor.getMonth() / 3) + 1
    const key = `${cursor.getFullYear()}-Q${quarter}`
    buckets.push({
      key,
      label: `Q${quarter} '${String(cursor.getFullYear()).slice(2)}`,
      count: 0,
    })
    cursor.setMonth(cursor.getMonth() + 3)
  }

  for (const post of posts) {
    const publishedAt = post.metadata.publishedAt
    const date = new Date(
      publishedAt.includes('T') ? publishedAt : `${publishedAt}T00:00:00`,
    )
    const key = getQuarterKey(date)
    const bucket = buckets.find((b) => b.key === key)
    if (bucket) {
      bucket.count++
    }
  }

  return buckets
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
