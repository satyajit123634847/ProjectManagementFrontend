import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface SelectOption {
  value: string;
  label: string;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: Yup.AnySchema;
  options?: SelectOption[];
  layoutClasses?: string; 
}

interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  onSubmit: (data: T) => void; 
  submitButtonText?: string;
  submitButtonClass: string;
  initialValues: T; 
}

const ReusableForm = <T extends Record<string, any>>({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  submitButtonClass = "col-12",
  initialValues 
}: FormProps<T>) => {
  
  const validationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      if (field.validation) {
        schema[field.name] = field.validation;
      }
      return schema;
    }, {} as Record<string, Yup.AnySchema>)
  );

  return (
    <Formik
      initialValues={initialValues} 
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            {fields.map((field) => (
              <div className={`${field.layoutClasses || 'col-12'}`} key={field.name}>
                <label htmlFor={field.name} className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <Field
                    as="select"
                    name={field.name}
                    className={`form-select ${errors[field.name] && touched[field.name] ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                ) : (
                  <Field
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className={`form-control ${errors[field.name] && touched[field.name] ? 'is-invalid' : ''}`}
                  />
                )}
                <ErrorMessage name={field.name} component="div" className="invalid-feedback" />
              </div>
            ))}
            <div className={submitButtonClass}>
              <button type="submit" className="btn btn-primary submit-btn w-100 mt-2">{submitButtonText}</button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
