const validateUser = (user) => {
    const errors = {};
  
    const addError = (field, message) => {
      errors[field] = message;
      errors.status = true;
    };
  
    if (!user.firstname) {
      addError('firstname', 'Firstname is required');
    }

    if (!user.lastname) {
      addError('lastname', 'Lastname is required');
    }
  
    if (!user.username) {
      addError('username', 'Email is required');
    } else if (!isValidEmail(user.username)) {
      addError('username', 'Invalid email format');
    }
  
    if (!user.tel) {
      addError('tel', 'Phone number is required');
    }
  
    if (!user.password) {
      addError('password', 'Password is required');
    } else if (user.password.length < 8) {
      addError('password', 'Password must be at least 8 characters long');
    }
  
    if (user.password !== user.confirmPassword) {
      addError('confirmPassword', 'Passwords do not match');
    }
  
    if (!user.gender) {
      addError('gender', 'Gender is required');
    }
  
    if (!user.dob) {
      addError('dob', 'Date of birth is required');
    }
  
    return { errors, hasErrors: errors.status };
  };
  
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  export default validateUser