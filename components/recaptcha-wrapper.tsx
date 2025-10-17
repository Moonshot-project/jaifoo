"use client"

import ReCAPTCHA from "react-google-recaptcha"
import { forwardRef } from "react"

interface RecaptchaWrapperProps {
  onChange: (token: string | null) => void
  onExpired?: () => void
  onErrored?: () => void
}

const RecaptchaWrapper = forwardRef<ReCAPTCHA, RecaptchaWrapperProps>(
  ({ onChange, onExpired, onErrored }, ref) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set in environment variables")
      return null
    }

    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        onChange={onChange}
        onExpired={onExpired}
        onErrored={onErrored}
        size="normal"
        theme="light"
      />
    )
  }
)

RecaptchaWrapper.displayName = "RecaptchaWrapper"

export default RecaptchaWrapper
