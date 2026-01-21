

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; 
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

export function ValidateEmail(email: string): boolean {
    return emailRegex.test(email); 
}

export function ValidatePassword(password: string): boolean {
    return passwordRegex.test(password); 
}

