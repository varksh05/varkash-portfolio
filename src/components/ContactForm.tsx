import { useEffect, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ContactSchema, sendContactMessage } from '#/server/contact'
import { Icon } from './Icon'

type Status = 'idle' | 'sent' | 'error'

function errorText(errors: Array<unknown>) {
  const first = errors[0]
  if (!first) return null
  return typeof first === 'string' ? first : (first as { message?: string }).message
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  // Spam signals sent with the message: when the form appeared, and a field only bots fill in.
  const openedAt = useRef(0)
  const [trap, setTrap] = useState('')
  useEffect(() => { openedAt.current = Date.now() }, [])

  const form = useForm({
    defaultValues: { name: '', email: '', message: '' },
    validators: { onChange: ContactSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await sendContactMessage({ data: { ...value, website: trap, openedAt: openedAt.current } })
        setStatus('sent')
        formApi.reset()
      } catch {
        setStatus('error')
      }
    },
  })

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setStatus('idle')
        form.handleSubmit()
      }}
    >
      {(['name', 'email', 'message'] as const).map((name) => (
        <form.Field key={name} name={name}>
          {(field) => {
            const err = field.state.meta.isTouched ? errorText(field.state.meta.errors) : null
            const common = {
              id: field.name,
              name: field.name,
              value: field.state.value,
              onBlur: field.handleBlur,
              'aria-invalid': !!err,
              'aria-describedby': err ? `${field.name}-error` : undefined,
            }
            return (
              <div className="field">
                <label htmlFor={field.name}>
                  {name === 'name' ? 'Your name' : name === 'email' ? 'Email' : 'Message'}
                </label>
                {name === 'message' ? (
                  <textarea
                    {...common}
                    rows={5}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                ) : (
                  <input
                    {...common}
                    type={name === 'email' ? 'email' : 'text'}
                    autoComplete={name}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
                {err && (
                  <p className="field-error" id={`${field.name}-error`}>{err}</p>
                )}
              </div>
            )
          }}
        </form.Field>
      ))}

      {/* Hidden from people (and screen readers); bots that fill every field give themselves away. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <button type="submit" className="btn btn-primary" disabled={!canSubmit || isSubmitting}>
            <Icon name="send" /> {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        )}
      </form.Subscribe>

      <p className="form-status" role="status">
        {status === 'sent' && 'Thanks! Your message has been sent.'}
        {status === 'error' && 'Something went wrong. Please try again or email me directly.'}
      </p>
    </form>
  )
}
