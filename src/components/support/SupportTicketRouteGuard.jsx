import { Component } from 'react'
import { Link, useLocation } from 'react-router-dom'

class TicketErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidUpdate(previous) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }
  render() {
    if (this.state.error) return <div className="card"><div className="card-body text-center py-5"><i className="fa-solid fa-life-ring fa-2x text-primary mb-3" /><h4>Support tickets could not be displayed</h4><p className="text-muted">The page recovered safely. Return to your ticket list and try again.</p><Link className="btn btn-primary" to="/support-tickets">Back to support tickets</Link></div></div>
    return this.props.children
  }
}

const SupportTicketRouteGuard = ({ children }) => {
  const location = useLocation()
  return <TicketErrorBoundary resetKey={`${location.pathname}-${location.key}`}>{children}</TicketErrorBoundary>
}

export default SupportTicketRouteGuard
