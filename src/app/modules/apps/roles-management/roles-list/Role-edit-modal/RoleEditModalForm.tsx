import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'

// 🔹 Validation Schema
const roleSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Role name is required'),
  permissions: Yup.array()
    .min(1, 'Select at least one permission')
    .required('Select at least one permission'),
})

// 🔹 Role type
type Role = {
  id?: number
  name: string
  permissions: string[]
}

// 🔹 Props
type Props = {
  role?: Role
  onClose: () => void
  onSave: (values: Role) => void
}

const RoleEditModalForm: FC<Props> = ({ role, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const allPermissions = [
    'View Users',
    'Create Users',
    'Edit Users',
    'Delete Users',
    'View Roles',
    'Edit Roles',
    'Manage Permissions',
  ]

  const formik = useFormik({
    initialValues: role || { name: '', permissions: [] },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      await new Promise((res) => setTimeout(res, 800)) // simulate API delay
      onSave(values)
      setIsSubmitting(false)
      onClose()
    },
  })

  // Toggle permission selection
  const handlePermissionChange = (perm: string) => {
    const current = formik.values.permissions
    if (current.includes(perm)) {
      formik.setFieldValue(
        'permissions',
        current.filter((p) => p !== perm)
      )
    } else {
      formik.setFieldValue('permissions', [...current, perm])
    }
  }

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 rounded-3 shadow-sm">
          {/* Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">
              {role ? 'Edit Role' : 'Create Role'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="modal-body">
              {/* Role Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Role Name</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.name && formik.errors.name,
                    'is-valid': formik.touched.name && !formik.errors.name,
                  })}
                  placeholder="Enter role name"
                  {...formik.getFieldProps('name')}
                  disabled={isSubmitting}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              {/* Permissions */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Permissions</label>
                <div
                  className={clsx('border rounded-3 p-3', {
                    'border-danger': formik.touched.permissions && formik.errors.permissions,
                  })}
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {allPermissions.map((perm) => (
                    <div
                      key={perm}
                      className="form-check form-check-sm form-check-custom form-check-solid mb-2"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={perm}
                        checked={formik.values.permissions.includes(perm)}
                        onChange={() => handlePermissionChange(perm)}
                        disabled={isSubmitting}
                      />
                      <label
                        className="form-check-label text-gray-700"
                        htmlFor={perm}
                      >
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
                {formik.touched.permissions && formik.errors.permissions && (
                  <div className="invalid-feedback d-block mt-1">
                    {formik.errors.permissions}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !formik.isValid}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export { RoleEditModalForm }
