
  export function validatePassword(p:string):void {
    if (p.length < 8) {
        throw new Error("Your password must be at least 8 characters");
    }
    if (p.search(/[a-z]/i) < 0) {
        throw new Error("Your password must contain at least one letter."); 
    }
    if (p.search(/[0-9]/) < 0) {
        throw new Error("Your password must contain at least one digit.");
    }
}

  