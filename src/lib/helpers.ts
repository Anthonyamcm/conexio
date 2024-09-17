import * as yup from 'yup';

// Type guard to check if a schema is a Yup schema
const isYupSchema = (schema: any): schema is yup.AnySchema => {
  return schema instanceof yup.Schema;
};

// Utility function to validate form data partially
export const validateSchemaPartially = async (
  schema: yup.ObjectSchema<any>,
  formData: { [key: string]: any },
  fieldsToValidate: string[],
): Promise<{ [key: string]: string }> => {
  try {
    // Create a partial schema with only the fields to validate
    const partialSchemaFields = fieldsToValidate.reduce(
      (acc, field) => {
        const fieldSchema = schema.fields[field];
        if (isYupSchema(fieldSchema)) {
          acc[field] = fieldSchema;
        }
        return acc;
      },
      {} as { [key: string]: yup.AnySchema },
    );

    const partialSchema = yup.object(partialSchemaFields);

    // Validate the form data with the partial schema
    await partialSchema.validate(formData, { abortEarly: false });
    return {}; // Return an empty object if validation is successful
  } catch (error: any) {
    // Format and return errors if validation fails
    const formattedErrors = error.inner.reduce(
      (acc: { [key: string]: string }, err: any) => {
        acc[err.path] = err.message;
        return acc;
      },
      {},
    );
    return formattedErrors;
  }
};
