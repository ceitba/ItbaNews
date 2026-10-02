import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { canAccessAdmin, getSession } from '../../store/authStore'

// The API now sets the HttpOnly session cookie before redirecting back here
// (no token in the URL). We just refresh the profile and route based on role.
export default function AdminCallbackPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const error = params.get('error')
    if (error) {
      navigate(`/admin/login?error=${encodeURIComponent(error)}`, { replace: true })
      return
    }
    getSession({ force: true }).then((profile) => {
      if (!profile) {
        navigate('/admin/login', { replace: true })
        return
      }
      navigate(canAccessAdmin(profile) ? '/admin/articles' : '/contribute', { replace: true })
    })
  }, [navigate, params])

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center">
      <p className="text-white font-mono text-label uppercase tracking-widest">
        Verificando sesión…
      </p>
    </div>
  )
}
