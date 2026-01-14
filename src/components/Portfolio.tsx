import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Github, Instagram, MapPin, Youtube } from 'lucide-react'
import { fetchGitHubRepos, fetchGitHubUser } from '../services/github'
import { GitHubRepo } from '../types/github'
import './Portfolio.css'
import './Websites.css'

type Theme = {
  name: string
  primary: string
  primaryLight: string
  secondary: string
  background: string
  cardBg: string
  text: string
  textSecondary: string
}

const theme: Theme = {
  name: 'Nature',
  primary: '#81B29A',
  primaryLight: '#A8D5BA',
  secondary: '#F4A261',
  background: '#F5F5F0',
  cardBg: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
}

// Website projects data with GitHub repos
const websites = [
  { name: 'Portfolio', mainDomain: 'darkphoton.in', secondaryDomain: 'astralquarks.pages.dev', description: 'Personal portfolio and projects', github: 'editinghero.github.io' },
  { name: 'AI Web', mainDomain: 'ai.darkphoton.in', secondaryDomain: 'aiwebx.pages.dev', description: 'AI-powered web tools and utilities', github: 'aiwebx' },
  { name: 'Aqua Pro', mainDomain: 'aqua.darkphoton.in', secondaryDomain: 'aquapro.pages.dev', description: 'Water quality monitoring and analysis', github: 'aquapro' },
  { name: 'Choice Wheel', mainDomain: 'choice.darkphoton.in', secondaryDomain: 'choicewheel.pages.dev', description: 'Decision making tool with spinning wheel', github: 'choicewheel' },
  { name: 'Palette Pro', mainDomain: 'colours.darkphoton.in', secondaryDomain: 'palettepro.pages.dev', description: 'Color palette generator and manager', github: 'palettepro' },
  { name: 'Enco Link', mainDomain: 'encrypt.darkphoton.in', secondaryDomain: 'encolink.pages.dev', description: 'Secure link encryption service', github: 'encolink' },
  { name: 'Force Fitness', mainDomain: 'gym.darkphoton.in', secondaryDomain: 'forcefitness.pages.dev', description: 'Fitness tracking and workout planner', github: 'forcefitness' },
  { name: 'Icon Gen', mainDomain: 'icon.darkphoton.in', secondaryDomain: 'icon.pages.dev', description: 'Custom icon generator and editor', github: 'icon' },
  { name: 'Image Sizer', mainDomain: 'img.darkphoton.in', secondaryDomain: 'imagesizer.pages.dev', description: 'Batch image resizing tool', github: 'imagesizer' },
  { name: 'Astral PDF', mainDomain: 'pdf.darkphoton.in', secondaryDomain: 'astralpdf.pages.dev', description: 'PDF tools and converter', github: 'astralpdf' },
  { name: 'Glass Play', mainDomain: 'play.darkphoton.in', secondaryDomain: 'glassplay.pages.dev', description: 'Interactive glassmorphism playground', github: 'glassplay' },
  { name: 'STD Flow', mainDomain: 'std.darkphoton.in', secondaryDomain: 'stdflow.pages.dev', description: 'Student workflow management', github: 'stdflow' },
]

