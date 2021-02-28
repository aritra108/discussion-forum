import validator from "email-validator";
import passwordValidator from "password-validator";

const schema = new passwordValidator();

schema
  .is()
  .min(6) // Minimum length 6
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 1 digit
  .has()
  .not()
  .spaces(); // Should not have spaces

export const validateEmailandPassword = (email, password) => {
  if (!validator.validate(email)) {
    alert("Invalid Email");
    return false;
  } else if (!schema.validate(password)) {
    alert(
      "Invalid Password\n" +
        "1. Password must be at least 6 characters long and atmost 100 characters long\n" +
        "2. Password must have at least one uppercase letter, lowercase letter and digit.\n" +
        "3. Password must not have any spaces"
    );
    return false;
  }

  return true;
};

export const validateUsernameEmailandPassword = (username, email, password) => {
  if (username.length < 3 && username.length > 40) {
    alert(
      "Username must be at least 3 characters and atmost 40 characters long"
    );
    return false;
  } else if (!validateEmailandPassword(email, password)) {
    return false;
  }

  return true;
};
