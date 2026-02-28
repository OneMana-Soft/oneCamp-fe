export const getNameInitials = (userName: string | undefined | null) => {
    if (!userName) return "";
    
    // Split the name by whitespace and remove empty strings
    const parts = userName.trim().split(/\s+/);
    
    if (parts.length === 0) return "";
    
    // Get the first initial
    const firstInitial = parts[0][0].toUpperCase();
    
    // Get the last initial if there's more than one part
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";
    
    return firstInitial + lastInitial;
};