export default function Portfolio() {
  const userQuery = useQuery({
    queryKey: ['github-user'],
    queryFn: fetchGitHubUser,
  })

  const reposQuery = useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchGitHubRepos,
    enabled: !!userQuery.data,
  })

  const user = userQuery.data
  const repos = reposQuery.data || []

  return (
    <div className="portfolio" style={{ background: theme.background }}>
      <div className="portfolio-container">
        {userQuery.isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{ color: theme.text }}>Loading portfolio...</p>
          </div>
        )}

        {userQuery.isError && !userQuery.isLoading && (
          <div className="error-container" style={{ background: theme.cardBg }}>
            <h2 style={{ color: theme.text }}>Unable to Load Portfolio</h2>
            <p style={{ color: theme.textSecondary }}>
              {userQuery.error?.message || 'Please check your internet connection and try again.'}
            </p>
            <button
              className="retry-button"
              style={{ background: theme.primary, color: '#fff' }}
              onClick={() => userQuery.refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {user && !userQuery.isLoading && (
          <>
            <ProfileHeader user={user} theme={theme} />
            <StatsRow user={user} theme={theme} />
            <SocialLinks theme={theme} />
            <WebsitesSection theme={theme} />
            <ProjectsSection repos={repos} isLoading={reposQuery.isLoading} theme={theme} />
          </>
        )}
      </div>
    </div>
  )
}

function WebsitesSection({ theme }: { theme: Theme }) {
  return (
    <div className="websites-section">
      <h2>My Websites</h2>
      <div className="websites-grid">
        {websites.map((site, index) => (
          <WebsiteCard key={site.name} site={site} theme={theme} index={index} />
        ))}
      </div>
    </div>
  )
}

function WebsiteCard({ site, theme, index }: { site: typeof websites[0]; theme: Theme; index: number }) {
  const mainUrl = `https://${site.mainDomain}`
  const secondaryUrl = `https://${site.secondaryDomain}`
  const githubUrl = `https://github.com/editinghero/${site.github}`

  return (
    <div
      className={`website-card card-${index % 3}`}
      style={{ background: theme.cardBg }}
    >
      <h3>{site.name}</h3>
      <p className="website-description" style={{ color: '#666' }}>
        {site.description}
      </p>
      <div className="website-links">
        <a
          href={mainUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="website-link primary"
          style={{ background: theme.primary, color: '#fff' }}
        >
          <ExternalLink size={16} />
          <span>Visit Website</span>
        </a>
        <a
          href={secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="website-link secondary"
          style={{ color: '#000', borderColor: theme.primary }}
        >
          <ExternalLink size={16} />
          <span>Alternative</span>
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="website-link secondary"
          style={{ color: '#000', borderColor: theme.primary }}
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  )
}

function ProfileHeader({ user, theme }: { user: any; theme: Theme }) {
  const bioText = user.bio ? `Currently studying. ${user.bio}` : 'Currently studying.'

  return (
    <div className="profile-header" style={{ background: theme.cardBg }}>
      <div className="avatar-container">
        <img src={user.avatar_url} alt={user.name} className="avatar" />
        <div className="avatar-glow" style={{ background: theme.primary }} />
      </div>

      <h1>{user.name || user.login}</h1>
      <p className="username" style={{ color: '#666' }}>
        @{user.login}
      </p>

      <p className="bio" style={{ color: '#666' }}>
        {bioText}
      </p>

      {user.location && (
        <div className="location-container">
          <MapPin size={16} color="#666" />
          <span style={{ color: '#666' }}>{user.location}</span>
        </div>
      )}
    </div>
  )
}

function StatsRow({ user, theme }: { user: any; theme: Theme }) {
  return (
    <div className="stats-row" style={{ background: theme.cardBg }}>
      <div className="stat-item">
        <div className="stat-value">
          {user.public_repos}
        </div>
        <div className="stat-label" style={{ color: '#666' }}>
          Repositories
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-value">
          {user.followers}
        </div>
        <div className="stat-label" style={{ color: '#666' }}>
          Followers
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-value">
          {user.following}
        </div>
        <div className="stat-label" style={{ color: '#666' }}>
          Following
        </div>
      </div>
    </div>
  )
}

function SocialLinks({ theme }: { theme: Theme }) {
  const handlePress = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="social-section">
      <h2>Let's connect</h2>
      <div className="social-links">
        <button
          className="social-button"
          style={{ background: theme.cardBg, color: '#000' }}
          onClick={() => handlePress('https://github.com/editinghero')}
        >
          <Github size={20} color="#000" />
          <span>GitHub</span>
        </button>
        <button
          className="social-button"
          style={{ background: theme.cardBg, color: '#000' }}
          onClick={() => handlePress('https://www.instagram.com/astralquarks')}
        >
          <Instagram size={20} color="#000" />
          <span>Instagram</span>
        </button>
        <button
          className="social-button"
          style={{ background: theme.cardBg, color: '#000' }}
          onClick={() => handlePress('https://youtube.com/@astralquark')}
        >
          <Youtube size={20} color="#000" />
          <span>YouTube</span>
        </button>
      </div>
    </div>
  )
}

function ProjectsSection({
  repos,
  isLoading,
  theme,
}: {
  repos: GitHubRepo[]
  isLoading: boolean
  theme: Theme
}) {
  return (
    <div className="projects-section">
      <h2>GitHub Projects</h2>

      {isLoading && (
        <div className="loading-spinner-small"></div>
      )}

      <div className="projects-grid">
        {repos.map((repo) => (
          <ProjectCard key={repo.id} repo={repo} theme={theme} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ repo, theme }: { repo: GitHubRepo; theme: Theme }) {
  const handlePress = () => {
    window.open(repo.html_url, '_blank')
  }

  const enhancedDescription =
    repo.description ||
    `A ${repo.language || 'coding'} project showcasing my development skills.`

  return (
    <div
      className="project-card"
      style={{ background: theme.cardBg }}
      onClick={handlePress}
    >
      <div className="project-header">
        <h3 style={{ color: '#000' }}>{repo.name}</h3>
        <ExternalLink size={18} color="#666" />
      </div>

      <p className="project-description" style={{ color: '#666' }}>
        {enhancedDescription}
      </p>

      <div className="project-footer">
        {repo.language && (
          <div className="language-badge">
            <div
              className="language-dot"
              style={{ background: getLanguageColor(repo.language) }}
            />
            <span style={{ color: '#666' }}>{repo.language}</span>
          </div>
        )}

        {repo.stargazers_count > 0 && (
          <span className="stats-text" style={{ color: '#666' }}>
            ⭐ {repo.stargazers_count}
          </span>
        )}
      </div>
    </div>
  )
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
  }
  return colors[language] || '#8b949e'
}
