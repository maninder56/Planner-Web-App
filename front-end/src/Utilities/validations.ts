

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; 
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

export function ValidateEmail(email: string): boolean {
    return emailRegex.test(email); 
}

export function ValidatePassword(password: string): boolean {
    return passwordRegex.test(password); 
}

export function ValidateNewEmail(value: string): string | undefined {
    const valueTrimmed = value.trim(); 
    if (valueTrimmed === '') {
        return 'Email is Required'; 
    } else if (!ValidateEmail(value)) {
        return 'Email is Invalid'; 
    } else {
        return undefined; 
    }
}


export function validateOldPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'Old password is Required'; 
        } else {
            return undefined; 
        }
    }

export function validateNewPassword(value: string): string | undefined {
    const valueTrimmed = value.trim(); 
    if (valueTrimmed === '') {
        return 'Password is Required'; 
    } else if (valueTrimmed.length !== value.length) {
        return 'Trailing spaces are not allowed'; 
    } else if (!ValidatePassword(value)) {
        return 'Your password is not strong, Please provide atleast 8 characters with number, capital and small letters'; 
    } else {
        return undefined; 
    }
}

export function validateRepeatNewPassword(value: string, newPassword: string): string | undefined {
    const valueTrimmed = value.trim(); 
    if (valueTrimmed === '') {
        return 'Please Retype your new password'; 
    } else if (value !== newPassword) {
        return 'Password does not match'; 
    } else {
        return undefined; 
    }
}