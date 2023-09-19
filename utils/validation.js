const validateEmail = (email) => {
    return String(email)
    .toLocaleLowerCase()
    .match(/^\S+@\S+\.\S+$/)?.length === 1;
  };

export {validateEmail}