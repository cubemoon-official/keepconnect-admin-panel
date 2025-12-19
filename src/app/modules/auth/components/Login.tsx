import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { getUserByToken, login } from '../core/_requests'
import { useAuth } from '../core/Auth'

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Wrong email format')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
  setLoading(true);

  try {
    const authResponse = await toast.promise(
      (async () => {
        // 1️⃣ Login first
        const loginRes = await login(values.email, values.password);
        saveAuth(loginRes.data);

        // 2️⃣ Fetch user using token
        const { data: user } = await getUserByToken(loginRes.data.token);
        setCurrentUser(user);

        return loginRes; // resolves the toast.promise
      })(),
      {
        pending: 'Logging in...',
        success: {
          render: 'Login successful',
          autoClose: 14000, // stays longer
        },
        error: {
          render: 'Invalid login details',
          autoClose: 3000,
        },
      }
    );

    // ⏳ redirect AFTER toast duration
    setTimeout(() => {
      navigate('/dashboard');
    }, 8000);
  } catch (error) {
    saveAuth(undefined);
    setSubmitting(false);
    setLoading(false);
  }
}
  });


  return (
    <>
      {/* 🔔 Toast Container (SINGLE PAGE) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <form
        className="form w-100"
        onSubmit={formik.handleSubmit}
        noValidate
        id="kt_login_signin_form"
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        </div>

        {/* Email */}
        <div className="fv-row mb-8">
          <label className="form-label fs-6 fw-bolder text-gray-900">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.email && formik.errors.email },
              { 'is-valid': formik.touched.email && !formik.errors.email }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="fv-plugins-message-container">
              <span role="alert">{formik.errors.email}</span>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="fv-row mb-3">
          <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.password && formik.errors.password },
              { 'is-valid': formik.touched.password && !formik.errors.password }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="fv-plugins-message-container">
              <span role="alert">{formik.errors.password}</span>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="d-grid mb-10">
          <button
            type="submit"
            className="btn fw-bold text-white"
            style={{ backgroundColor: '#E65454', border: 'none' }}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span>Continue</span>}
            {loading && (
              <span>
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
