import React, { useEffect, useContext,useState } from 'react'
import PropTypes from 'prop-types'
import { Box, css, Spinner } from 'theme-ui'
import Reveal from '@solid-ui-components/Reveal'
import ContentButtons from '@solid-ui-components/ContentButtons'
import FormCheckbox from '@solid-ui-components/ContentForm/FormCheckbox'
import FormInput from '@solid-ui-components/ContentForm/FormInput'
import FormTextarea from '@solid-ui-components/ContentForm/FormTextarea'
import FormHidden from '@solid-ui-components/ContentForm/FormHidden'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import useForm from '@helpers/useForm'
import { FormContext } from '@solid-ui-components/ContentForm'
import { navigate } from "gatsby-link";
const styles = {
  form: {
    position: `relative`
  },
  responseOverlay: {
    position: `absolute`,
    backgroundColor: `transparent`,
    width: `full`,
    height: `105%`,
    transition: `background-color 350ms ease-in`,
    textAlign: `center`,
    zIndex: -1,
    p: 3,
    top: 0,
    left: 0,
    active: {
      zIndex: 0,
      backgroundColor: `rgba(255,255,255,0.85)`
    }
  },
  buttonsWrapper: {
    display: `inline-flex`,
    flexWrap: `wrap`,
    justifyContent: `center`,
    '.button-group-button + .button-group-link': {
      flex: `100%`,
      ml: 0,
      mt: 3
    }
  }
}

const ContentForm = ({ id, form: { action, fields, buttons } = {} }) => {
  const { handleSubmit, submitting, success } = useForm()
  const { formValues, setFormValues } = useContext(FormContext)
  const formId = id
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject:"",
    message: ""
  });

  useEffect(() => {
    return () =>
      success !== undefined &&
      submitting === false &&
      setFormValues({
        ...formValues,
        [formId]: {}
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, submitting, setFormValues])

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormValues({
      ...formValues,
      [formId]: {
        ...formValues?.[formId],
        [e.target.name]: e.target.checked || e.target.value
      }
    })
  }
  function encode(data) {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  const onSubmit = e => {
    handleSubmit(e, { action })
  }

  const handleSubmits = (e) => {
    e.preventDefault();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": e.target.getAttribute("name"),
        ...formData
      }),
    })
      .then(() => navigate(e.target.getAttribute("action")))
      .catch((error) => alert(error));
  };

  return (
    <form
    name="contact"
    method="post"
    action="/thanks/"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    onSubmit={handleSubmits}
  >
       <input type="hidden" name="contact" value="contact" />
      <Box variant='forms.row'>
        {fields?.map(({ identifier, value, ...props }, index) => {
          let Component
          switch (props.type) {
            case 'PASSWORD':
            case 'EMAIL':
            case 'TEXT':
              Component = FormInput
              break
            case 'TEXTAREA':
              Component = FormTextarea
              break
            case 'CHECKBOX':
              Component = FormCheckbox
              break
            case 'HIDDEN':
              Component = FormHidden
              break
            default:
              break
          }

          return (
            <Box
              key={`index-${index}`}
              variant={props.compact ? 'forms.compact' : 'forms.full'}
            >
              <Component
                {...props}
                onChange={onChange}
                name={identifier}
                id={`${formId}.${identifier}`}
                value={formValues?.[formId]?.[identifier] || value || undefined}
              />
            </Box>
          )
        })}
      </Box>
      <Box sx={{ textAlign: `center` }}>
        <ContentButtons
          content={buttons}
          wrapperStyles={styles.buttonsWrapper}
        />
      </Box>
      <Box
        sx={styles.responseOverlay}
        css={(submitting || success) && styles.responseOverlay.active}
      >
        {submitting && (
          <Reveal effect='fadeInDown'>
            <Spinner size='64' color='alpha' />
          </Reveal>
        )}
        {success === true && (
          <Reveal effect='fadeInDown'>
            <BiCheckCircle size='64' css={css({ color: `success` })} />
          </Reveal>
        )}
        {success === false && (
          <BiErrorCircle size='64' css={css({ color: `error` })} />
        )}
      </Box>
    </form>
  )
}

export default ContentForm

ContentForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  success: PropTypes.bool
}
