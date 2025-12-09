import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'

// Type for the User
type User = {
  id?: number
  name: string
  email: string
  position?: string
  phone?: string
}

// Props
type Props = {
  user?: User
  isUserLoading?: boolean
  onSubmit: (values: User) => void
  onCancel: () => void
}

// Validation Schema
const editUserSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols').required('Name is required'),
  email: Yup.string().email('Wrong email format').required('Email is required'),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading = false, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: user || { name: '', email: '', position: '', phone: '' },
    validationSchema: editUserSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      await new Promise((r) => setTimeout(r, 800)) // simulate API delay
      onSubmit(values)
      setIsSubmitting(false)
    },
  })

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 rounded-3 shadow-sm">
          {/* Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">User Information</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="modal-body">
              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.name && formik.errors.name,
                    'is-valid': formik.touched.name && !formik.errors.name,
                  })}
                  placeholder="Enter full name"
                  {...formik.getFieldProps('name')}
                  disabled={isSubmitting || isUserLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              {/* Business Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Business Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter business name"
                  {...formik.getFieldProps('position')}
                  disabled={isSubmitting || isUserLoading}
                />
              </div>

              {/* Phone & Email */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone number"
                    {...formik.getFieldProps('phone')}
                    disabled={isSubmitting || isUserLoading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className={clsx('form-control', {
                      'is-invalid': formik.touched.email && formik.errors.email,
                      'is-valid': formik.touched.email && !formik.errors.email,
                    })}
                    placeholder="Enter email"
                    {...formik.getFieldProps('email')}
                    disabled={isSubmitting || isUserLoading}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-light"
                onClick={onCancel}
                disabled={isSubmitting || isUserLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isUserLoading || !formik.isValid}
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

export { UserEditModalForm }
