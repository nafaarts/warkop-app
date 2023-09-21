const validateEmail = (email) => {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(String(email).toLocaleLowerCase());
};

const min = (text, n) => {
    return text.length >= n;
};

export { validateEmail, min };
