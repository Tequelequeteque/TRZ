import * as Yup from 'yup';
import { isUuid } from 'uuidv4';

function getValidationUuid(
  message = 'Its not a uuid',
  path = 'id',
): Yup.StringSchema {
  return Yup.string().test(
    '',
    '',
    (value: string) =>
      isUuid(value) || new Yup.ValidationError(message, 'uuid', path),
  );
}

export default getValidationUuid;
