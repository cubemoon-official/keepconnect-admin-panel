import { FC, useState } from 'react'
import { PermissionsListLoading } from '../components/loading/PermissionsListLoading'

type Props = {
  isUserLoading: boolean
  userPermissions: string[] // existing permissions of the user
  onSave: (permissions: string[]) => void
  onClose: () => void
}

const PermissionEditModalForm: FC<Props> = ({ userPermissions, isUserLoading, onSave, onClose }) => {
  const [permissions, setPermissions] = useState<string[]>(userPermissions || [])

  const allPermissions = [
    'View Users',
    'Create Users',
    'Edit Users',
    'Delete Users',
    'View Roles',
    'Edit Roles',
    'Manage Permissions',
  ]

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm))
    } else {
      setPermissions([...permissions, perm])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(permissions)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <div className='modal-body'>
          <label className='form-label fw-bold mb-2'>Permissions</label>
          <div className='border rounded-3 p-3' style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {allPermissions.map((perm) => (
              <div key={perm} className='form-check mb-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={perm}
                  checked={permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                  disabled={isUserLoading}
                />
                <label className='form-check-label' htmlFor={perm}>
                  {perm}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className='modal-footer border-0'>
          <button
            type='button'
            className='btn btn-light'
            onClick={onClose}
            disabled={isUserLoading}
          >
            Cancel
          </button>
          <button type='submit' className='btn btn-primary' disabled={isUserLoading}>
            Save
          </button>
        </div>
      </form>

      {isUserLoading && <PermissionsListLoading />}
    </>
  )
}

export { PermissionEditModalForm }
