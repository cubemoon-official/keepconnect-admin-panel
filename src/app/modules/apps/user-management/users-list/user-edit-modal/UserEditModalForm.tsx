import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



// Type for the User
type User = {
  id?: number
  name: string
  email: string
  phone?: string
  business_name?: string
  role?: string
  password?: string
}

// Props
type Props = {
  user?: User
  isUserLoading?: boolean
  onSubmit: (values: User) => void
  onCancel: () => void
}

const UserEditModalForm: FC<Props> = ({ user, isUserLoading = false, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = import.meta.env.VITE_APP_API_URL || 'https://keepconnect.cubemoons.com'
  const token = localStorage.getItem('auth_token')

  const formik = useFormik({
    initialValues: user
      ? {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        business_name: user.business_name || '',
        role: user.role || '',
      }
      : {
        name: '',
        email: '',
        phone: '',
        business_name: '',
        role: '',
        password: '',
      },

    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).required('Name is required'),
      email: Yup.string().email().required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      business_name: Yup.string().required('Business name is required'),
      role: Yup.string().required('Role is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true)

      try {
        const res = user
          ? await axios.put(`${API_URL}/api/admin/users/${user.id}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          : await axios.post(`${API_URL}/api/admin/users`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })

        // ✅ STRICT SUCCESS CHECK
        if (!res?.data?.user) {
          toast.error('User not created. Server error.')
          return
        }

        // ✅ SUCCESS TOAST
        toast.success(user ? 'User updated successfully!' : 'User created successfully!')

        onSubmit(res.data.user)
      } catch (error: any) {
        console.error('API error:', error.response?.data)

        if (error.response?.status === 422) {
          // ✅ Mark all form fields as touched without showing backend messages
          Object.keys(formik.values).forEach((field) => {
            formik.setFieldTouched(field as keyof User, true, false)
            formik.setFieldError(field as keyof User, '') // No backend error text
          })

          // 🔔 Show your custom message
          toast.error('Invalid user data. User was not created.')
          return
        }
        // 🔴 Backend message
        else if (error.response?.data?.message) {
        }
        // 🔴 Unknown error
        else {
          toast.error('Something went wrong. Please try again.')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 rounded-3 shadow-sm">

          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">User Information</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="modal-body">

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.name && formik.errors.name,
                  })}
                  placeholder="Enter name"
                  {...formik.getFieldProps('name')}
                />
              </div>

              {/* Business Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Business Name</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.business_name && formik.errors.business_name,
                  })}
                  placeholder="Enter business name"
                  {...formik.getFieldProps('business_name')}
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.role && formik.errors.role,
                  })}
                  {...formik.getFieldProps('role')}
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="invalid-feedback">{formik.errors.role}</div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.phone && formik.errors.phone,
                  })}
                  placeholder="Enter phone"
                  {...formik.getFieldProps('phone')}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.email && formik.errors.email,
                  })}
                  placeholder="Enter email"
                  {...formik.getFieldProps('email')}
                />
              </div>

              {/* Password - only when creating */}
              {!user && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className={clsx('form-control', {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    })}
                    placeholder="Enter password"
                    {...formik.getFieldProps('password')}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-center">
              <button type="button" className="btn btn-light" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={!formik.isValid || isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </div>
    </div>

  )
}

export { UserEditModalForm }
