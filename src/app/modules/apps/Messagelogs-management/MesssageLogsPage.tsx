import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'

type MediumType = 'all' | 'sms' | 'whatsapp'

interface User {
  id: string
  name: string
  email: string
}

interface MessageLog {
  id: number
  user_id: number | null
  from_phone: string
  to_phone: string
  message: string
  medium: 'sms' | 'whatsapp'
  created_at: string
  user?: User | null
}

const PAGE_SIZE = 10

const MessageLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<MessageLog[]>([])
  const [loading, setLoading] = useState(false)

  const [medium, setMedium] = useState<MediumType>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const TOKEN = localStorage.getItem('auth_token')

  const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      Authorization: TOKEN ? `Bearer ${TOKEN}` : undefined,
    },
  })

  /* ================= FETCH LOGS ================= */
  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get('/text-logs/messages')
      setLogs(response.data.data)
      setPage(1)
    } catch (error) {
      console.error('Fetch logs failed', error)
    } finally {
      setLoading(false)
    }
  }

  /* ================= FRONTEND FILTER ================= */
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filter by medium
      if (medium !== 'all' && log.medium.toLowerCase() !== medium) return false

      // Filter by search
      if (search.trim()) {
        const term = search.trim().toLowerCase()
        const matchesMessage = log.message.toLowerCase().includes(term)
        const matchesFrom = log.from_phone.includes(term)
        const matchesTo = log.to_phone.includes(term)
        return matchesMessage || matchesFrom || matchesTo
      }

      return true
    })
  }, [logs, medium, search])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE)

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, page])

  /* ================= DELETE ================= */
  const deleteLog = async (id: number) => {
    if (!window.confirm('Delete this log?')) return
    try {
      await axiosClient.delete(`/text-logs/${id}`)
      setLogs(prev => prev.filter(log => log.id !== id))
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  return (
    <div className="container-fluid mt-10" style={{ maxWidth: '95%' }}>
      <div className='d-flex align-items-center justify-content-start mb-5'>
        <h1 className='fw-bold text-white ms-3 mb-6 mt-10' style={{ fontSize: '1.3rem' }}>
          Message Logs Management
        </h1>
      </div>

      <div className="card">
        {/* ================= HEADER ================= */}
        <div className="card-header border-0 align-items-center">
          <h3 className="card-title"  style={{ color: "#dd4949ff" }}>Message Logs</h3>

          <div className="card-toolbar d-flex align-items-center justify-content-between">
            {/* ================= TAB FILTER ================= */}
            <div className="d-flex gap-2 text-muted`">
              {(['all', 'sms', 'whatsapp'] as MediumType[]).map(tab => (
                <button
                  key={tab}
                  className={clsx(
                    'btn btn-sm rounded-pill fw-semibold',
                    medium === tab
                      ? 'text-white shadow-sm'
                      : 'bg-light text-dark'
                  )}
                  style={
                    medium === tab
                      ? { backgroundColor: '#e05f5fff' }
                      : undefined
                  }
                  onClick={() => setMedium(tab)}
                >
                  {tab.toUpperCase()}
                </button>

              ))}
            </div>

            {/* ================= SEARCH ================= */}
            <input
              type="text"
              className="form-control form-control-sm py-3"
              placeholder="Search message / phone"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '150px',marginLeft:'10px' }}
            />
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="card-body">
          {loading ? (
            <div className="text-center py-10">
              <span className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle text-nowrap">
                  <thead>
                    <tr className="text-muted text-uppercase fs-7 border-bottom">
                      <th>S.no</th>
                      <th>User</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Message</th>
                      <th className="text-center">Medium</th>
                      <th>Sent At</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedLogs.length ? (
                      paginatedLogs.map((log, index) => (
                        <tr key={log.id} className="fw-semibold">
                          <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                          <td>
                            {log.user ? (
                              <>
                                <div className="fw-semibold">{log.user.name}</div>
                                <div className="text-muted fs-7">{log.user.email}</div>
                              </>
                            ) : (
                              <span className="text-muted">System</span>
                            )}
                          </td>
                          <td>{log.from_phone}</td>
                          <td>{log.to_phone}</td>
                          <td>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: 220 }}
                              title={log.message}
                            >
                              {log.message}
                            </div>
                          </td>
                          <td className="text-center">
                            <span
                              className={clsx(
                                'badge',
                                log.medium === 'sms'
                                  ? 'badge-light-primary'
                                  : 'badge-light-success'
                              )}
                            >
                              {log.medium.toUpperCase()}
                            </span>
                          </td>
                          <td>{new Date(log.created_at).toLocaleString()}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-light-danger"
                              onClick={() => deleteLog(log.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-6">
                          No logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ================= PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-5 gap-2">
                  <button
                    className="btn btn-sm btn-light"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Prev
                  </button>

                  <span className="btn btn-sm btn-light-primary">
                    {page} / {totalPages}
                  </span>

                  <button
                    className="btn btn-sm btn-light"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageLogsPage
