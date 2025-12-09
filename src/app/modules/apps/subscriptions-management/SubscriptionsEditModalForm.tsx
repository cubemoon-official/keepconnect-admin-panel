import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'

// 🔹 Type for Plan
type Plan = {
  id?: number
  name: string
  description: string
  amount: number
  tenure: string
}

// 🔹 Props
type Props = {
  plan?: Plan
  isPlanLoading?: boolean
  onSubmit: (values: Plan) => void
  onCancel: () => void
}

// 🔹 Validation Schema
const editPlanSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Plan name is required'),
  description: Yup.string()
    .min(5, 'Minimum 5 characters')
    .max(200, 'Maximum 200 characters')
    .required('Description is required'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  tenure: Yup.string()
    .required('Tenure is required'),
})

const SubscriptionsEditModalForm: FC<Props> = ({
  plan,
  isPlanLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: plan || {
      name: '',
      description: '',
      amount: 0,
      tenure: '',
    },
    validationSchema: editPlanSchema,
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
          {/* 🔹 Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Plan Details</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

          {/* 🔹 Form */}
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="modal-body">
              {/* 🟢 Plan Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Plan Name</label>
                <input
                  type="text"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.name && formik.errors.name,
                    'is-valid': formik.touched.name && !formik.errors.name,
                  })}
                  placeholder="Enter plan name"
                  {...formik.getFieldProps('name')}
                  disabled={isSubmitting || isPlanLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              {/* 🟢 Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.description && formik.errors.description,
                    'is-valid': formik.touched.description && !formik.errors.description,
                  })}
                  placeholder="Enter description"
                  rows={3}
                  {...formik.getFieldProps('description')}
                  disabled={isSubmitting || isPlanLoading}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">{formik.errors.description}</div>
                )}
              </div>

              {/* 🟢 Amount */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Amount</label>
                <input
                  type="number"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.amount && formik.errors.amount,
                    'is-valid': formik.touched.amount && !formik.errors.amount,
                  })}
                  placeholder="Enter amount"
                  {...formik.getFieldProps('amount')}
                  disabled={isSubmitting || isPlanLoading}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <div className="invalid-feedback">{formik.errors.amount}</div>
                )}
              </div>

              {/* 🟢 Tenure */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Tenure</label>
                <select
                  className={clsx('form-select', {
                    'is-invalid': formik.touched.tenure && formik.errors.tenure,
                    'is-valid': formik.touched.tenure && !formik.errors.tenure,
                  })}
                  {...formik.getFieldProps('tenure')}
                  disabled={isSubmitting || isPlanLoading}
                >
                  <option value="">Select tenure</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                {formik.touched.tenure && formik.errors.tenure && (
                  <div className="invalid-feedback">{formik.errors.tenure}</div>
                )}
              </div>
            </div>

            {/* 🔹 Footer */}
            <div className="modal-footer border-0 d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-light"
                onClick={onCancel}
                disabled={isSubmitting || isPlanLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isPlanLoading || !formik.isValid}
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

export { SubscriptionsEditModalForm }
